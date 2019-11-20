module.exports = {
  plugins: [
    {
      resolve: '@antv/gatsby-theme-antv',
      options: {
        GATrackingId: 'UA-148148901-7',
        pathPrefix: '/L7',
      },
    },
  ],
  siteMetadata: {
    title: 'L7',
    description: 'Large-scale WebGL-powered  Geospatial data visualization analysis framework',
    githubUrl: 'https://github.com/antvis/L7',
    navs: [
      {
        slug: 'docs/api',
        title: {
          zh: '文档',
          en: 'Document',
        },
        redirect: 'api/l7',
      },
      {
        slug: 'docs/tutorial',
        title: {
          zh: '教程',
          en: 'Tutorial',
        },
        redirect: 'tutorial/quickstart',
      },
      {
        slug: 'examples',
        title: {
          zh: '图表演示',
          en: 'Examples',
        },
        redirect: 'gallery/basic',
      },
        // target: '_blank',
    ],
    docs: [
      {
        slug: 'manual/tutorial',
        title: {
          zh: '教程',
          en: 'Tutorial',
        },
      },
      {
        slug: 'api/l7',
        title: {
          zh: '简介 L7',
          en: 'Introduction',
        },
        order:0,
      },
      {
        slug: 'api/scene',
        title: {
          zh: '场景 Scene',
          en: 'Scene',
        },
        order:1,
      },
      {
        slug: 'api/layer',
        title: {
          zh: '图层 Layer',
          en: 'Layer'
        },
        order:2,
      },
      {
        slug: 'api/source',
        title: {
          zh: '数据 Source',
          en: 'Source',
        },
        order:3,
      },
      {
        slug: 'api/component',
        title: {
          zh: '组件 Component',
          en: 'Component',
        },
        order:4,
      },
    ],
    examples: [
      {
        slug: 'gallery',
        icon: 'gallery',
        title: {
          zh: 'Gallery',
          en: 'Gallery',
        },
      },
      {
        slug: 'point',
        icon: 'point',
        title: {
          zh: '点图层',
          en: 'Point Layer',
        },
      },
      {
        slug: 'line',
        icon: 'line',
        title: {
          zh: '线图层',
          en: 'Line Layer',
        },
      },
      {
        slug: 'polygon',
        icon: 'polygon',
        title: {
          zh: '面图层',
          en: 'Polygon Layer',
        },
      },
      {
        slug: 'heatmap',
        icon: 'heatmap',
        title: {
          zh: '热力图',
          en: 'HeatMap Layer',
        },
        order:5,
      },
      {
        slug: 'raster',
        icon: 'raster',
        title: {
          zh: '栅格图层',
          en: 'Raster Layer',
        },
      },
      {
        slug: 'tutorial',
        icon: 'map',
        title: {
          zh: '教程示例',
          en: 'Tutorial demo',
        },
      },
    ],
    playground: {
      container: '<div style="min-height: 500px; justify-content: center;position: relative" id="map"/>',
    },
  },
};
