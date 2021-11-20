import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const useConfig = () => {
  const { t, i18n } = useTranslation();

  //  通知
  const notifications = useMemo(() => {
    return [{
      type: t('推荐'),
      title: t('如何制作不一样的疫情世界地图-酷炫、动感的地理可视化'),
      date: '2020.03.12',
      link: 'https://www.yuque.com/antv/blog/wigku2',
    },
    {
      type: t('新版发布'),
      title: t('L7 2.1 正式版'),
      date: '2020.03.12',
      link: ' https://www.yuque.com/antv/blog/ows55v',
    },
    ];
  }, []);

  // L7 特性
  const L7Features = useMemo(() => {
    return [
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

  }, [])


  const L7Case = useMemo(() => {
    return [
      {
        logo:
          'https://antv-2018.alipay.com/assets/image/icon/l7.svg',
        title: t('指挥分配场景'),
        description: t(
          '区域化网格化数据管理指挥分配场景',
        ),
        link: `/${i18n.language}/task`,
        image:
          'https://gw.alipayobjects.com/mdn/rms_08cc33/afts/img/A*CLJESKDO1g4AAAAAAAAAAAAAARQnAQ',
      },
      {
        logo:
          'https://antv-2018.alipay.com/assets/image/icon/l7.svg',
        title: t('地图数据分析'),
        description: t(
          '区域化网格化数据分析场景',
        ),
        link: `/${i18n.language}/view`,
        image:
          'https://gw.alipayobjects.com/mdn/rms_08cc33/afts/img/A*jb4tS7BiNo4AAAAAAAAAAAAAARQnAQ',
      },
      {
        logo:
          'https://gw.alipayobjects.com/zos/bmw-prod/222865fc-15e9-44b9-b726-444e1512d937.ico',
        title: t('地理分析工具'),
        description: t(
          '地图可视化配置分析类场景',
        ),
        link: `/${i18n.language}/examples/gallery/basic`,
        image:
          'https://gw.alipayobjects.com/mdn/rms_e7e1c6/afts/img/A*MPWKQqh54vwAAAAAAAAAAAAAARQnAQ',
      },
    ]

  }, [])
  const companies = useMemo(() => [{
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
  ], []);

  const ecosystems = useMemo(() => [{
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
  }
  ], []);

  return {
    ecosystems,
    L7Features,
    notifications,
    companies,
    L7Case,
  }
}



