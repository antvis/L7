/* eslint @typescript-eslint/camelcase: 0 */
const path = require('path');

module.exports = ({
  pagesPath = './site/pages',
  GATrackingId,
  theme = {
    'primary-color': '#722ED1',
  },
  pathPrefix,
  pwa = true,
  cname = true,
}) => {
  const config = {
    siteMetadata: {
      title: `AntV`,
      description: `Ant Visualization solution home page`,
      githubUrl: 'https://github.com/antvis/gatsby-theme-antv',
      navs: [],
      docs: [],
      examples: [],
    },
    plugins: [
      `gatsby-plugin-react-helmet`,
      {
        resolve: `gatsby-source-filesystem`,
        options: {
          name: `docs`,
          path: path.resolve('./docs'),
          ignore: [`**/.*`],
        },
      },
      {
        resolve: `gatsby-source-filesystem`,
        options: {
          name: `images`,
          path: path.resolve('./site/images'),
          ignore: [`**/.*`],
        },
      },
      {
        resolve: `gatsby-source-filesystem`,
        options: {
          name: `examples`,
          path: path.resolve('./examples'),
          ignore: [`**/.*`],
        },
      },
      {
        resolve: 'gatsby-plugin-copy-files',
        options: {
          source: path.resolve('./examples/data'),
          destination: `zh/examples/data`,
        },
      },
      {
        resolve: 'gatsby-plugin-copy-files',
        options: {
          source: path.resolve('./examples/data'),
          destination: `en/examples/data`,
        },
      },
      {
        resolve: 'gatsby-plugin-i18n',
        options: {
          langKeyDefault: 'zh',
          useLangKeyLayout: false,
          pagesPaths: [`${__dirname}/site/pages`, path.resolve(pagesPath)],
        },
      },
      {
        resolve: `gatsby-transformer-remark`,
        options: {
          plugins: [
            {
              resolve: `gatsby-remark-prettier`,
              options: {
                // Look for local .prettierrc file.
                // The same as `prettier.resolveConfig(process.cwd())`
                usePrettierrc: false,
                // Overwrite prettier options, check out https://prettier.io/docs/en/options.html
                prettierOptions: {
                  endOfLine: 'lf',
                  semi: true,
                  singleQuote: true,
                  tabWidth: 2,
                  trailingComma: 'all',
                },
              },
            },
            {
              resolve: `gatsby-remark-prismjs`,
              options: {
                inlineCodeMarker: '±',
              },
            },
            {
              resolve: 'gatsby-remark-external-links',
              options: {
                target: '_self',
                rel: 'nofollow',
              },
            },
            `gatsby-remark-autolink-headers`,
            `gatsby-remark-reading-time`,
          ],
        },
      },
      `gatsby-plugin-sharp`,
      `gatsby-transformer-sharp`,
      pwa ? `gatsby-plugin-offline` : `gatsby-plugin-remove-serviceworker`,
      {
        resolve: `gatsby-plugin-manifest`,
        options: {
          name: `gatsby-starter-default`,
          short_name: `starter`,
          start_url: `/`,
          background_color: theme['primary-color'],
          theme_color: theme['primary-color'],
          display: `minimal-ui`,
          icon: require.resolve(`./site/images/favicon.png`), // This path is relative to the root of the site.
        },
      },
      `gatsby-plugin-typescript`,
      {
        resolve: 'gatsby-plugin-less',
        options: {
          javascriptEnabled: true,
          modifyVars: {
            'primary-color': '#722ED1',
            'text-color': '#0D1A26',
            'heading-color': '#0D1A26',
            'menu-item-color': '#314659',
            'font-family': `Avenir, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', sans-serif`,
            ...theme,
          },
        },
      },
      {
        resolve: 'gatsby-plugin-react-svg',
        options: {
          rule: {
            include: /images/, // See below to configure properly
          },
        },
      },
      {
        resolve: 'gatsby-plugin-antd',
        options: {
          style: true,
        },
      },
      cname ? `gatsby-plugin-cname` : '',
      `gatsby-plugin-catch-links`,
      `gatsby-plugin-sitemap`,
      `gatsby-plugin-nprogress`,
      `gatsby-plugin-remove-trailing-slashes`,
      // You can have multiple instances of this plugin
      // to create pages from React components in different directories.
      //
      // The following sets up the pattern of having multiple
      // "pages" directories in your project
      {
        resolve: `gatsby-plugin-page-creator`,
        options: {
          path: `${__dirname}/site/pages`,
        },
      },
      {
        resolve: `gatsby-plugin-page-creator`,
        options: {
          path: path.resolve(pagesPath),
        },
      },
      {
        resolve: `gatsby-plugin-layout`,
        options: {
          component: require.resolve(`./site/layouts/layout.tsx`),
        },
      },
      {
        resolve: `gatsby-plugin-nprogress`,
        options: {
          // Setting a color is optional.
          color: theme['primary-color'],
        },
      },
    ],
  };

  if ('GATSBY_PATH_PREFIX' in process.env) {
    // eslint-disable-next-line no-console
    console.log(
      `'GATSBY_PATH_PREFIX' in process.env: ${process.env.GATSBY_PATH_PREFIX}`,
    );
    // eslint-disable-next-line no-console
    console.log(
      `typeof process.env.GATSBY_PATH_PREFIX: ${typeof process.env
        .GATSBY_PATH_PREFIX}`,
    );
    if (
      process.env.GATSBY_PATH_PREFIX &&
      process.env.GATSBY_PATH_PREFIX !== '/'
    ) {
      config.pathPrefix = process.env.GATSBY_PATH_PREFIX;
    }
  } else {
    config.pathPrefix = pathPrefix;
  }

  if (GATrackingId) {
    config.plugins.push({
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: GATrackingId,
      },
    });
  }

  config.plugins.push('gatsby-redirect-from');
  config.plugins.push('gatsby-plugin-meta-redirect');

  return config;
};
