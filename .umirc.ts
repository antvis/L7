import { defineConfig } from 'dumi';

export default defineConfig({
  title: 'L7 开发 Demo',
  favicon: 'https://gw.alipayobjects.com/zos/antfincdn/FLrTNDvlna/antv.png',
  logo: 'https://gw.alipayobjects.com/zos/antfincdn/FLrTNDvlna/antv.png',
  outputPath: 'docs-dist',
  base: '/',
  devServer: {
    port: '6006',
  },
  resolve: {
    includes: ['dev-demos'],
  },
  polyfill: {
    imports: ['element-remove', 'babel-polyfill'],
  },
  targets: {
    chrome: 58,
    ie: 11,
  },
  mode: 'site',
  navs: [
    {
      title: 'bugs',
      path: '/bugs',
    },
    {
      title: '特性',
      path: '/features',
    },
  
    {
      title: '图库',
      path: '/gallery',
    },
    {
      title: '瓦片',
      path: '/tile',
    },
    {
      title: '栅格',
      path: '/raster',
    },
    {
      title: '组件',
      path: '/component',
    },
    {
      title: '绘制组件',
      path: '/draw',
    },
    {
      title: 'GitHub',
      path: 'https://github.com/antvis/L7',
    },
  ],
  esbuild: false,
  chainWebpack: (memo, { env, webpack, createCSSRule }) => {
    // 设置 alias
    memo.module
      .rule('lint')
      .test(/\.glsl$/)
      .use('babel')
      .loader('ts-shader-loader');
    // 还可以创建具名use (loaders)
  },
  extraBabelPresets: ['@babel/preset-typescript'],
  extraBabelIncludes: [
    '@umijs/preset-dumi',
    'split-on-first',
    'query-string',
    'strict-uri-encode',
    'copy-text-to-clipboard',
  ],
  extraBabelPlugins: [
    ['transform-import-css-l7'],
    ['babel-plugin-inline-import', { extensions: ['.worker.js'] }],
  ],
  externals: {
    react: 'window.React',
    'react-dom': 'window.ReactDOM',
    antd: 'window.antd',
    lodash: '_',
    fetch: 'window.fetch',
  },
  styles: ['https://gw.alipayobjects.com/os/lib/antd/4.16.13/dist/antd.css'],
  scripts: [
    'https://gw.alipayobjects.com/os/lib/whatwg-fetch/3.6.2/dist/fetch.umd.js',
    'https://gw.alipayobjects.com/os/lib/react/17.0.2/umd/react.profiling.min.js',
    'https://gw.alipayobjects.com/os/lib/react-dom/17.0.2/umd/react-dom.profiling.min.js',
    'https://gw.alipayobjects.com/os/lib/react/17.0.2/umd/react.production.min.js',
    'https://gw.alipayobjects.com/os/lib/react-dom/17.0.2/umd/react-dom.production.min.js',
    // 'https://gw.alipayobjects.com/os/lib/antd/4.16.13/dist/antd-with-locales.js',
    'https://gw.alipayobjects.com/os/lib/antd/4.19.4/dist/antd.js',
    /** lodash */
    'https://gw.alipayobjects.com/os/lib/lodash/4.17.20/lodash.min.js',
  ]

  // more config: https://d.umijs.org/config
});
