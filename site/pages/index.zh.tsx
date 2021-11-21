import Banner from '@antv/gatsby-theme-antv/site/components/Banner';
import BannerSVG from '@antv/gatsby-theme-antv/site/components/BannerSVG';
import Cases from '@antv/gatsby-theme-antv/site/components/Cases';
import Companies from '@antv/gatsby-theme-antv/site/components/Companies';
import Features from '@antv/gatsby-theme-antv/site/components/Features';
import SEO from '@antv/gatsby-theme-antv/site/components/Seo';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useConfig } from './useConfig';
import { Dipper } from '../components/Dipper';
import { DipperMap } from '../components/DipperMap';
import '../css/home.css';

const IndexPage = () => {
  const { t, i18n } = useTranslation();
  const { L7Case, L7Features,notifications,companies, ecosystems} = useConfig();

  const bannerButtons = [
    {
      text: t('图表示例'),
      link: `/${i18n.language}/examples/gallery`,
      type: 'primary',
    },
    {
      text: t('开始使用'),
      link: `/${i18n.language}/docs/api/l7`,
    },
  ];


  const dipper = [
    {
      title: t('配置化'),
      image: 'https://gw.alipayobjects.com/zos/bmw-prod/a8d32053-ef9d-485e-ae13-2b49535e6f4f.svg',
      link: `/${i18n.language}/view`
    },
    {
      title: t('组件化'),
      image: 'https://gw.alipayobjects.com/zos/bmw-prod/4235cc53-ef5f-4a47-a33c-1623df19e4b7.svg',
      link: `/${i18n.language}/task`
    },
    {
      title: t('自由定制'),
      image: 'https://gw.alipayobjects.com/zos/bmw-prod/29cbd68c-86ac-440c-a38d-792dbd8aea61.svg',
      link: 'https://dippermap.alipay.com'
    }
  ];

  const dippermap = [
    {
      img: 'https://gw.alipayobjects.com/mdn/rms_e7e1c6/afts/img/A*6S8hQJAUB2oAAAAAAAAAAAAAARQnAQ',
      alt: 'heat',
      desc: '3D热力图',
    },
    {
      img: 'https://gw.alipayobjects.com/mdn/rms_e7e1c6/afts/img/A*R8juSLJc86wAAAAAAAAAAAAAARQnAQ',
      alt: '3DARC',
      desc: '3D曲线',
    },
    {
      img: 'https://gw.alipayobjects.com/mdn/rms_e7e1c6/afts/img/A*MDmtT6lRS6EAAAAAAAAAAAAAARQnAQ',
      alt: 'trip',
      desc: '路径图',
    },
    {
      img: 'https://gw.alipayobjects.com/mdn/rms_e7e1c6/afts/img/A*lRdLQotjkKsAAAAAAAAAAAAAARQnAQ',
      alt: 'point',
      desc: '3D柱图',
    },
    {
      img: 'https://gw.alipayobjects.com/mdn/rms_e7e1c6/afts/img/A*W_DMQ5DVmIsAAAAAAAAAAAAAARQnAQ',
      alt: 'polygon',
      desc: '中国3D地图',
    },
    {
      img: 'https://gw.alipayobjects.com/mdn/rms_e7e1c6/afts/img/A*InJXT6G-l6UAAAAAAAAAAAAAARQnAQ',
      alt: 'hex',
      desc: '六边形图',
    },
  ];

  return (
    <>
      <SEO title={t('蚂蚁地理空间数据可视化')} lang={i18n.language} />
      <Banner
        coverImage={
          <img
            width="100%"
            className="Notification-module--number--31-3Z"
            src="https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*cCI7RaJs46AAAAAAAAAAAABkARQnAQ"
          />
        }
        title={t('L7 空间数据可视分析')}
        description={t(
          '蚂蚁金服 AntV 数据可视化团队推出的基于 WebGL 的开源大规模地理空间数据可视分析引擎。',
        )}
        buttons={bannerButtons}
        notifications={notifications}
        className="banner"
        githubStarLink="https://github.com/antvis/L7/stargazers"
      />
      <Features features={L7Features} style={{ width: '100%' }} />
      <Dipper dipper={dipper} />
      <Cases cases={L7Case} />
      <DipperMap dippermap={dippermap} />
      <Companies title={t('感谢信赖')} companies={companies} />
   
    </>
  );
};

export default IndexPage;
