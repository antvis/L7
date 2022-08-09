import { defineConfig } from 'dumi';

export default defineConfig({
  title: 'L7 开发 Demo',
  favicon: 'https://gw.alipayobjects.com/zos/antfincdn/FLrTNDvlna/antv.png',
  logo: 'https://gw.alipayobjects.com/zos/antfincdn/FLrTNDvlna/antv.png',
  outputPath: 'docs-dist',
  devServer:{
    port:'6006'
  },
  resolve: {
    includes: ['dev-demos']
  },
  targets: {
    chrome: 58,
    ie: 11,
  },
  mode: 'site',
  esbuild:false,
  extraBabelPresets:[
    '@babel/preset-typescript'
  ],
  extraBabelPlugins: [
        // 开发模式下以原始文本引入，便于调试
    [
      // import glsl as raw text
      'babel-plugin-inline-import',
      {
        extensions: [
          // 由于使用了 TS 的 resolveJsonModule 选项，JSON 可以直接引入，不需要当作纯文本
          // '.json',
          '.glsl'
        ]
      }
    ],
    [
      'transform-import-css-l7'
    ],
  ],
  navs: [
    null,
    {
      title: 'GitHub',
      path: 'https://github.com/antvis/L7',
    },
  ],
  externals: {
    react: 'window.React',
    'react-dom': 'window.ReactDOM',
    antd: 'window.antd',
    lodash: '_',
  },
  links: ['https://gw.alipayobjects.com/os/lib/antd/4.16.13/dist/antd.css'],
  scripts: [
    'https://gw.alipayobjects.com/os/lib/react/17.0.1/umd/react.development.js',
    'https://gw.alipayobjects.com/os/lib/react-dom/17.0.1/umd/react-dom.development.js',
    // 'https://gw.alipayobjects.com/os/lib/antd/4.16.13/dist/antd-with-locales.js',
    'https://gw.alipayobjects.com/os/lib/antd/4.19.4/dist/antd.js',
    /** lodash */
    'https://gw.alipayobjects.com/os/lib/lodash/4.17.20/lodash.min.js',
  ],

  // more config: https://d.umijs.org/config
});
