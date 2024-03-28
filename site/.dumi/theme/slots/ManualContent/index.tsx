import {
  EditOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  VerticalAlignTopOutlined,
} from '@ant-design/icons';
import { Affix, BackTop, Layout, Menu, Tooltip } from 'antd';
import { useFullSidebarData, useLocale, useRouteMeta, useSiteData } from 'dumi';
import Drawer from 'rc-drawer';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMedia } from 'react-use';
import readingTime from 'reading-time';
import URI from 'uri-parse';

import { ContentTable } from '@antv/dumi-theme-antv/dist/slots/ContentTable';
import { SEO } from '@antv/dumi-theme-antv/dist/slots/SEO';
import GithubButtonBar from '../GithubButtonBar';

import { NavigatorBanner } from '@antv/dumi-theme-antv/dist/slots/ManualContent/NavigatorBanner';
import ReadingTime from '@antv/dumi-theme-antv/dist/slots/ManualContent/ReadingTime';
import { usePreview } from '@antv/dumi-theme-antv/dist/slots/ManualContent/usePreview';
import { useScrollToTop } from '@antv/dumi-theme-antv/dist/slots/hooks';
import { getBaseRoute, getIndexRoute, getNavigateUrl, getOpenKeys } from './utils';

import 'rc-drawer/assets/index.css';
import styles from './index.module.less';

export type ManualContent = {
  readonly children: any;
};

type PreAndNext = {
  slug?: string | undefined;
  title?: string | undefined;
};

type linkToTitle = {
  [ket: string]: string;
};

type MenuItem = {
  key: string;
  label?: string;
  slug?: string;
  title: {
    zh: string;
    en: string;
  };
  order: number;
  link?: string;
  children?: MenuItem[];
};

type FullSidebarData = {
  [key: string]: SidebarData;
};

type SidebarData = MenuItem[];

/**
 * 文档的结构
 */
export const ManualContent: React.FC<ManualContent> = ({ children }) => {
  const locale = useLocale();
  const currentLocale: string = locale.id;
  const {
    themeConfig: { githubUrl, relativePath, docs },
  } = useSiteData();
  const sidebar = useFullSidebarData() as unknown as FullSidebarData;

  const is767Wide = useMedia('(min-width: 767.99px)', true);
  const is991Wide = useMedia('(min-width: 991.99px)', true);

  const [drawOpen, setDrawOpen] = useState(false);
  const navigate = useNavigate();

  // 获取阅读时间
  const mdInfo = useRouteMeta();
  const text = mdInfo.texts.reduce((prev, next) => {
    return prev + next.value;
  }, '');
  const { time } = readingTime(text);

  // linkoTitle用来映射路由和Title
  const linkoTitle: linkToTitle = {};
  for (const route of Object.values(sidebar)) {
    route[0].children.forEach((item) => {
      linkoTitle[item.link] = item.title as unknown as string;
    });
  }
  /**
   *  /api/xxx -->  /api
   *  /en/api  -->  /en/api
   */
  const baseRoute = getBaseRoute();

  // 获取最终的 MenuData
  const renderSidebar = getMenuData(sidebar, docs, baseRoute, []);
  function getMenuData(
    funllSidebarData: FullSidebarData,
    rootList: SidebarData,
    hrefId: string,
    list: SidebarData,
  ) {
    function fullSidebarDataToMenuData(rootList: SidebarData, hrefId: string, list: SidebarData) {
      // 递归
      rootList.forEach((item: MenuItem) => {
        const href = (
          !baseRoute.startsWith('/en') ? `/${item.slug}` : `/en/${item.slug}`
        ).toLocaleLowerCase();
        const id = href
          .split('/')
          .slice(0, href.split('/').length - 1)
          .join('/');
        if (href.includes(baseRoute)) {
          if (id === hrefId) {
            list.push({
              ...item,
              key: href,
              label: item.title[currentLocale as 'zh' | 'en'],
            });
          }
        }
      });
      for (const item of list) {
        item.children = [];
        fullSidebarDataToMenuData(rootList, item.key, item.children);
        funllSidebarData[item.key] &&
          funllSidebarData[item.key][0].children?.forEach((itemChild) => {
            const label = itemChild.title as unknown as string;
            const key = itemChild.link as string;
            item.children!.push({
              ...itemChild,
              label,
              key,
            });
          });
        // children 的 order 排序
        item.children.sort((a, b) => a.order - b.order);
        if (item.children.length == 0) {
          delete item.children;
        }
      }

      if (hrefId == baseRoute) {
        funllSidebarData[baseRoute] &&
          funllSidebarData[baseRoute][0].children?.forEach((itemChild) => {
            const key = itemChild.link!;
            const label = itemChild.title as unknown as string;
            list.push({
              ...itemChild,
              label,
              key,
            });
          });
        list.sort((a, b) => {
          return a.order - b.order;
        });
        return list;
      }
    }
    return fullSidebarDataToMenuData(rootList, hrefId, list);
  }

  // 获取打开的菜单栏
  const [defaultOpenKeys, setDefaultOpenKeys] = useState<string[]>(() => getOpenKeys());

  // 获取第一个md文件的路由
  const indexRoute = getIndexRoute(renderSidebar);

  // 点击菜单栏
  const onClick = (e: any) => {
    navigate(e.key);
    useScrollToTop();
  };
  const [defaultSelectedKey, setDefaultSelectedKey] = useState<string>();
  //上一夜下一页
  const [prev, setPrev] = useState<PreAndNext | undefined>(undefined);
  const [next, setNext] = useState<PreAndNext | undefined>(undefined);

  // 所有的 sidebar 路由
  const sidebarRoutes = [];
  for (const route of Object.keys(linkoTitle)) {
    sidebarRoutes.push(route);
  }

  const uri = new URI(location.href);
  uri.path = getNavigateUrl(`/${uri.path}`, indexRoute, sidebarRoutes);
  if (`${uri.path}` !== window.location.pathname) {
    uri.path = uri.path.slice(1);
    navigate(uri.toURI().replace(location.origin, ''));
  }

  // 改变菜单栏选中和 openKeys 状态
  useEffect(() => {
    if (window.location.pathname == indexRoute) {
      setDefaultOpenKeys(getOpenKeys());
    }
    setDefaultSelectedKey(window.location.pathname);
  }, [window.location.pathname]);

  useEffect(() => {
    // 监听选中的menu-item 拿到 prev and next
    getPreAndNext();
  }, [defaultSelectedKey]);

  usePreview({}, defaultSelectedKey);

  function getPreAndNext() {
    const menuNodes = document.querySelectorAll('aside .ant-menu-item');
    const currentMenuNode = document.querySelector('aside .ant-menu-item-selected');
    // @ts-ignore
    const currentIndex = Array.from(menuNodes).findIndex((node) => node === currentMenuNode);

    const prevNode = currentIndex - 1 >= 0 ? menuNodes[currentIndex - 1] : undefined;
    const nextNode = currentIndex + 1 < menuNodes.length ? menuNodes[currentIndex + 1] : undefined;

    setPrev(
      prevNode
        ? {
            slug: prevNode.getAttribute('link') || undefined,
            title: prevNode.textContent || undefined,
          }
        : undefined,
    );
    setNext(
      nextNode
        ? {
            slug: nextNode.getAttribute('link') || undefined,
            title: nextNode.textContent || undefined,
          }
        : undefined,
    );
  }
  const getGithubSourceUrl = ({
    githubUrl,
    relativePath,
    prefix,
  }: {
    githubUrl: string;
    relativePath: string;
    prefix: string;
  }): string => {
    const path = uri.path.replace(`/en`, '');
    const lang = !baseRoute.startsWith('/en') ? 'zh' : 'en';
    return `${githubUrl}/edit/master/${relativePath}/docs${path}.${lang}.md`;
  };
  const menu = (
    <Menu
      onClick={onClick}
      onOpenChange={(openKeys) => {
        setDefaultOpenKeys(openKeys);
      }}
      selectedKeys={[defaultSelectedKey]}
      openKeys={defaultOpenKeys}
      mode="inline"
      items={renderSidebar}
      inlineIndent={16}
      style={{ height: '100%' }}
      forceSubMenuRender
      triggerSubMenuAction="click"
    />
  );

  return (
    <>
      <SEO title={linkoTitle[window.location.pathname]} lang={locale.id} />
      <Layout style={{ background: '#fff' }} hasSider className={styles.layout}>
        <Affix
          offsetTop={0}
          className={styles.affix}
          style={{ height: is767Wide ? '100vh' : 'inherit' }}
        >
          {is767Wide ? (
            <Layout.Sider width="auto" theme="light" className={styles.sider}>
              {menu}
            </Layout.Sider>
          ) : (
            <Drawer
              handler={
                drawOpen ? (
                  <MenuFoldOutlined className={styles.menuSwitch} />
                ) : (
                  <MenuUnfoldOutlined className={styles.menuSwitch} />
                )
              }
              wrapperClassName={styles.menuDrawer}
              onChange={(open?: boolean) => setDrawOpen(!!open)}
              width={280}
            >
              {menu}
            </Drawer>
          )}
        </Affix>
        <Layout.Content className={styles.content}>
          <div className={styles.main}>
            <h1 className={styles.contentTitle}>
              {linkoTitle[window.location.pathname]}
              {/* todo 编辑地址各种各样，需要有单独的配置，暂时关闭！这儿忘关了 */}
              <Tooltip title={'在 GitHub 上编辑'}>
                <a
                  href={getGithubSourceUrl({
                    githubUrl,
                    relativePath,
                    prefix: 'docs',
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.editOnGtiHubButton}
                >
                  <EditOutlined />
                </a>
              </Tooltip>
              <GithubButtonBar />
            </h1>
            <div className={styles.readtimeContainer}>
              <ReadingTime readingTime={time} className={styles.readtime}></ReadingTime>
            </div>
            <div className={styles.markdown}>{children}</div>
            <div>
              <div className={styles.preandnext}>
                <NavigatorBanner type="prev" post={prev} />
                <NavigatorBanner type="next" post={next} />
                <BackTop style={{ right: 32 }}>
                  <div className={styles.backTop}>
                    <VerticalAlignTopOutlined />
                  </div>
                </BackTop>
              </div>
            </div>
          </div>
        </Layout.Content>
        {/** @toc-width: 260px; */}
        {is991Wide ? (
          <Layout.Sider theme="light" width={260}>
            <Affix className={styles.toc}>
              <ContentTable />
            </Affix>
          </Layout.Sider>
        ) : (
          <div></div>
        )}
      </Layout>
    </>
  );
};
