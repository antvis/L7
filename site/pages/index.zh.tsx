import Banner from '@antv/gatsby-theme-antv/site/components/Banner';
import BannerSVG from '@antv/gatsby-theme-antv/site/components/BannerSVG';
import Cases from '@antv/gatsby-theme-antv/site/components/Cases';
import Companies from '@antv/gatsby-theme-antv/site/components/Companies';
import Features from '@antv/gatsby-theme-antv/site/components/Features';
import SEO from '@antv/gatsby-theme-antv/site/components/Seo';
import '../css/home.css';
import React from 'react';
import { useTranslation } from 'react-i18next';

const IndexPage = () => {
  const { t, i18n } = useTranslation();

  const features = [
    {
      icon:
        'https://gw.alipayobjects.com/zos/basement_prod/ca2168d1-ae50-4929-8738-c6df62231de3.svg',
      title: t('架构上灵活可扩展'),
      description: t('支持地图底图，渲染引擎，图层自由定制、扩展，组合'),
    },
    {
      icon:
        'https://gw.alipayobjects.com/zos/basement_prod/0ccf4dcb-1bac-4f4e-8d8d-f1031c77c9c8.svg',
      title: t('业务上简洁且通用'),
      description: t(
        '以图形符号学地理设计体系理论基础，易用，易理解，专业 专注',
      ),
    },
    {
      icon:
        'https://gw.alipayobjects.com/zos/basement_prod/fd232581-14b3-45ec-a85c-fb349c51b376.svg',
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
      logo:'https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*gjBmT56SDgsAAAAAAAAAAABkARQnAQ',
      title: t('浅色色板'),
      description: t('一个个真实的数据可视化案例，复杂的地理数据,简单，易用的API接口,让用户达到开箱即用的效果。'),
      link: 'https://antvis.github.io/L7/zh/examples/gallery/basic',
      image:
        'https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*8Pa8Toh3-OsAAAAAAAAAAABkARQnAQ',
    },
    {
      logo:'https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*gjBmT56SDgsAAAAAAAAAAABkARQnAQ',
      title: t('深色色板'),
      description: t('一个个真实的数据可视化案例，复杂的地理数据,简单，易用的API接口,让用户达到开箱即用的效果.'),
      link: 'https://antvis.github.io/L7/zh/examples/gallery/basic',
      image:
        'https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*ryTVQ49K8SkAAAAAAAAAAABkARQnAQ',
    }
  ];

  return (
    <>
      <SEO title={t('蚂蚁地理空间数据可视化')} lang={i18n.language} />
      <Banner
        coverImage={
          <img
            className="cover-image"
            src="https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*VcojS5aWhMYAAAAAAAAAAABkARQnAQ"
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
