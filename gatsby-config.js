module.exports = {
  plugins: [
    {
      resolve: '@antv/gatsby-theme-antv',
      options: {
        GATrackingId: 'UA-148148901-7'
      }
    }
  ],
  siteMetadata: {
    title: 'L7',
    description: 'Large-scale WebGL-powered Geospatial data visualization analysis framework',
    siteUrl: 'https://l7.antv.vision',
    githubUrl: 'https://github.com/antvis/L7',
    showChartResize: true, // 是否在demo页展示图表视图切换
    showAPIDoc: true, // 是否在demo页展示API文档
    navs: [
      {
        slug: 'docs/api',
        title: {
          zh: '文档',
          en: 'Document'
        },
        redirect: 'api/l7'
      },
      {
        slug: 'docs/tutorial',
        title: {
          zh: '教程',
          en: 'Tutorial'
        }
      },
      {
        slug: 'examples',
        title: {
          zh: '图表演示',
          en: 'Examples'
        }
      }
    ],
    docs: [
      {
        slug: 'api/l7',
        title: {
          zh: '简介 L7',
          en: 'Introduction'
        },
        order: 0
      },
      {
        slug: 'api/l7stable',
        title: {
          zh: '1.x 稳定版',
          en: '1.x Stable'
        },
        order: 1
      },
      {
        slug: 'tutorial',
        title: {
          zh: '快速入门',
          en: 'QuickStart'
        },
        order: 0
      },
      {
        slug: 'tutorial/map',
        title: {
          zh: '地图',
          en: 'Map'
        },
        order: 3
      },
      {
        slug: 'api/scene',
        title: {
          zh: '场景 Scene',
          en: 'Scene'
        },
        order: 1
      },
      {
        slug: 'api/district',
        title: {
          zh: '行政区划',
          en: 'District'
        },
        order: 2
      },
      {
        slug: 'api/draw',
        title: {
          zh: '绘制组件',
          en: 'Draw Component'
        },
        order: 2
      },
      {
        slug: 'api/react',
        title: {
          zh: 'React 组件',
          en: 'React Component'
        },
        order: 2
      },
      {
        slug: 'api/layer',
        title: {
          zh: '图层 Layer',
          en: 'Layer'
        },
        order: 5
      },
      {
        slug: 'api/layer/point_layer',
        title: {
          zh: '点图层',
          en: 'PointLayer'
        },
        order: 1
      },
      {
        slug: 'api/layer/line_layer',
        title: {
          zh: '线图层',
          en: 'LineLayer'
        },
        order: 2
      },
      {
        slug: 'api/layer/polygon_layer',
        title: {
          zh: '面图层',
          en: 'PolygonLayer'
        },
        order: 3
      },
      {
        slug: 'api/layer/heatmap_layer',
        title: {
          zh: '热力图',
          en: 'HeatmapLayer'
        },
        order: 4
      },
      {
        slug: 'api/layer/image_layer',
        title: {
          zh: '图片图层',
          en: 'IMageLayer'
        },
        order: 5
      },
      {
        slug: 'api/layer/raster_layer',
        title: {
          zh: '栅格图',
          en: 'RasterLayer'
        },
        order: 6
      },
      {
        slug: 'api/layer/cityBuilding',
        title: {
          zh: '城市建筑',
          en: 'CityBuilding'
        },
        order: 8
      },
      {
        slug: 'api/source',
        title: {
          zh: '数据 Source',
          en: 'Source'
        },
        order: 5
      },
      {
        slug: 'api/component',
        title: {
          zh: '组件 Component',
          en: 'Component'
        },
        order: 6
      }
    ],
    examples: [
      {
        slug: 'gallery',
        icon: 'gallery',
        title: {
          zh: '官方精品库',
          en: 'Featured'
        }
      },
      {
        slug: 'react',
        icon: 'map',
        title: {
          zh: 'React 组件',
          en: 'React Demo'
        }
      },
      {
        slug: 'district',
        icon: 'map',
        title: {
          zh: '行政区划',
          en: 'L7 District'
        }
      },
      {
        slug: 'draw',
        icon: 'map',
        title: {
          zh: '绘制组件',
          en: 'L7 Draw'
        }
      },
      {
        slug: 'point',
        icon: 'point',
        title: {
          zh: '点图层',
          en: 'Point Layer'
        }
      },
      {
        slug: 'line',
        icon: 'line',
        title: {
          zh: '线图层',
          en: 'Line Layer'
        }
      },
      {
        slug: 'polygon',
        icon: 'polygon',
        title: {
          zh: '面图层',
          en: 'Polygon Layer'
        }
      },
      {
        slug: 'heatmap',
        icon: 'heatmap',
        title: {
          zh: '热力图',
          en: 'HeatMap Layer'
        },
        order: 5
      },
      {
        slug: 'raster',
        icon: 'raster',
        title: {
          zh: '栅格图层',
          en: 'Raster Layer'
        }
      },
      {
        slug: 'tutorial',
        icon: 'map',
        title: {
          zh: '教程示例',
          en: 'Tutorial demo'
        }
      }
    ],
    playground: {
      container: '<div style="min-height: 500px; justify-content: center; position: relative" id="map"/>',
      dependencies: {
        '@antv/l7': 'latest',
        '@antv/l7-maps': 'latest'
      }
    },
    docsearchOptions: {
      apiKey: '97db146dbe490416af81ef3a8923bcaa',
      indexName: 'antv_l7'
    }
  }
};
