import Banner from '@antv/gatsby-theme-antv/site/components/Banner';
import BannerSVG from '@antv/gatsby-theme-antv/site/components/BannerSVG';
import Cases from '@antv/gatsby-theme-antv/site/components/Cases';
import Companies from '@antv/gatsby-theme-antv/site/components/Companies';
import Features from '@antv/gatsby-theme-antv/site/components/Features';
import SEO from '@antv/gatsby-theme-antv/site/components/Seo';
import React from 'react';
import { useTranslation } from 'react-i18next';

const IndexPage = () => {
  const { t, i18n } = useTranslation();

  const features = [
    {
      icon:
        'https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*EpwBRpW2X-4AAAAAAAAAAABkARQnAQ',
      title: t('架构上灵活可扩展'),
      description: t('支持地图底图，渲染引擎，图层自由定制、扩展，组合'),
    },
    {
      icon:
        'https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*bjWeSqCAyWoAAAAAAAAAAABkARQnAQ',
      title: t('业务上简洁且通用'),
      description: t('以图形符号学地理设计体系理论基础，易用，易理解，专业 专注',
      ),
    },
    {
      icon:
        'https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*8UXGTKDotJwAAAAAAAAAAABkARQnAQ',
      title: t('可视化上酷炫动感'),
      description: t('支持海量数据，2D、3D，动态，可交互，高性能渲染'),
    },
  ];
  const bannerButtons = [
    {
      text: t('图表示例'),
      link: '/examples/point/basic',
      type: 'primary',
    },
    {
      text: t('下载使用'),
      link: '/docs/API/L7',
    },
  ];

  const notifications = [
    {
      type: t('测试'),
      title: t('L7  2.0 beta'),
      date: '2019.12.04',
      link: '#',
    },
  ];

  const cases = [
    {
      logo:
        'https://gw.alipayobjects.com/mdn/rms_23b644/afts/img/A*2Ij9T76DyCcAAAAAAAAAAABkARQnAQ',
      title: t('浅色朴素色板'),
      description: t('可视化分析应用'),
      link: '#',
      image:
        'https://gw.alipayobjects.com/mdn/rms_23b644/afts/img/A*oCd7Sq3N-QEAAAAAAAAAAABkARQnAQ',
    },
    {
      logo:
        'https://gw.alipayobjects.com/mdn/rms_23b644/afts/img/A*ekkhR7ISzUsAAAAAAAAAAABkARQnAQ',
      title: t('深色酷炫色板'),
      description: t('酷炫地图应用'),
      image:
        'https://gw.alipayobjects.com/mdn/rms_23b644/afts/img/A*oCd7Sq3N-QEAAAAAAAAAAABkARQnAQ',
    },
  ];

  return (
    <>
      <SEO title={t('蚂蚁地理空间数据可视化')} lang={i18n.language} />
      <Banner
        coverImage={
          <img
            class="Notification-module--number--31-3Z"
            style={{ marginLeft: '125px', marginTop: '100px', height: '500px' }}
            src="https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*JTQgTKOaC1UAAAAAAAAAAABkARQnAQ"
          />
        }
        title={t('L7 地理空间可视化引擎')}
        description={t(
          'L7 是由蚂蚁金服 AntV 数据可视化团队推出的基于WebGL的开源大规模地理空间数据可视分析开发框架。',
        )}
        buttons={bannerButtons}
        notifications={notifications}
        className="banner"
        githubStarLink="https://github.com/antvis/L7/stargazers"
      />
      <Features features={features} style={{ width: '100%' }} />
      <Cases cases={cases} />
    </>
  );
};

export default IndexPage;
