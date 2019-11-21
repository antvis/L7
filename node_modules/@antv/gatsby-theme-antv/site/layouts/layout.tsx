import React from 'react';
import { useStaticQuery, graphql, withPrefix, Link } from 'gatsby';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getCurrentLangKey } from 'ptz-i18n';
import Helmet from 'react-helmet';
import Header from '../components/Header';
import PageLoading from '../components/PageLoading';
import Footer, { OLD_SITE_DOMAIN } from '../components/Footer';
import styles from './layout.module.less';

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    initImmediate: false,
    // @ts-ignore
    resources: I18NEXT_RESOURCES,
    fallbackLng: 'zh',
    keySeparator: false,
    react: {
      useSuspense: false,
    },
  });

const lngs = ['zh', 'en'];

interface LayoutProps {
  children: React.ReactElement<any>;
  location: Location;
}

const Layout: React.FC<LayoutProps> = ({ children, location }) => {
  // https://github.com/gatsbyjs/gatsby/issues/13867#issuecomment-489481343
  if (location.pathname.includes('offline-plugin-app-shell-fallback')) {
    return <PageLoading />;
  }
  const query = graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
          githubUrl
          siteUrl
          logoUrl
          showLanguageSwitcher
          navs {
            slug
            title {
              zh
              en
            }
            target
          }
          redirects {
            from
            to
          }
        }
      }
    }
  `;
  const { site } = useStaticQuery(query);
  const {
    siteMetadata: {
      title,
      navs = [],
      githubUrl,
      siteUrl,
      logoUrl = '',
      showLanguageSwitcher,
      redirects = [],
    },
  } = site;
  const pathPrefix = withPrefix('/').replace(/\/$/, '');
  const path = location.pathname.replace(pathPrefix, '');
  const currentLangKey = getCurrentLangKey(lngs, 'zh', path);

  const isHomePage =
    path === '/' ||
    path === `/${currentLangKey}` ||
    path === `/${currentLangKey}/`;

  i18n.init({
    lng: currentLangKey,
  });

  if (
    location.pathname === pathPrefix ||
    (children && children.type && (children as any).type.noLayout)
  ) {
    return children;
  }

  const getRediectUrl = () => {
    const list = redirects || [];
    for (let i = 0; i < list.length; i += 1) {
      const { from = '', to, keepUrl } = list[i] as {
        from: string | RegExp;
        to: string;
        keepUrl?: boolean;
      };
      // 支持字符串和正则表达式比较
      if (
        location.pathname !== from &&
        !new RegExp(from).test(location.pathname)
      ) {
        return;
      }
      if (keepUrl && new RegExp(from).test(location.pathname)) {
        return location.pathname.replace(new RegExp(from), to);
      }
      // 如果没有指定 to，则直接用替换成老版本的域名
      return to || `${OLD_SITE_DOMAIN}${location.pathname}`;
    }
  };

  const rediectUrl = getRediectUrl();
  const logoProps = logoUrl
    ? {
        logo: {
          img: <img src={logoUrl} alt="logo" />,
        },
      }
    : {};

  return (
    <>
      {rediectUrl && (
        <Helmet>
          <meta httpEquiv="refresh" content={`0;url=${rediectUrl}`} />
        </Helmet>
      )}
      <Header
        subTitle={siteUrl === 'https://antv.vision' ? '' : title}
        path={path}
        pathPrefix={pathPrefix}
        navs={navs}
        siteUrl={siteUrl}
        githubUrl={githubUrl}
        Link={Link}
        transparent={isHomePage}
        isHomePage={isHomePage}
        showChinaMirror
        showLanguageSwitcher={
          showLanguageSwitcher === null ? undefined : showLanguageSwitcher
        }
        {...logoProps}
      />
      <main className={styles.main}>{children}</main>
      <Footer githubUrl={githubUrl} />
    </>
  );
};

export default Layout;
