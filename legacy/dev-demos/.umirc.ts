import { defineConfig } from 'dumi';
import { join } from 'path';

const isLocal = process.env.DPS_ENV === 'local';
const rootDir = join(__dirname, '../../');
const alias = {
  '@antv/l7': join(rootDir, './packages/l7/src'),
  '@antv/l7-maps': join(rootDir, './packages/maps/src'),
  '@antv/l7-core': join(rootDir, './packages/core/src'),
  '@antv/l7-component': join(rootDir, './packages/component/src'),
  '@antv/l7-three': join(rootDir, './packages/three/src'),
  '@antv/l7-layers': join(rootDir, './packages/layers/src'),
  '@antv/l7-map': join(rootDir, './packages/map/src'),
  '@antv/l7-renderer': join(rootDir, './packages/renderer/src'),
  '@antv/l7-scene': join(rootDir, './packages/scene/src'),
  '@antv/l7-source': join(rootDir, './packages/source/src'),
  '@antv/l7-utils': join(rootDir, './packages/utils/src'),
};

export default defineConfig({
  title: 'L7 开发 Demo',
  favicon: 'https://gw.alipayobjects.com/zos/antfincdn/FLrTNDvlna/antv.png',
  logo: 'https://gw.alipayobjects.com/zos/antfincdn/FLrTNDvlna/antv.png',
  outputPath: 'docs-dist',
  base: '/',
  alias: isLocal && alias,
  resolve: {
    includes: ['src'],
  },
  define: {
    'process.env.renderer': process.env.renderer?.replace(/\'/g, ''),
    'process.env.CI': process.env.CI?.replace(/\'/g, ''),
  },
  devServer: {
    port: '6006',
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
      title: 'WebGPU',
      path: '/webgpu',
    },
    {
      title: 'GitHub',
      path: 'https://github.com/antvis/L7',
    },
  ],
  copy: [
    {
      from: 'node_modules/@antv/g-device-api/dist/pkg/glsl_wgsl_compiler_bg.wasm',
      to: '[name].[ext]',
    },
  ],
  esbuild: false,
  chainWebpack: (memo, { env, webpack, createCSSRule }) => {
    // 设置 alias
    memo.module
      .rule('lint')
      .test(/\.(glsl|wgsl)$/)
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
  extraBabelPlugins: [['babel-plugin-inline-import', { extensions: ['.worker.js'] }]],
  externals: {
    react: 'window.React',
    'react-dom': 'window.ReactDOM',
    antd: 'window.antd',
    lodash: '_',
    fetch: 'window.fetch',
  },
  styles: ['https://gw.alipayobjects.com/os/lib/antd/4.16.13/dist/antd.css'],
  scripts: [
    ` window._AMapSecurityConfig = {
      securityJsCode: "290ddc4b0d33be7bc9b354bc6a4ca614"
    }`,
    'https://webapi.amap.com/maps?v=2.0&key=6f025e700cbacbb0bb866712d20bb35c',
    'https://gw.alipayobjects.com/os/lib/whatwg-fetch/3.6.2/dist/fetch.umd.js',
    'https://gw.alipayobjects.com/os/lib/react/17.0.2/umd/react.profiling.min.js',
    'https://gw.alipayobjects.com/os/lib/react-dom/17.0.2/umd/react-dom.profiling.min.js',
    'https://gw.alipayobjects.com/os/lib/react/17.0.2/umd/react.production.min.js',
    'https://gw.alipayobjects.com/os/lib/react-dom/17.0.2/umd/react-dom.production.min.js',
    // 'https://gw.alipayobjects.com/os/lib/antd/4.16.13/dist/antd-with-locales.js',
    'https://gw.alipayobjects.com/os/lib/antd/4.19.4/dist/antd.js',
    'https://api.map.baidu.com/api?type=webgl&v=1.0&ak=zLhopYPPERGtpGOgimcdKcCimGRyyIsh',
    // "https://api.map.baidu.com/api?v=1.0&amp;&amp;type=webgl&amp;ak=zLhopYPPERGtpGOgimcdKcCimGRyyIsh",
    /** lodash */
    'https://gw.alipayobjects.com/os/lib/lodash/4.17.20/lodash.min.js',
  ],
  publicPath: '/public/',

  // more config: https://d.umijs.org/config
});
