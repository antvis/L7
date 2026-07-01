import type { IFatherConfig } from 'father';
import { defineConfig } from 'father';

const isProduction = process.env.NODE_ENV === 'production';

const umdConfig: IFatherConfig['umd'] = {
  name: 'L7Component',
  output: {
    path: './dist',
    filename: 'l7-component.min.js',
  },
  platform: 'browser',
  targets: { ie: 11 },
  // CSS 内联到 JS 中，避免浏览器直连场景还需要额外加载样式文件。
  extractCSS: false,
  chainWebpack(memo) {
    const styleLoader = require.resolve('@umijs/bundler-webpack/compiled/style-loader');

    memo.module.rule('css').use('mini-css-extract').loader(styleLoader).end();
    memo.module.rule('less').use('mini-css-extract').loader(styleLoader).end();

    return memo;
  },
};

export default defineConfig({
  extends: '../../.fatherrc.base.ts',
  esm: { transformer: 'babel' },
  cjs: isProduction ? { transformer: 'babel' } : undefined,
  umd: isProduction ? umdConfig : undefined,
});
