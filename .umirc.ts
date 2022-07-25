import { defineConfig } from 'dumi';

export default defineConfig({
  title: 'L7 开发',
  favicon:
    'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  logo: 'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',

  outputPath: 'docs-dist',
  resolve: {
    includes: ['dev-demos']
  },
  targets: {
    chrome: 58,
    browsers: [ 'ie >= 11' ]
  },
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

  // more config: https://d.umijs.org/config
});
