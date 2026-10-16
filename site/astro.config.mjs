import { defineConfig } from '@antv/astro-theme-antv';
import react from '@astrojs/react';
import { fileURLToPath } from 'node:url';
import vitePluginString from 'vite-plugin-string';

const config = defineConfig({
  site: {
    title: 'L7',
    metaTitle: {
      zh: 'AntV L7 地理空间数据可视化引擎',
      en: 'L7 · Geospatial Visualization',
    },
    origin: 'https://l7.antv.antgroup.com',
    repository: 'https://github.com/antvis/L7',
    description: {
      zh: '蚂蚁集团 AntV 数据可视化团队推出的基于 WebGL 的开源大规模地理空间数据可视分析引擎。',
      en: 'Geospatial Data Visualization Analysis Engine',
    },
    locales: ['zh', 'en'],
    defaultLocale: 'zh',
    logo: 'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*A-lcQbVTpjwAAAAAAAAAAAAADmJ7AQ/original',
    favicon:
      'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*7svFR6wkPMoAAAAAAAAAAAAADmJ7AQ/original',
  },
  analytics: {
    Baidu: { id: 'cde34c32ff1edfd4f933bfb44ae0e9f3' },
  },
  content: {
    docs: './docs',
    examples: './examples',
    edit: {
      branch: 'master',
      path: 'site/docs',
    },
    sidebar: {
      'tutorial/map': {
        zh: '地图使用',
        en: 'Map Usage',
        order: 3,
      },
      'tutorial/interactive': {
        zh: '图层交互',
        en: 'Layer Interactive',
        order: 4,
      },
      'tutorial/point': {
        zh: '点图层 PointLayer',
        en: 'PointLayer',
        order: 5,
      },
      'tutorial/line': {
        zh: '线图层 LineLayer',
        en: 'LineLayer',
        order: 6,
      },
      'tutorial/polygon': {
        zh: '面图层 PolygonLayer',
        en: 'PolygonLayer',
        order: 7,
      },
      'tutorial/heatmap': {
        zh: '热力图层 HeatmapLayer',
        en: 'HeatmapLayer',
        order: 8,
      },
      'tutorial/tile': {
        zh: '瓦片图层 TileLayer',
        en: 'TileLayer',
        order: 11,
      },
      'tutorial/monitor': {
        zh: '监控打点',
        en: 'Monitor',
        order: 12,
      },
      'api/map': {
        zh: '地图 Map',
        en: 'Map',
        order: 3,
      },
      'api/source': {
        zh: '数据 Source',
        en: 'Source',
        order: 3,
      },
      'api/component': {
        zh: '组件 Component',
        en: 'Component',
        order: 3,
      },
      'api/base_layer': {
        zh: '图层基类 BaseLayer',
        en: 'BaseLayer',
        order: 3,
      },
      'api/point_layer': {
        zh: '点图层 PointLayer',
        en: 'PointLayer',
        order: 3,
      },
      'api/line_layer': {
        zh: '线图层 LineLayer',
        en: 'LineLayer',
        order: 4,
      },
      'api/polygon_layer': {
        zh: '面图层 PolygonLayer',
        en: 'PolygonLayer',
        order: 5,
      },
      'api/heatmap_layer': {
        zh: '热力图层 HeatMapLayer',
        en: 'HeatMapLayer',
        order: 6,
      },
      'api/image_layer': {
        zh: '图片图层 ImageLayer',
        en: 'ImageLayer',
        order: 7,
      },
      'api/raster_layer': {
        zh: '栅格图层 RasterLayer',
        en: 'RasterLayer',
        order: 9,
      },
      'api/tile': {
        zh: '瓦片图层 TileLayer',
        en: 'TileLayer',
        order: 10,
      },
      'api/other': {
        zh: '其他图层 Other',
        en: 'Other Layers',
        order: 11,
      },
      'api/debug': {
        zh: '调试 debug',
        en: 'debug',
        order: 12,
      },
      'api/experiment': {
        zh: '实验特性',
        en: 'experiment',
        order: 13,
      },
      'api/react': {
        zh: 'React 组件库',
        en: 'React component',
        order: 13,
      },
    },
  },
  navigation: [
    {
      text: {
        zh: '使用教程',
        en: 'Tutorial',
      },
      href: '/tutorial/l7/',
    },
    {
      text: {
        zh: 'API 文档',
        en: 'API',
      },
      href: '/api/scene/',
    },
    {
      text: {
        zh: '图表演示',
        en: 'Examples',
      },
      href: '/examples/',
    },
    {
      text: { zh: '地图工具', en: 'Map tools' },
      children: [
        {
          text: { zh: '行政区划数据', en: 'Administrative divisions' },
          href: '/tools/',
        },
        {
          text: { zh: 'GeoJSON 编辑工具', en: 'GeoJSON editor' },
          href: 'https://l7editor.antv.antgroup.com/',
        },
      ],
    },
    {
      text: { zh: '周边生态', en: 'Ecosystem' },
      children: [
        { text: { zh: 'L7React', en: 'L7React' }, href: 'https://larkmap.antv.antgroup.com/' },
        { text: { zh: 'L7Plot', en: 'L7Plot' }, href: 'https://l7plot.antv.antgroup.com/' },
        { text: { zh: 'L7Draw', en: 'L7Draw' }, href: 'https://antv.vision/L7Draw/' },
        { text: { zh: 'L7VP', en: 'L7VP' }, href: 'https://li.antv.antgroup.com/#/home' },
        { text: { zh: 'L7Editor', en: 'L7Editor' }, href: 'https://l7editor.antv.antgroup.com/' },
      ],
    },
  ],
  examples: [
    {
      slug: 'gallery',
      title: {
        zh: '官方精品库',
        en: 'Featured',
      },
      icon: 'gallery',
    },
    {
      slug: 'map',
      title: {
        zh: '地图底图',
        en: 'BaseMap',
      },
      icon: 'map',
    },
    {
      slug: 'point',
      title: {
        zh: '点图层',
        en: 'Point Layer',
      },
      icon: 'point',
    },
    {
      slug: 'line',
      title: {
        zh: '线图层',
        en: 'Line Layer',
      },
      icon: 'line',
    },
    {
      slug: 'polygon',
      title: {
        zh: '面图层',
        en: 'Polygon Layer',
      },
      icon: 'polygon',
    },
    {
      slug: 'earth',
      title: {
        zh: '地球模式',
        en: 'Earth Mode',
      },
      icon: 'map',
    },
    {
      slug: 'heatmap',
      title: {
        zh: '热力图',
        en: 'HeatMap Layer',
      },
      icon: 'heatmap',
    },
    {
      slug: 'component',
      title: {
        zh: '组件',
        en: 'Component',
      },
      icon: 'map',
    },
    {
      slug: 'raster',
      title: {
        zh: '栅格图层',
        en: 'Raster Layer',
      },
      icon: 'raster',
    },
    {
      slug: 'tile',
      title: {
        zh: '瓦片图层',
        en: 'Tile Layer',
      },
      icon: 'raster',
    },
    {
      slug: 'mask',
      title: {
        zh: '图层掩膜',
        en: 'Layer Mask',
      },
      icon: 'raster',
    },
    {
      slug: 'geometry',
      title: {
        zh: '几何体图层',
        en: 'Geometry Layer',
      },
      icon: 'raster',
    },
    {
      slug: 'composite-layers',
      title: {
        zh: '复合图层',
        en: 'CompositeLayers',
      },
      icon: 'map',
    },
    {
      slug: 'engine',
      title: {
        zh: '第三方引擎',
        en: 'other engine',
      },
      icon: 'map',
    },
    {
      slug: 'draw',
      title: {
        zh: '绘制组件',
        en: 'L7Draw',
      },
      icon: 'map',
    },
    {
      slug: 'amap-plugin',
      title: {
        zh: '高德地图插件',
        en: 'Amap Plugin',
      },
      icon: 'map',
    },
    {
      slug: 'choropleth',
      title: {
        zh: '行政区划',
        en: 'Choropleth',
      },
      icon: 'map',
    },
    {
      slug: 'tutorial',
      title: {
        zh: '教程示例',
        en: 'Tutorial demo',
      },
      icon: 'map',
    },
  ],
  home: {
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
    actions: [
      {
        text: {
          zh: '开始使用',
          en: 'Getting Started',
        },
        href: '/tutorial/quickstart/',
      },
      {
        text: {
          zh: '图表示例',
          en: 'gallery',
        },
        href: '/examples/',
      },
      {
        text: {
          zh: 'QuickIssue',
          en: 'QuickIssue',
        },
        href: '/tutorial/quick_issue/',
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
  },
  theme: { tokens: { '--home-background': '#ffffff' } },
  slots: {
    home: {
      hero: ['./src/components/Home.astro'],
      features: ['./src/components/Home.astro'],
      afterFeatures: ['./src/components/Ecosystem.astro'],
      beforeFooter: ['./src/components/Customers.astro'],
    },
  },
  llms: {
    locales: ['zh'],
  },
  demo: {
    setup: './src/demo/setup.ts',
    height: 600,
    dependencies: {
      'district-data': 'district-data/dist/esm/index.js',
      '@antv/l7-draw': '@antv/l7-draw/es/index.js',
      react: './src/demo/react.ts',
      'react/jsx-runtime': './src/demo/jsx-runtime.ts',
      'react-dom/client': './src/demo/react-dom-client.ts',
    },
  },
});

config.integrations.push(react());
config.devToolbar = { enabled: false };
const sourcePackages = {
  '@antv/l7': '../packages/l7/src',
  '@antv/l7-core': '../packages/core/src',
  '@antv/l7-component': '../packages/scene/src/component',
  '@antv/l7-three': '../packages/three/src',
  '@antv/l7-layers': '../packages/layers/src',
  '@antv/l7-map': '../packages/maps/src/mapbase',
  '@antv/l7-maps': '../packages/maps/src',
  '@antv/l7-renderer': '../packages/scene/src/renderer',
  '@antv/l7-scene': '../packages/scene/src',
  '@antv/l7-source': '../packages/layers/src/source',
  '@antv/l7-utils': '../packages/utils/src',
};
config.vite = {
  server: { fs: { allow: [fileURLToPath(new URL('..', import.meta.url))] } },
  resolve: {
    alias: Object.entries(sourcePackages).map(([name, source]) => ({
      find: new RegExp('^' + name + '$'),
      replacement: fileURLToPath(new URL(source, import.meta.url)),
    })),
    dedupe: ['react', 'react-dom'],
  },
  plugins: [
    vitePluginString({
      compress: false,
      include: ['**/*.glsl', '**/*.wgsl', '**/*.vs', '**/*.fs', '**/*.vert', '**/*.frag'],
    }),
  ],
  optimizeDeps: {
    exclude: Object.keys(sourcePackages),
  },
  define: { 'process.env.VERSION': JSON.stringify('2.30.0-beta.1') },
};
export default config;
