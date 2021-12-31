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
    isAntVSite: false,
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
    ecosystems: [
      {
        name: {
          zh: 'L7 React组件',
          en: 'L7React L7 For React',
        },
        url: 'http://antv.vision/L7-react/',
      },
      {
        name: {
          zh: 'L7 地理围栏绘制组件库',
          en: 'L7Draw',
        },
        url: 'http://antv.vision/L7-draw/',
      },
      {
        name: {
          zh: 'L7 行政区划可视化库',
          en: 'L7Boundary',
        },
        url: 'http://antv.vision/L7-boundary/',
      },
      {
        name: {
          zh: 'Dipper 地理可视分开发框架',
          en: 'Dipper',
        },
        url: 'http://antv.vision/Dipper',
      },
    ],
    docs: [
      // ****** tutorial
      // quickStart 0
      // demo 1
      // data 2
      {
        slug: 'tutorial/map',
        title: {
          zh: '地图',
          en: 'Map'
        },
        order: 3
      },
      {
        slug: 'tutorial/interactive',
        title: {
          zh: '交互',
          en: 'interactive'
        },
        order: 4
      },

      // ****** api
      {
        slug: 'api/base',
        title: {
          zh: '图层 base',
          en: 'Layer'
        },
        order: 2
      },
      {
        slug: 'api/point_layer',
        title: {
          zh: '点图层',
          en: 'PointLayer'
        },
        order: 2
      },
      {
        slug: 'api/line_layer',
        title: {
          zh: '线图层',
          en: 'LineLayer'
        },
        order: 2
      },
      {
        slug: 'api/polygon_layer',
        title: {
          zh: '面图层',
          en: 'PolygonLayer'
        },
        order: 2
      },
      {
        slug: 'api/heatmap_layer',
        title: {
          zh: '热力图层',
          en: 'HeatMapLayer'
        },
        order: 2
      },
      {
        slug: 'api/imagelayer',
        title: {
          zh: '图片图层',
          en: 'ImageLayer'
        },
        order: 2
      },
      {
        slug: 'api/raster',
        title: {
          zh: '栅格图层',
          en: 'RasterLayer'
        },
        order: 2
      },
      {
        slug: 'api/cityBuilding',
        title: {
          zh: '城市图层',
          en: 'CityBuildLayer'
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
        slug: 'api/source',
        title: {
          zh: '数据 Source',
          en: 'Source'
        },
        order: 5
      },
      {
        slug: 'api/district',
        title: {
          zh: '行政区划',
          en: 'District'
        },
        order: 6
      },
      {
        slug: 'api/draw',
        title: {
          zh: '绘制组件',
          en: 'Draw Component'
        },
        order: 6
      },
      {
        slug: 'api/react',
        title: {
          zh: 'React 组件',
          en: 'React Component'
        },
        order: 6
      },
      {
        slug: 'api/component',
        title: {
          zh: '组件 Component',
          en: 'Component'
        },
        order: 6
      },
      {
        slug: 'api/renderer',
        title: {
          zh: '第三方引擎接入',
          en: 'import other gl'
        },
        order: 3
      },
      {
        slug: 'api/earth',
        title: {
          zh: '地球模式',
          en: 'Earth Mode'
        },
        order: 3
      },
      {
        slug: 'api/wind',
        title: {
          zh: '风场图层',
          en: 'WindLayer'
        },
        order: 3
      },
      {
        slug: 'api/mini',
        title: {
          zh: '小程序',
          en: 'mini'
        },
        order: 3
      },
      {
        slug: 'api/mini/demos',
        title: {
          zh: '案例集合',
          en: 'demos'
        },
        order: 5
      },
      {
        slug: 'api/amapPlugin',
        title: {
          zh: '地图插件',
          en: 'map plugin'
        },
        order: 5
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
        slug: 'engine',
        icon: 'map',
        title: {
          zh: '第三方引擎',
          en: 'other engine'
        }
      },
      {
        slug: 'amapPlugin',
        icon: 'map',
        title: {
          zh: '高德地图插件',
          en: 'amapPlugin'
        }
      },
      {
        slug: 'earth',
        icon: 'map',
        title: {
          zh: '地球模式',
          en: 'Earth Mode'
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
        slug: 'wind',
        icon: 'raster',
        title: {
          zh: '风场图层',
          en: 'Wind Layer'
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
      container: '<div style="height: 100vh;justify-content: center; position: relative" id="map"/>',
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
