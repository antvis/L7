import Banner from '@antv/gatsby-theme-antv/site/components/Banner';
import Cases from '@antv/gatsby-theme-antv/site/components/Cases';
import Companies from '@antv/gatsby-theme-antv/site/components/Companies';
import Features from '@antv/gatsby-theme-antv/site/components/Features';
import SEO from '@antv/gatsby-theme-antv/site/components/Seo';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dipper } from '../components/Dipper';
import { DipperMap } from '../components/DipperMap';
import { L7React } from '../components/L7React'
import { L7Plot } from '../components/L7Plot'
import { L7Draw } from '../components/L7Draw'
import '../css/home.css';


const IndexPage = () => {
  const { t, i18n } = useTranslation();
  const L7Case = [
    {
      logo:
        'https://antv-2018.alipay.com/assets/image/icon/l7.svg',
      title: t('指挥分配场景'),
      description: t(
        '区域化网格化数据管理指挥分配场景',
      ),
      link: `https://antv.vision/Dipper/~demos/docs-task`,
      image:
        'https://gw.alipayobjects.com/mdn/rms_08cc33/afts/img/A*scJBTq8PW7kAAAAAAAAAAAAAARQnAQ',
    },
    {
      logo:
        'https://antv-2018.alipay.com/assets/image/icon/l7.svg',
      title: t('地图数据分析'),
      description: t(
        '区域化网格化数据分析场景',
      ),
      link: `https://antv.vision/Dipper/~demos/docs-analysis`,
      image:
        'https://gw.alipayobjects.com/mdn/rms_08cc33/afts/img/A*OnGVRb_qWxcAAAAAAAAAAAAAARQnAQ',
    },
    {
      logo:
        'https://gw.alipayobjects.com/zos/bmw-prod/222865fc-15e9-44b9-b726-444e1512d937.ico',
      title: t('DipperMap 地理分析工具'),
      description: t(
        '地图可视化配置分析类场景',
      ),
      link: `/${i18n.language}/examples/gallery/basic`,
      image:
        'https://gw.alipayobjects.com/mdn/rms_e7e1c6/afts/img/A*MPWKQqh54vwAAAAAAAAAAAAAARQnAQ',
    },
  ];
  const companies = [{
    name: '阿里云',
    img:
      'https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*V_xMRIvw2iwAAAAAAAAAAABkARQnAQ',
  },
  {
    name: '支付宝',
    img:
      'https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*lYDrRZvcvD4AAAAAAAAAAABkARQnAQ',
  },
  {
    name: '天猫',
    img:
      'https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*BQrxRK6oemMAAAAAAAAAAABkARQnAQ',
  },
  {
    name: '淘宝网',
    img:
      'https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*1l8-TqUr7UcAAAAAAAAAAABkARQnAQ',
  },
  {
    name: '网商银行',
    img:
      'https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*ZAKFQJ5Bz4MAAAAAAAAAAABkARQnAQ',
  },
  {
    name: '盒马',
    img:
      'https://gw.alipayobjects.com/mdn/rms_f8c6a0/afts/img/A*ePJMQZCb8vkAAAAAAAAAAABkARQnAQ',
  },
  {
    name: 'yunos',
    img:
      'https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*_js7SaNosUwAAAAAAAAAAABkARQnAQ',
  },
  {
    name: '菜鸟',
    img:
      'https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*TgV-RZDODJIAAAAAAAAAAABkARQnAQ',
  }
  ];

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
  const L7Features = [
    {
      icon:
        'https://gw.alipayobjects.com/zos/basement_prod/ca2168d1-ae50-4929-8738-c6df62231de3.svg',
      title: t('架构灵活且自由'),
      description: t('支持地图底图，渲染引擎，图层自由定制、扩展，组合'),
    },
    {
      icon:
        'https://gw.alipayobjects.com/zos/basement_prod/0ccf4dcb-1bac-4f4e-8d8d-f1031c77c9c8.svg',
      title: t('业务专业且通用'),
      description: t(
        '以图形符号学地理设计体系理论基础，易用、易理解、专业、专注',
      ),
    },
    {
      icon:
        'https://gw.alipayobjects.com/zos/basement_prod/fd232581-14b3-45ec-a85c-fb349c51b376.svg',
      title: t('视觉酷炫且动感'),
      description: t('支持海量数据，2D、3D，动态，可交互，高性能渲染'),
    },
  ];
  const notifications = [{
    type: t('DipperMap'),
    title: t('地理可视化工具'),
    date: '2021.11.22',
    link: 'https://dippermap.alipay.com/',
  },
  {
    type: t('L7 一站式地理分析应用解决方案'),
    title: t('L7Mini、Dipper、DipperMap'),
    date: '2021.11.22',
    link: 'https://www.yuque.com/antv/blog/xqslop',
  },
  ]

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

  const draw = [
    {
      img: 'https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*jQKyTI4-hjAAAAAAAAAAAAAAARQnAQ',
      alt: 'draw circle',
      desc: '绘制圆形',
    },
    {
      img: 'https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*PPZ2RJy6XxEAAAAAAAAAAAAAARQnAQ',
      alt: 'draw line',
      desc: '绘制折线',
    },
    {
      img: 'https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*f64USbxQhiwAAAAAAAAAAAAAARQnAQ',
      alt: 'draw polygon',
      desc: '绘制几何图形',
    }
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
          '蚂蚁集团 AntV 数据可视化团队推出的基于 WebGL 的开源大规模地理空间数据可视分析引擎。',
        )}
        buttons={bannerButtons}
        notifications={notifications}
        className="banner"
        // @ts-ignore
        githubStarLink="https://github.com/antvis/L7/stargazers"
      />
      <Features features={L7Features} style={{ width: '100%' }} />

      <Dipper dipper={dipper} />

      <DipperMap dippermap={dippermap} />

      <Cases cases={L7Case} />

      <L7React />

      <L7Plot/>

      <L7Draw draw={draw}/>

      <Companies title={t('感谢信赖')} companies={companies} />
    </>
  );
};

export default IndexPage;
