import React, { useEffect } from 'react';
import { default as RCFooter, FooterProps as RcFooterProps } from 'rc-footer';
import { useTranslation } from 'react-i18next';
import { Icon, notification, Button } from 'antd';
import { useMedia } from 'react-use';
import { getProducts } from './getProducts';
import { redirectToChinaMirror } from './Header';
import styles from './Footer.module.less';
import 'rc-footer/assets/index.less';

export const OLD_SITE_DOMAIN = 'https://antv-2018.alipay.com';

interface FooterProps extends RcFooterProps {
  rootDomain?: string;
  language?: string;
  chinaMirrorNotice?: boolean;
  githubUrl?: string;
}

const Footer: React.FC<FooterProps> = ({
  columns,
  bottom,
  theme = 'dark',
  language,
  rootDomain = '',
  chinaMirrorNotice = true,
  githubUrl = '',
}) => {
  const { t, i18n } = useTranslation();
  const lang = language || i18n.language;
  const products = getProducts({
    t,
    language: lang,
    rootDomain,
  });
  const isWide = useMedia('(min-width: 767.99px)', true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (
        !chinaMirrorNotice ||
        lang !== 'zh' ||
        window.location.host.includes('chartcube') ||
        window.location.host.includes('gitee.io') ||
        localStorage.getItem('china-mirror-no-more-hint') ||
        !isWide
      ) {
        return;
      }
      notification.info({
        key: 'china-mirror',
        icon: (
          <img
            width={32}
            src="https://gw.alipayobjects.com/zos/antfincdn/FLrTNDvlna/antv.png"
            alt="antv logo"
          />
        ),
        message: '国内镜像提示 🇨🇳',
        description:
          'AntV 系列网站部署在 gh-pages 上，若访问速度不佳，可以前往国内镜像站点。你也可以在顶部导航找到镜像链接。',
        duration: 0,
        top: 64,
        btn: (
          <>
            <Button
              type="primary"
              size="small"
              style={{ marginRight: 8 }}
              onClick={() => {
                redirectToChinaMirror(githubUrl);
              }}
            >
              <Icon type="thunderbolt" />
              前往国内镜像
            </Button>
            <Button
              size="small"
              onClick={() => {
                localStorage.setItem(
                  'china-mirror-no-more-hint',
                  Date.now().toString(),
                );
                notification.close('china-mirror');
              }}
            >
              不再提醒
            </Button>
          </>
        ),
        onClose: () => {
          localStorage.setItem(
            'china-mirror-no-more-hint',
            Date.now().toString(),
          );
        },
      });
    }, 5000);
    return () => {
      clearTimeout(timeout);
    };
  });

  const more = {
    icon: (
      <img
        src="https://gw.alipayobjects.com/zos/rmsportal/nBVXkrFdWHxbZlmMbsaH.svg"
        alt="more products"
      />
    ),
    title: t('更多产品'),
    items: [
      {
        icon: (
          <img
            src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
            alt="Ant Design"
          />
        ),
        title: 'Ant Design',
        url: 'https://ant.design',
        description: t('企业级 UI 设计语言'),
        openExternal: true,
      },
      {
        icon: (
          <img
            src="https://gw.alipayobjects.com/zos/rmsportal/XuVpGqBFxXplzvLjJBZB.svg"
            alt="yuque"
          />
        ),
        title: t('语雀'),
        url: 'https://yuque.com',
        description: t('知识创作与分享工具'),
        openExternal: true,
      },
      {
        icon: (
          <img
            src="https://gw.alipayobjects.com/zos/antfincdn/sAEs8aHCnd/yunfengdie.png"
            alt="yunfengdie"
          />
        ),
        title: t('云凤蝶'),
        url: 'https://yunfengdie.com',
        description: t('中台建站平台'),
        openExternal: true,
      },
      {
        icon: (
          <img
            src="https://gw.alipayobjects.com/zos/antfincdn/v2%24rh7lqpu/82f338dd-b0a6-41bc-9a86-58aaa9df217b.png"
            alt="Egg"
          />
        ),
        title: 'Egg',
        url: 'https://eggjs.org',
        description: t('企业级 Node 开发框架'),
        openExternal: true,
      },
      {
        icon: (
          <img
            src="https://gw.alipayobjects.com/zos/rmsportal/DMDOlAUhmktLyEODCMBR.ico"
            alt="kitchen"
          />
        ),
        title: 'Kitchen',
        description: t('Sketch 工具集'),
        url: 'https://kitchen.alipay.com',
        openExternal: true,
      },
      {
        icon: (
          <img
            src="https://gw.alipayobjects.com/zos/rmsportal/nBVXkrFdWHxbZlmMbsaH.svg"
            alt="xtech"
          />
        ),
        title: t('蚂蚁体验科技'),
        url: 'https://xtech.antfin.com/',
        openExternal: true,
      },
    ],
  };

  const defaultColumns = products
    .filter(product => product.category !== 'ecology')
    .map(product => ({
      title: (
        <span>
          {product.title}
          <span className={styles.description}>{product.slogan}</span>
        </span>
      ),
      items: product.links,
    }));

  return (
    <RCFooter
      maxColumnsPerRow={4}
      theme={theme}
      columns={columns || [...defaultColumns, more]}
      className={styles.footer}
      bottom={
        bottom || (
          <div className={styles.bottom}>
            <div>
              <a
                href="https://weibo.com/antv2017"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon type="weibo" />
              </a>
              <a
                href="https://zhuanlan.zhihu.com/aiux-antv"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon type="zhihu" />
              </a>
              <a
                href="https://github.com/antvis"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon type="github" />
              </a>
              <a href={`${rootDomain}/${lang}/about`}>{t('关于我们')}</a>
              <a
                href={OLD_SITE_DOMAIN}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('返回旧版')}
              </a>
            </div>
            <div>
              © {new Date().getFullYear()} Made with ❤ by{' '}
              <a href="https://xtech.antfin.com/">XTech</a>
            </div>
          </div>
        )
      }
    />
  );
};

export default Footer;
