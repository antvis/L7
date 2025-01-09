import { defineConfig } from 'dumi';
import path from 'path';

const env = process.env.NODE_ENV;
const GaodeTokenScript =
  env === 'production'
    ? [
        ` window._AMapSecurityConfig = {
    securityJsCode: '2653011adeb04230b3a26cc9a780a800',
  }`,
        'https://webapi.amap.com/maps?v=2.0&key=f59bcf249433f8b05caaee19f349b3d7',
      ]
    : [
        ` window._AMapSecurityConfig = {
    securityJsCode: "290ddc4b0d33be7bc9b354bc6a4ca614"
  }`,
        'https://webapi.amap.com/maps?v=2.0&key=6f025e700cbacbb0bb866712d20bb35c',
      ];

export default defineConfig({
  locales: [
    { id: 'zh', name: '中文' },
    { id: 'en', name: 'English' },
  ],
  mfsu: false,
  copy: env === 'production' ? ['docs/CNAME'] : [],
  // ...(process.env.NODE_ENV === 'development' ? {} : { ssr: {} }),
  metas: [
    {
      name: 'keywords',
      content:
        'AntV L7 GIS 地理可视化 行政区划 地图 Map WebGIS WebGL Leaflet Openlayer 超图 ArcGIS GoogleMap 高德地图 百度地图 腾讯地图 数据可视化 deckgl, GISData, DataV',
    },
    {
      name: 'description',
      content:
        'AntV 蚂蚁集团 AntV 数据可视化团队推出的基于 WebGL 的开源大规模地理空间数据可视分析引擎。',
    },
  ],
  title: 'AntV L7 地理空间数据可视化引擎',
  themeConfig: {
    title: 'L7',
    isAntVSite: false,
    footerTheme: 'light', // 白色 底部主题
    // internalSite: {
    //   url: 'https://gitee.com/antv/L7',
    //   name: {
    //     zh: '国内镜像',
    //     en: 'China Mirror',
    //   },
    // },
    description: 'Large-scale WebGL-powered Geospatial data visualization analysis framework',
    siteUrl: 'https://l7.antv.antgroup.com/',
    githubUrl: 'https://github.com/antvis/L7',
    relativePath: 'packages/site',
    keywords:
      'l7, L7, antv/l7, 地理, 空间可视化, Webgl, webgl, 地图, webgis, 3d, GIS, gis, Mapbox, deckgl, g2, g6, antv,',
    showChartResize: true, // 是否在demo页展示图表视图切换
    showAPIDoc: false, // 是否在demo页展示API文档
    petercat: {
      show: true,
      token: 'a1dbc546-2ec1-4aba-853f-56aaf511e23d',
    },
    detail: {
      engine: {
        zh: 'L7',
        en: 'L7',
      },
      title: {
        zh: 'L7·蚂蚁地理空间数据可视化',
        en: 'L7·Geospatial Visualization',
      },
      description: {
        zh: '蚂蚁集团 AntV 数据可视化团队推出的基于 WebGL 的开源大规模地理空间数据可视分析引擎。',
        en: 'Geospatial Data Visualization Analysis Engine',
      },
      image:
        'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*5bIcTaxarjoAAAAAAAAAAAAADmJ7AQ/original',
      imageStyle: {
        transform: 'scale(0.6)',
        marginLeft: '145px',
        marginTop: '-25px',
      },
      buttons: [
        {
          text: {
            zh: '开始使用',
            en: 'Getting Started',
          },
          link: '/tutorial/quickstart',
        },
        {
          text: {
            zh: '图表示例',
            en: 'gallery',
          },
          type: 'primary',
          link: '/examples',
        },
        {
          text: {
            zh: 'QuickIssue',
            en: 'QuickIssue',
          },
          type: 'primary',
          icon: null,
          link: '/tutorial/quick_issue',
        },
      ],
    },
    msfu: false,
    news: [
      {
        type: {
          zh: '推荐',
          en: 'News',
        },
        title: {
          zh: '地图站点导航工具',
          en: 'DipperMap',
        },
        date: '2023.12.01',
        link: 'https://nav.dippermap.com/',
      },
      {
        type: {
          zh: '推荐',
          en: 'News',
        },
        title: {
          zh: 'L7VP 地理数据分析工具',
          en: 'L7VP',
        },
        date: '2023.07.07',
        link: 'https://li.antv.antgroup.com/',
      },
    ],
    features: [
      {
        icon: 'https://gw.alipayobjects.com/zos/basement_prod/ca2168d1-ae50-4929-8738-c6df62231de3.svg',
        title: {
          zh: '架构灵活且自由',
          en: 'Easy to use',
        },
        description: {
          zh: '支持地图底图，渲染引擎，图层自由定制、扩展，组合',
          en: 'Support many basemap, many rendering engine, and layer free customization, extension, combination',
        },
      },
      {
        icon: 'https://gw.alipayobjects.com/zos/basement_prod/0ccf4dcb-1bac-4f4e-8d8d-f1031c77c9c8.svg',
        title: {
          zh: '业务专业且通用',
          en: 'Simple and Universal',
        },
        description: {
          zh: '以图形符号学地理设计体系理论基础，易用、易理解、专业、专注',
          en: 'Generating high quality statistical charts through a few lines of code.',
        },
      },
      {
        icon: 'https://gw.alipayobjects.com/zos/basement_prod/fd232581-14b3-45ec-a85c-fb349c51b376.svg',
        title: {
          zh: '视觉酷炫且动感',
          en: 'Cool and Dynamic',
        },
        description: {
          zh: '支持海量数据，2D、3D，动态，可交互，高性能渲染',
          en: 'Support many basemap, many rendering engine, and layer free customization, extension, combination',
        },
      },
    ],
    case: [
      {
        logo: 'https://antv-2018.alipay.com/assets/image/icon/l7.svg',
        title: {
          zh: '指挥分配场景',
          en: 'Advanced Features',
        },
        description: {
          zh: '区域化网格化数据管理指挥分配场景',
          en: 'We are now working on some advanced and powerful chart features.',
        },
        link: 'https://antv.vision/Dipper/~demos/docs-task',
        image:
          'https://gw.alipayobjects.com/mdn/rms_08cc33/afts/img/A*scJBTq8PW7kAAAAAAAAAAAAAARQnAQ',
      },
      {
        logo: 'https://antv-2018.alipay.com/assets/image/icon/l7.svg',
        title: {
          zh: '地图数据分析',
          en: 'Advanced Features',
        },
        description: {
          zh: '区域化网格化数据分析场景',
          en: 'We are now working on some advanced and powerful chart features.',
        },
        link: 'https://antv.vision/Dipper/~demos/docs-analysis',
        image:
          'https://gw.alipayobjects.com/mdn/rms_08cc33/afts/img/A*OnGVRb_qWxcAAAAAAAAAAAAAARQnAQ',
      },
    ],
    navs: [
      {
        slug: 'docs/tutorial/l7',
        title: {
          zh: '使用教程',
          en: 'Tutorial',
        },
        redirect: 'api/quickstart',
      },
      {
        slug: 'docs/api',
        title: {
          zh: 'API 文档',
          en: 'Document',
        },
        redirect: 'api/scene',
      },
      {
        slug: 'examples',
        title: {
          zh: '图表演示',
          en: 'Examples',
        },
      },
      {
        title: {
          zh: '地图工具',
          en: 'tools',
        },
        dropdownItems: [
          {
            name: { zh: '行政区划数据', en: 'Administrative Division Data' },
            url: '/custom/tools',
          },
          {
            name: {
              zh: 'GeoJSON 编辑工具',
              en: 'Administrative Division Data',
            },
            url: 'https://l7editor.antv.antgroup.com/',
          },
        ],
      },
    ],
    cases: [
      {
        logo: 'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*-kafQrA1ky4AAAAAAAAAAAAADmJ7AQ/fmt.webp',
        title: {
          zh: 'L7React 空间数据可视分析组件库',
          en: 'L7React ',
        },
        description: {
          zh: '新一代 React 地图可视分析组件库，提供丰富/高效/专业/易用的可视化组件，一站式满足地理可视化需求。',
          en: 'The new generation of React map visual analysis component library provides rich/efficient/professional/easy-to-use visual components to meet the needs of geographic visualization in a one-stop manner.',
        },
        link: 'https://larkmap.antv.antgroup.com/',
        image:
          'https://mdn.alipayobjects.com/mdn/huamei_qa8qxu/afts/img/A*5iCQSqov5p4AAAAAAAAAAAAADmJ7AQ/fmt.webp',
        isAppLogo: true,
      },
      {
        logo: 'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*yaEWT706NFoAAAAAAAAAAAAADmJ7AQ/original',
        title: {
          zh: 'L7VP 地理空间数据可视分析工具',
          en: 'L7VP',
        },
        description: {
          zh: '下一代地理空间数据可视分析工具&研发平台，可配置出丰富的地理可视化效果提供洞察分析、地图应用搭建、开放扩展能力',
          en: 'The next generation geospatial data visual analysis platform can be configured with rich geographic visualization effects to provide insight analysis, map application construction, and open expansion capabilities',
        },
        link: 'https://li.antv.antgroup.com',
        image:
          'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*tR2BTIG6Bz8AAAAAAAAAAAAADmJ7AQ/original',
        isAppLogo: true,
      },
      {
        logo: 'https://mdn.alipayobjects.com/huamei_k6sfo0/afts/img/A*RSdESJd70P8AAAAAAAAAAAAADjWqAQ/original',
        title: {
          zh: 'L7Editor 空间数据可视编辑工具',
          en: 'L7Editor',
        },
        description: {
          zh: '支持 GeoJSON、WKT 等 GIS 格式的地理数据可视编辑工具，支持从 数据 & 地图 双视角编辑数据。 ',
          en: 'Support GeoJSON, WKT and other GIS format geographic data visual editing tools, support data editing from the data and map dual perspectives.',
        },
        link: 'https://l7editor.antv.antgroup.com/',
        image:
          'https://mdn.alipayobjects.com/huamei_k6sfo0/afts/img/A*NAC-RpA0KNUAAAAAAAAAAAAADjWqAQ/original',
        isAppLogo: true,
      },
    ],
    ecosystems: [
      {
        name: {
          zh: 'L7React',
          en: 'L7 For React',
        },
        url: 'https://larkmap.antv.antgroup.com/',
      },
      {
        name: {
          zh: 'L7Plot',
          en: 'L7Plot',
        },
        url: 'https://l7plot.antv.antgroup.com/',
      },
      {
        name: {
          zh: 'L7Draw',
          en: 'L7Draw',
        },
        url: 'http://antv.vision/L7Draw/',
      },
      {
        name: {
          zh: 'L7VP',
          en: 'L7VP',
        },
        url: 'https://li.antv.antgroup.com/#/home',
      },
      {
        name: {
          zh: 'L7Editor',
          en: 'L7Editor',
        },
        url: 'https://l7editor.antv.antgroup.com/',
      },
    ],
    docs: [
      {
        slug: 'tutorial/map',
        title: {
          zh: '地图使用',
          en: 'Map Usage',
        },
        order: 3,
      },
      {
        slug: 'tutorial/interactive',
        title: {
          zh: '图层交互',
          en: 'Layer Interactive',
        },
        order: 4,
      },
      {
        slug: 'tutorial/point',
        title: {
          zh: '点图层 PointLayer',
          en: 'PointLayer',
        },
        order: 5,
      },
      {
        slug: 'tutorial/line',
        title: {
          zh: '线图层 LineLayer',
          en: 'LineLayer',
        },
        order: 6,
      },
      {
        slug: 'tutorial/polygon',
        title: {
          zh: '面图层 PolygonLayer',
          en: 'PolygonLayer',
        },
        order: 7,
      },
      {
        slug: 'tutorial/heatmap',
        title: {
          zh: '热力图层 HeatmapLayer',
          en: 'HeatmapLayer',
        },
        order: 8,
      },
      {
        slug: 'tutorial/tile',
        title: {
          zh: '瓦片图层 TileLayer',
          en: 'TileLayer',
        },
        order: 11,
      },
      {
        slug: 'tutorial/monitor',
        title: {
          zh: '监控打点',
          en: 'Monitor',
        },
        order: 12,
      },
      {
        slug: 'api/map',
        title: {
          zh: '地图 Map',
          en: 'Map',
        },
        order: 3,
      },
      {
        slug: 'api/source',
        title: {
          zh: '数据 Source',
          en: 'Source',
        },
        order: 3,
      },
      {
        slug: 'api/component',
        title: {
          zh: '组件 Component',
          en: 'Component',
        },
        order: 3,
      },
      {
        slug: 'api/base_layer',
        title: {
          zh: '图层基类 BaseLayer',
          en: 'BaseLayer',
        },
        order: 3,
      },
      {
        slug: 'api/point_layer',
        title: {
          zh: '点图层 PointLayer',
          en: 'PointLayer',
        },
        order: 3,
      },
      {
        slug: 'api/line_layer',
        title: {
          zh: '线图层 LineLayer',
          en: 'LineLayer',
        },
        order: 4,
      },
      {
        slug: 'api/polygon_layer',
        title: {
          zh: '面图层 PolygonLayer',
          en: 'PolygonLayer',
        },
        order: 5,
      },
      {
        slug: 'api/heatmap_layer',
        title: {
          zh: '热力图层 HeatMapLayer',
          en: 'HeatMapLayer',
        },
        order: 6,
      },
      {
        slug: 'api/image_layer',
        title: {
          zh: '图片图层 ImageLayer',
          en: 'ImageLayer',
        },
        order: 7,
      },
      {
        slug: 'api/raster_layer',
        title: {
          zh: '栅格图层 RasterLayer',
          en: 'RasterLayer',
        },
        order: 9,
      },
      {
        slug: 'api/tile',
        title: {
          zh: '瓦片图层 TileLayer',
          en: 'TileLayer',
        },
        order: 10,
      },
      {
        slug: 'api/other',
        title: {
          zh: '其他图层 Other',
          en: 'Other Layers',
        },
        order: 11,
      },
      {
        slug: 'api/debug',
        title: {
          zh: '调试 debug',
          en: 'debug',
        },
        order: 12,
      },
      {
        slug: 'api/experiment',
        title: {
          zh: '实验特性',
          en: 'experiment',
        },
        order: 13,
      },
      {
        slug: 'api/react',
        title: {
          zh: 'React 组件库',
          en: 'React component',
        },
        order: 13,
      },
    ],
    examples: [
      {
        slug: 'gallery',
        icon: 'gallery',
        api: false,
        title: {
          zh: '官方精品库',
          en: 'Featured',
        },
        order: 0,
      },
      {
        slug: 'map',
        icon: 'map',
        title: {
          zh: '地图底图',
          en: 'BaseMap',
        },
        order: 1,
      },
      {
        slug: 'point',
        icon: 'point',
        title: {
          zh: '点图层',
          en: 'Point Layer',
        },
        order: 1,
      },
      {
        slug: 'line',
        icon: 'line',
        title: {
          zh: '线图层',
          en: 'Line Layer',
        },
        order: 2,
      },
      {
        slug: 'polygon',
        icon: 'polygon',
        title: {
          zh: '面图层',
          en: 'Polygon Layer',
        },
        order: 3,
      },
      {
        slug: 'heatmap',
        icon: 'heatmap',
        title: {
          zh: '热力图',
          en: 'HeatMap Layer',
        },
        order: 6,
      },
      {
        slug: 'component',
        icon: 'map',
        title: {
          zh: '组件',
          en: 'Component',
        },
        order: 7,
      },
      {
        slug: 'raster',
        icon: 'raster',
        title: {
          zh: '栅格图层',
          en: 'Raster Layer',
        },
        order: 7,
      },
      {
        slug: 'tile',
        icon: 'raster',
        title: {
          zh: '瓦片图层',
          en: 'Tile Layer',
        },
        order: 7,
      },
      {
        slug: 'mask',
        icon: 'raster',
        title: {
          zh: '图层掩膜',
          en: 'Layer Mask',
        },
        order: 7,
      },
      {
        slug: 'composite-layers',
        icon: 'map',
        title: {
          zh: '复合图层',
          en: 'CompositeLayers',
        },
        order: 8,
      },
      {
        slug: 'draw',
        icon: 'map',
        title: {
          zh: '绘制组件',
          en: 'L7Draw',
        },
        order: 9,
      },
      {
        slug: 'earth',
        icon: 'map',
        title: {
          zh: '地球模式',
          en: 'Earth Mode',
        },
        order: 4,
      },
      {
        slug: 'geometry',
        icon: 'raster',
        title: {
          zh: '几何体图层',
          en: 'Geometry Layer',
        },
        order: 7,
      },
      {
        slug: 'engine',
        icon: 'map',
        title: {
          zh: '第三方引擎',
          en: 'other engine',
        },
        order: 8,
      },
      {
        slug: 'amap-plugin',
        icon: 'map',
        title: {
          zh: '高德地图插件',
          en: 'Amap Plugin',
        },
        order: 10,
      },
      {
        slug: 'choropleth',
        icon: 'map',
        title: {
          zh: '行政区划',
          en: 'Choropleth',
        },
        order: 11,
      },
      {
        slug: 'tutorial',
        icon: 'map',
        order: 12,
        title: {
          zh: '教程示例',
          en: 'Tutorial demo',
        },
      },
    ],
    playground: {
      container: '<div style="height: 80vh;justify-content: center; position: relative" id="map"/>',
      dependencies: {
        '@antv/l7': 'latest',
        '@antv/l7-maps': 'latest',
      },
    },
    mdPlayground: {
      // markdown 文档中的 playground 若干设置
      splitPaneMainSize: '50%',
    },
    docsearchOptions: {
      apiKey: '97db146dbe490416af81ef3a8923bcaa',
      indexName: 'antv_l7',
    },
  },
  extraBabelPlugins: [
    // 开发模式下以原始文本引入，便于调试
    [
      // import glsl as raw text
      'babel-plugin-inline-import',
      { extensions: ['.glsl', '.worker.js'] },
    ],
  ],
  links: [],
  scripts: [
    'https://api.map.baidu.com/api?type=webgl&v=1.0&ak=zLhopYPPERGtpGOgimcdKcCimGRyyIsh',
    ...GaodeTokenScript,
  ],
  analytics: {
    baidu: 'cde34c32ff1edfd4f933bfb44ae0e9f3',
  },
  alias: {
    '@antv/l7': path.resolve(__dirname, '../packages/l7/src'),
    '@antv/l7-core': path.resolve(__dirname, '../packages/core/src'),
    '@antv/l7-component': path.resolve(__dirname, '../packages/component/src'),
    '@antv/l7-three': path.resolve(__dirname, '../packages/three/src'),
    '@antv/l7-layers': path.resolve(__dirname, '../packages/layers/src'),
    '@antv/l7-map': path.resolve(__dirname, '../packages/map/src'),
    '@antv/l7-maps': path.resolve(__dirname, '../packages/maps/src'),
    '@antv/l7-renderer': path.resolve(__dirname, '../packages/renderer/src'),
    '@antv/l7-scene': path.resolve(__dirname, '../packages/scene/src'),
    '@antv/l7-source': path.resolve(__dirname, '../packages/source/src'),
    '@antv/l7-utils': path.resolve(__dirname, '../packages/utils/src'),
  },
});
