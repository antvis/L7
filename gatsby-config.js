module.exports = {
  plugins: [
    {
      resolve: '@antv/gatsby-theme-antv',
      options: {
        pathPrefix: '/gatsby-theme-antv',
        GATrackingId: 'UA-148148901-7',
        pathPrefix: '/l7',
        theme: {
          'primary-color': '#722ED1',
        },
      },
    },
  ],
  siteMetadata: {
    title: 'L7',
    description: 'Large-scale WebGL-powered  Geospatial data visualization analysis framework',
    githubUrl: 'https://github.com/antvis/antvis.github.io',
    navs: [
      {
        slug: 'docs/specification',
        title: {
          zh: '设计语言',
          en: 'Specification',
        },
      },
      {
        slug: 'docs/API',
        title: {
          zh: '文档',
          en: 'document',
        },
      },
      {
        slug: 'docs/tutorial',
        title: {
          zh: '教程',
          en: 'tutorial',
        },
      },
      {
        slug: 'examples',
        title: {
          zh: '图表演示',
          en: 'Examples',
        },
        redirect: 'point/basic',
      },
        // target: '_blank',
    ],
    docs: [
      {
        slug: 'specification',
        title: {
          zh: '简介',
          en: 'introduction',
        },
      },
      {
        slug: 'manual/tutorial',
        title: {
          zh: '教程',
          en: 'tutorial',
        },
      },
      {
        slug: 'API/L7.md',
        title: {
          zh: '简介',
          en: 'intro',
        },
        order:1,
      },
      {
        slug: 'API/component',
        title: {
          zh: '组件',
          en: 'Component',
        },
        order:1,
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
          en: 'PointLayer',
        },
      },
      {
        slug: 'line',
        icon: 'line',
        title: {
          zh: '线图层',
          en: 'LineLayer',
        },
      },
      {
        slug: 'polygon',
        icon: 'polygon',
        title: {
          zh: '面图层',
          en: 'PolygonLayer',
        },
      },
      {
        slug: 'heatmap',
        icon: 'heatmap',
        title: {
          zh: '热力图',
          en: 'HeatMapLayer',
        },
        order:5,
      },
      {
        slug: 'raster',
        icon: 'raster',
        title: {
          zh: '栅格图层',
          en: 'RasterLayer',
        },
      },
      {
        slug: 'tutorial',
        icon: 'map',
        title: {
          zh: '教程示例',
          en: 'tutorial',
        },
      },
    ],
    exampleContainer: '<div style="min-height: 500px; justify-content: center;position: relative" id="map"/>',
    playground: {
      container: '<div style="min-height: 500px; justify-content: center;position: relative" id="map"/>',
    },
  },

};
