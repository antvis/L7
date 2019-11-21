/* eslint jsx-a11y/anchor-is-valid: 0 */
import { navigate } from 'gatsby';
import React, { useState, useEffect } from 'react';
import { useMedia } from 'react-use';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { Icon, message } from 'antd';
import GitUrlParse from 'git-url-parse';
import Search from './Search';
import Products from './Products';
import NavMenuItems, { Nav } from './NavMenuItems';
import AntvLogo from '../images/antv.svg';
import ExternalLink from '../images/external-link.svg';
import styles from './Header.module.less';

interface HeaderProps {
  pathPrefix?: string;
  path?: string;
  /** 子标题 */
  subTitle?: React.ReactNode;
  /** 子标题的链接 */
  subTitleHref?: string;
  /** 文档和演示的菜单数据 */
  navs?: Nav[];
  /** 是否显示搜索框 */
  showSearch?: boolean;
  /** 是否显示搜索框 */
  showGithubCorner?: boolean;
  /** 是否显示切换语言选项 */
  showLanguageSwitcher?: boolean;
  /** 切换语言的回调 */
  onLanguageChange?: (language: string) => void;
  /** 自定义 logo */
  logo?: {
    img?: React.ReactNode;
    link?: string;
  };
  siteUrl?: string;
  /** github 仓库地址 */
  githubUrl?: string;
  /** 默认语言 */
  defaultLanguage?: 'zh' | 'en';
  /** 自定义 Link */
  Link?: React.ComponentType<any>;
  /** 底色是否透明 */
  transparent?: boolean;
  /** 是否首页模式 */
  isHomePage?: boolean;
  /** AntV root 域名，直接用主题的可不传 */
  rootDomain?: string;
  /** 是否展示国内镜像链接 */
  showChinaMirror?: boolean;
}

export const redirectToChinaMirror = (githubUrl: string) => {
  // antv.vision => antv.gitee.io
  if (window.location.host === 'antv.vision') {
    window.location.href = window.location.href.replace(
      'antv.vision',
      'antv.gitee.io',
    );
    return;
  }
  // g2plot.antv.vision => antv-g2plot.gitee.io
  const match = window.location.host.match(/(.*)\.antv\.vision/);
  if (match && match[1]) {
    window.location.href = window.location.href.replace(
      window.location.host,
      `antv-${match[1]}.gitee.io`,
    );
    return;
  }
  const { name } = GitUrlParse(githubUrl);
  if (!name.includes('.') && !name.includes('-')) {
    window.location.href = window.location.href.replace(
      window.location.host,
      `antv-${name}.gitee.io`,
    );
    return;
  }
  message.info('镜像本地调试暂时无法跳转。');
};

const Header: React.FC<HeaderProps> = ({
  subTitle = '',
  subTitleHref,
  pathPrefix = '',
  path = '',
  navs = [],
  showSearch = true,
  showGithubCorner = true,
  showLanguageSwitcher = true,
  logo,
  onLanguageChange,
  siteUrl,
  githubUrl = 'https://github.com/antvis',
  defaultLanguage,
  Link = 'a',
  transparent,
  isHomePage,
  rootDomain = '',
  showChinaMirror = false,
}) => {
  const { t, i18n } = useTranslation();
  const lang =
    typeof defaultLanguage !== 'undefined'
      ? defaultLanguage
      : i18n.language || '';
  const SubTitleLink = (subTitleHref || '').startsWith('http') ? 'a' : Link;
  const [productMenuVisible, setProductMenuVisible] = useState(false);
  let productMenuHovering = false;
  const onProductMouseEnter = (e: React.MouseEvent) => {
    productMenuHovering = true;
    e.persist();
    setTimeout(() => {
      if (e.target instanceof Element && e.target.matches(':hover')) {
        setProductMenuVisible(true);
      }
    }, 200);
  };
  const onProductMouseLeave = (e: React.MouseEvent) => {
    e.persist();
    productMenuHovering = false;
    setTimeout(() => {
      if (productMenuHovering) {
        return;
      }
      setProductMenuVisible(false);
    }, 200);
  };
  const onToggleProductMenuVisible = () => {
    setProductMenuVisible(!productMenuVisible);
  };

  const [popupMenuVisible, setPopupMenuVisible] = useState(false);
  const onTogglePopupMenuVisible = () => {
    setPopupMenuVisible(!popupMenuVisible);
  };

  const { img, link } = {
    img: <AntvLogo />,
    link: '',
    ...logo,
  };

  useEffect(() => {
    if (popupMenuVisible) {
      setPopupMenuVisible(false);
    }
  }, [path]);

  // 移动端下弹出菜单时，禁止页面滚动
  useEffect(() => {
    if (popupMenuVisible) {
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [popupMenuVisible]);

  const isWide = useMedia('(min-width: 767.99px)', true);
  const menuIcon = !isWide ? (
    <Icon
      type="menu"
      className={styles.menuIcon}
      onClick={onTogglePopupMenuVisible}
    />
  ) : null;

  const productItemProps = isWide
    ? {
        onMouseEnter: onProductMouseEnter,
        onMouseLeave: onProductMouseLeave,
      }
    : {
        onClick: onToggleProductMenuVisible,
      };

  const { name } = GitUrlParse(githubUrl);
  const chinaMirrorUrl = name ? `https://antv-${name}.gitee.io` : '';

  const menu = (
    <ul
      className={classNames(styles.menu, {
        [styles.popup]: !isWide,
        [styles.popupHidden]: !popupMenuVisible,
      })}
    >
      {navs && navs.length ? <NavMenuItems navs={navs} path={path} /> : null}
      {showLanguageSwitcher && (
        <li>
          <a
            onClick={e => {
              e.preventDefault();
              const value = lang === 'en' ? 'zh' : 'en';
              i18n.changeLanguage(value);
              if (onLanguageChange) {
                return onLanguageChange(value);
              }
              if (path.endsWith(`/${lang}`)) {
                return navigate(`/${value}`);
              }
              navigate(
                path.replace(pathPrefix, '').replace(`/${lang}/`, `/${value}/`),
              );
            }}
          >
            {t('English')}
          </a>
        </li>
      )}
      {!showChinaMirror ? null : (
        <li>
          <a
            href={chinaMirrorUrl}
            onClick={e => {
              e.preventDefault();
              redirectToChinaMirror(githubUrl);
            }}
          >
            {t('国内镜像')}
            <i className={styles.export}>
              <ExternalLink />
            </i>
          </a>
        </li>
      )}
      <li {...productItemProps}>
        <a>
          {t('所有产品')}
          <Icon
            type="caret-down"
            className={classNames(styles.arrow, {
              [styles.open]: productMenuVisible,
            })}
          />
        </a>
        <Products
          className={styles.productsMenu}
          show={productMenuVisible}
          rootDomain={rootDomain}
          language={defaultLanguage}
        />
      </li>
      {showGithubCorner && (
        <li className={styles.githubCorner}>
          <a href={githubUrl} target="_blank" rel="noopener noreferrer">
            <Icon type="github" />
          </a>
        </li>
      )}
    </ul>
  );

  let defaultLogoLink;
  if (link) {
    defaultLogoLink = link;
  } else if (siteUrl === 'https://antv.vision') {
    defaultLogoLink = `/${lang}`;
  } else {
    defaultLogoLink = `https://antv.vision`;
  }

  const [logoLink, setLogoLink] = useState(defaultLogoLink);
  useEffect(() => {
    if (window.location.host === 'antv.gitee.io') {
      setLogoLink('https://antv.gitee.io');
    }
  }, []);

  return (
    <header
      className={classNames(styles.header, {
        [styles.transparent]: !!transparent && !productMenuVisible,
        [styles.isHomePage]: !!isHomePage,
        [styles.fixed]: popupMenuVisible,
      })}
    >
      <div className={styles.container}>
        <div className={styles.left}>
          <h1>
            <a href={logoLink}>{img}</a>
          </h1>
          {subTitle && (
            <>
              <span className={styles.divider} />
              <h2 className={styles.subProduceName}>
                {React.createElement(
                  SubTitleLink,
                  {
                    [SubTitleLink === 'a' ? 'href' : 'to']:
                      typeof subTitleHref === 'undefined'
                        ? `/${lang}`
                        : subTitleHref,
                  },
                  subTitle,
                )}
              </h2>
            </>
          )}
          {showSearch && <Search />}
        </div>
        <nav className={styles.nav}>
          {menu}
          {menuIcon}
        </nav>
      </div>
    </header>
  );
};

export default Header;
