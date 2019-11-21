import React, { useState } from 'react';
import { graphql, Link } from 'gatsby';
import { Layout as AntLayout, Menu, Icon, Tooltip, Affix } from 'antd';
import { groupBy } from 'lodash-es';
import { useTranslation } from 'react-i18next';
import Drawer from 'rc-drawer';
import { useMedia } from 'react-use';
import Article from '../components/Article';
import ReadingTime from '../components/ReadingTime';
import NavigatorBanner from '../components/NavigatorBanner';
import SEO from '../components/Seo';
import styles from './markdown.module.less';

const shouldBeShown = (slug: string, path: string, lang: string) => {
  if (!slug.startsWith(`/${lang}/`)) {
    return false;
  }
  const slugPieces = slug.split('/').slice(slug.split('/').indexOf('docs') + 1);
  const pathPieces = path.split('/').slice(slug.split('/').indexOf('docs') + 1);
  return slugPieces[0] === pathPieces[0];
};

const getMenuItemLocaleKey = (slug = '') => {
  const slugPieces = slug.split('/');
  const menuItemLocaleKey = slugPieces
    .slice(slugPieces.indexOf('docs') + 1)
    .filter(key => key)
    .join('/');
  return menuItemLocaleKey;
};

const getDocument = (docs: any[], slug = '', level: number) => {
  if (slug.split('/').length !== level + 2) {
    return;
  }
  return docs.find(doc => doc.slug === slug);
};

interface MenuData {
  type: 'SubMenu' | 'Item';
  title: string;
  slug: string;
  order?: number;
  children?: MenuData[];
}

const getMenuData = ({ groupedEdges, language, docs = [], level = 0 }: any) => {
  const results = [] as MenuData[];
  Object.keys(groupedEdges).forEach((key: string) => {
    const edges = groupedEdges[key] || [];
    const categoryKey = getMenuItemLocaleKey(key);
    const category = getDocument(docs, categoryKey, level);
    if (!category) {
      if (categoryKey.split('/').length !== level + 1) {
        return;
      }
      edges.forEach((edge: any) => {
        const {
          node: {
            frontmatter: { title, order },
            fields: { slug },
          },
        } = edge;
        results.push({
          type: 'Item',
          slug,
          title,
          order,
        });
      });
    } else {
      const subGroupedEdges = {} as any;
      Object.keys(groupedEdges).forEach((item: string) => {
        if (item.startsWith(key)) {
          subGroupedEdges[item] = groupedEdges[item];
        }
      });
      results.push({
        type: 'SubMenu',
        title:
          category.title && category.title[language]
            ? category.title[language]
            : categoryKey,
        slug: key,
        order: category.order || 0,
        children: getMenuData({
          groupedEdges: subGroupedEdges,
          language,
          docs,
          level: level + 1,
        }),
      });
    }
  });
  return results.sort((a: any, b: any) => a.order - b.order);
};

const renderMenu = (menuData: MenuData[]) =>
  menuData.map((item: MenuData) => {
    if (item.type === 'Item') {
      return (
        <Menu.Item key={item.slug}>
          <Link to={item.slug}>{item.title}</Link>
        </Menu.Item>
      );
    }
    if (item.type === 'SubMenu') {
      return (
        item.children &&
        item.children.length > 0 && (
          <Menu.SubMenu key={item.slug} title={item.title}>
            {renderMenu(item.children)}
          </Menu.SubMenu>
        )
      );
    }
    return null;
  });

export default function Template({
  data, // this prop will be injected by the GraphQL query below.
  location,
  pageContext: { prev, next },
}: {
  data: any;
  location: Location;
  pageContext: {
    prev: any;
    next: any;
  };
}) {
  const { markdownRemark, allMarkdownRemark, site } = data; // data.markdownRemark holds our post data
  const {
    frontmatter,
    html,
    tableOfContents,
    fields: { slug, readingTime },
    parent: { relativePath },
  } = markdownRemark;
  const { edges = [] } = allMarkdownRemark;
  const edgesInDocs = edges.filter((item: any) =>
    item.node.fields.slug.includes('/docs/'),
  );
  const {
    siteMetadata: { docs = [], githubUrl },
    pathPrefix,
  } = site;
  const pathWithoutPrefix = location.pathname.replace(
    new RegExp(`^${pathPrefix}`),
    '',
  );
  const { t, i18n } = useTranslation();
  const groupedEdges = groupBy(
    edgesInDocs,
    ({
      node: {
        fields: { slug: slugString },
      },
    }: any) =>
      slugString
        .split('/')
        .slice(0, -1)
        .join('/'),
  );

  const filterGroupedEdges = {} as any;
  Object.keys(groupedEdges)
    .filter(key => shouldBeShown(key, pathWithoutPrefix, i18n.language))
    .forEach((key: string) => {
      filterGroupedEdges[key] = groupedEdges[key];
    });

  const [openKeys, setOpenKeys] = useState<string[]>(
    Object.keys(filterGroupedEdges).filter(key => slug.startsWith(key)),
  );

  const menuData = getMenuData({
    groupedEdges: filterGroupedEdges,
    language: i18n.language,
    docs,
  });

  const menu = (
    <Menu
      mode="inline"
      selectedKeys={[slug]}
      style={{ height: '100%' }}
      openKeys={openKeys}
      onOpenChange={currentOpenKeys => setOpenKeys(currentOpenKeys)}
      inlineIndent={16}
    >
      {renderMenu(menuData)}
    </Menu>
  );

  const isWide = useMedia('(min-width: 767.99px)', true);
  const [drawOpen, setDrawOpen] = useState(false);
  const menuSider = isWide ? (
    <AntLayout.Sider width="auto" theme="light" className={styles.sider}>
      {menu}
    </AntLayout.Sider>
  ) : (
    <Drawer
      handler={
        <Icon
          className={styles.menuSwitch}
          type={drawOpen ? 'menu-fold' : 'menu-unfold'}
        />
      }
      wrapperClassName={styles.menuDrawer}
      onChange={open => setDrawOpen(!!open)}
      width={280}
    >
      {menu}
    </Drawer>
  );

  return (
    <>
      <SEO title={frontmatter.title} lang={i18n.language} />
      <AntLayout
        style={{ background: '#fff' }}
        hasSider
        className={styles.layout}
      >
        {menuSider}
        <Article className={styles.markdown}>
          <Affix offsetTop={8}>
            <div
              className={styles.toc}
              /* eslint-disable-next-line react/no-danger */
              dangerouslySetInnerHTML={{ __html: tableOfContents }}
            />
          </Affix>
          <div className={styles.main}>
            <h1>
              {frontmatter.title}
              <Tooltip title={t('在 GitHub 上编辑')}>
                <a
                  href={`${githubUrl}/edit/master/docs/${relativePath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.editOnGtiHubButton}
                >
                  <Icon type="edit" />
                </a>
              </Tooltip>
            </h1>
            <div className={styles.meta}>
              <ReadingTime readingTime={readingTime} />
            </div>
            <div
              /* eslint-disable-next-line react/no-danger */
              dangerouslySetInnerHTML={{ __html: html }}
              className={styles.content}
            />
            <div>
              <NavigatorBanner type="prev" post={prev} />
              <NavigatorBanner type="next" post={next} />
            </div>
          </div>
        </Article>
      </AntLayout>
    </>
  );
}

export const pageQuery = graphql`
  query($path: String!) {
    site {
      siteMetadata {
        title
        githubUrl
        docs {
          slug
          title {
            zh
            en
          }
          order
        }
      }
      pathPrefix
    }
    markdownRemark(fields: { slug: { eq: $path } }) {
      html
      tableOfContents
      fields {
        slug
        readingTime {
          text
          time
        }
      }
      frontmatter {
        title
      }
      parent {
        ... on File {
          relativePath
        }
      }
    }
    allMarkdownRemark(
      sort: { order: ASC, fields: [frontmatter___order] }
      limit: 1000
    ) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
            order
          }
        }
      }
    }
  }
`;
