module.exports = {
  plugins: [
    {
      resolve: '@antv/gatsby-theme-antv',
      options: {
        pathPrefix: '/gatsby-theme-antv',
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
        slug: 'scene',
        icon: 'map',
        title: {
          zh: '场景',
          en: 'Scene',
        },
      },
      {
        slug: 'point',
        icon: 'point',
        title: {
          zh: '点图层',
          en: 'PointLayer',
        },
      }
    ],
    exampleContainer: '<div style="min-height: 590px; justify-content: center;position: relative" id="map"/>'
  },

};
