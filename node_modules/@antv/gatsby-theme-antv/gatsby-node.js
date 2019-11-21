/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it
const path = require(`path`);
const fs = require('fs');
const mkdirp = require('mkdirp');
const shallowequal = require('shallowequal');
const { getSlugAndLang } = require('ptz-i18n');
const { transform } = require('@babel/standalone');

const documentTemplate = require.resolve(`./site/templates/document.tsx`);
const exampleTemplate = require.resolve(`./site/templates/example.tsx`);

let locale = {};
try {
  locale = JSON.parse(
    fs.readFileSync(path.resolve(`site/locale.json`), `utf8`),
  );
} catch (e) {
  // eslint-disable-next-line no-console
  console.error(e);
}

const resources = {
  en: {
    translation: {
      ...locale,
      ...require('./site/common.json'), // eslint-disable-line global-require
    },
  },
};

function getExampleOrder(post, siteMetadata) {
  if (!post) {
    return 0;
  }
  const {
    fields: { slug },
    frontmatter: { order },
  } = post.node;
  const { examples = [] } = siteMetadata;
  const categoryOrder =
    examples.findIndex(item => item.slug === slug.split('/')[3]) + 1;
  return (order || 0) + categoryOrder * 100;
}

function isSameCategory(target = {}, current = {}) {
  if (!target.node || !current.node) {
    return false;
  }
  const currentSlug = current.node.fields.slug;
  const targetSlug = target.node.fields.slug;
  if (
    currentSlug.startsWith('/zh/examples/') ||
    currentSlug.startsWith('/en/examples/')
  ) {
    return shallowequal(
      targetSlug.split('/').slice(0, 3),
      currentSlug.split('/').slice(0, 3),
    );
  }
  return shallowequal(
    targetSlug.split('/').slice(0, 4),
    currentSlug.split('/').slice(0, 4),
  );
}

function findPrevAndNext(current, posts = []) {
  const index = posts.indexOf(current);
  const result = {};
  if (!current || index < 0) {
    return result;
  }
  for (let i = index + 1; i <= posts.length; i += 1) {
    if (isSameCategory(posts[i], current)) {
      result.next = posts[i];
      break;
    }
  }
  for (let i = index - 1; i >= 0; i -= 1) {
    if (isSameCategory(posts[i], current)) {
      result.prev = posts[i];
      break;
    }
  }
  return result;
}

exports.onPreBootstrap = ({ store, reporter }) => {
  const { program } = store.getState();

  const dirs = [
    path.join(program.directory, 'docs'),
    path.join(program.directory, 'site'),
    path.join(program.directory, 'examples'),
    path.join(program.directory, 'examples/data'),
    path.join(program.directory, 'site/images'),
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      reporter.log(`creating the ${dir} directory`);
      mkdirp.sync(dir);
    }
  });
};

// Add custom url pathname for posts
exports.onCreateNode = ({ node, actions, store }) => {
  const { createNodeField } = actions;
  const { program } = store.getState();
  if (node.internal.type === `File`) {
    createNodeField({
      node,
    });
  } else if (node.internal.type === `MarkdownRemark`) {
    const { slug, langKey } = getSlugAndLang(
      {
        langKeyForNull: 'any',
        langKeyDefault: 'none',
        useLangKeyLayout: false,
        pagesPaths: [program.directory],
        prefixDefault: true,
      },
      node.fileAbsolutePath,
    );
    if (!slug) {
      return;
    }
    createNodeField({
      node,
      name: `slug`,
      value: (langKey === 'none' ? `/zh${slug}` : slug).replace(/\/$/, ''),
    });
    createNodeField({
      node,
      name: `langKey`,
      value: langKey,
    });
  }
};

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions;
  const result = await graphql(`
    {
      allMarkdownRemark(limit: 1000) {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              title
              order
            }
            html
          }
        }
      }
      allFile(limit: 1000) {
        nodes {
          relativePath
          absolutePath
        }
      }
      site {
        siteMetadata {
          examples {
            slug
          }
        }
      }
    }
  `);
  // Handle errors
  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`);
    return;
  }

  const {
    site: { siteMetadata },
    allMarkdownRemark,
    allFile,
  } = result.data;

  const posts = allMarkdownRemark.edges;
  const allDemos = allFile.nodes
    .filter(node => /demo\/(.*)\.[t|j]sx?$/.test(node.relativePath))
    .map(item => {
      const source = fs.readFileSync(item.absolutePath, 'utf8');
      let meta;
      try {
        meta = JSON.parse(
          fs.readFileSync(
            path.join(path.dirname(item.absolutePath), 'meta.json'),
            'utf8',
          ) || '{}',
        );
      } catch (e) {
        meta = {};
      }
      const { code } = transform(source, {
        filename: item.absolutePath,
        presets: ['react', 'typescript', 'es2015', 'stage-3'],
        plugins: ['transform-modules-umd'],
        babelrc: false,
      });
      const order = (meta.demos || []).findIndex(
        ({ filename }) => filename === path.basename(item.relativePath),
      );
      const demoInfo = (meta.demos || [])[order] || {};
      return {
        ...item,
        source,
        babeledSource: code,
        order: order || 0,
        filename: path.basename(item.relativePath),
        ...demoInfo,
      };
    });
  posts.forEach(({ node }, index) => {
    const { slug } = node.fields;
    const context = {};
    const isExamplePage =
      slug.startsWith(`/zh/examples`) || slug.startsWith(`/en/examples`);
    if (isExamplePage) {
      let exampleRootSlug = slug;
      if (/\/examples\/.*\/API$/.test(slug)) {
        exampleRootSlug = exampleRootSlug.replace(/\/API$/, '');
      } else if (/\/examples\/.*\/design$/.test(slug)) {
        exampleRootSlug = exampleRootSlug.replace(/\/design$/, '');
      }
      const design = posts.find(post => {
        const { slug: postSlug } = post.node.fields;
        return postSlug === `${exampleRootSlug}/design`;
      });
      const API = posts.find(post => {
        const { slug: postSlug } = post.node.fields;
        return postSlug === `${exampleRootSlug}/API`;
      });
      const examples = allDemos
        .filter(item => {
          return `${exampleRootSlug}/demo`.endsWith(
            path.join('examples', path.dirname(item.relativePath)),
          );
        })
        .sort((a, b) => a.order - b.order);
      context.exampleSections = {
        examples,
        design,
        API,
      };
      const examplePosts = posts
        .filter(item => !!item)
        .filter(
          ({
            node: {
              fields: { slug: postSlug },
            },
          }) =>
            postSlug.startsWith(`/zh/examples`) ||
            postSlug.startsWith(`/en/examples`),
        )
        .filter(
          ({
            node: {
              fields: { slug: postSlug },
            },
          }) => !postSlug.endsWith('/design') && !postSlug.endsWith('/API'),
        )
        .sort((a, b) => {
          return (
            getExampleOrder(a, siteMetadata) - getExampleOrder(b, siteMetadata)
          );
        });
      const { prev, next } = findPrevAndNext(posts[index], examplePosts);
      context.prev = prev;
      context.next = next;
    } else {
      const { prev, next } = findPrevAndNext(posts[index], posts);
      context.prev = prev;
      context.next = next;
    }

    createPage({
      path: slug, // required
      component: isExamplePage ? exampleTemplate : documentTemplate,
      context,
    });
  });
};

exports.onCreateWebpackConfig = ({ getConfig, stage, plugins }) => {
  const config = getConfig();
  if (stage.startsWith('develop') && config.resolve) {
    config.resolve.alias = {
      ...config.resolve.alias,
      'react-dom': '@hot-loader/react-dom',
    };
  }
  config.plugins = [
    ...config.plugins,
    plugins.define({
      I18NEXT_RESOURCES: JSON.stringify(resources),
    }),
  ];
};

exports.createSchemaCustomization = ({ actions }) => {
  const { createFieldExtension } = actions;

  createFieldExtension({
    name: `defaultString`,
    extend() {
      return {
        resolve(source, args, context, info) {
          if (source[info.fieldName] == null) {
            return '';
          }
          return source[info.fieldName];
        },
      };
    },
  });
};

// 补充默认值
// https://stackoverflow.com/questions/50770217/how-to-give-gatsby-a-graphql-schema
// https://graphql.org/learn/schema/
exports.sourceNodes = ({ actions }) => {
  const { createTypes } = actions;

  createTypes(`
    type MarkdownRemarkFrontmatter {
      icon: String
      order: Int
      redirect_from: [String]
    }

    type MarkdownRemark implements Node {
      frontmatter: MarkdownRemarkFrontmatter
    }
  `);

  createTypes(`
    type PlayGround implements Node {
      container: String
      playgroundDidMount: String
      playgroundWillUnmount: String
    }

    type SiteSiteMetadataTitle implements Node {
      zh: String
      en: String
    }

    type SiteSiteMetadataDocs implements Node {
      slug: String!
      title: SiteSiteMetadataTitle!
      order: Int
    }

    type SiteSiteMetadataExamples implements Node {
      slug: String!
      title: SiteSiteMetadataTitle!
      icon: String
      order: Int
    }

    type SiteSiteMetadataNavs implements Node {
      slug: String!
      title: SiteSiteMetadataTitle!
      target: String
    }

    type SiteSiteMetadataRedirects implements Node {
      from: String!
      to: String
    }

    type SiteSiteMetadata implements Node {
      title: String!
      description: String!
      githubUrl: String!
      siteUrl: String @defaultString
      logoUrl: String
      navs: [SiteSiteMetadataNavs]
      docs: [SiteSiteMetadataDocs]
      examples: [SiteSiteMetadataExamples]
      redirects: [SiteSiteMetadataRedirects]
      showLanguageSwitcher: Boolean
      playground: PlayGround
    }

    type Site implements Node {
      siteMetadata: SiteSiteMetadata
    }
  `);
};
