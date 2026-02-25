import type { IFatherConfig } from 'father';
import { defineConfig } from 'father';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { version } from './package.json';

const isProduction = process.env.NODE_ENV === 'production';

const umdConfig: IFatherConfig['umd'] = {
  name: 'L7',
  output: {
    path: './dist',
    filename: 'l7.js',
  },
  platform: 'browser',
  targets: { ie: 11 },
  externals: {
    'mapbox-gl': {
      root: 'mapboxgl',
      commonjs: 'mapbox-gl',
      commonjs2: 'mapbox-gl',
      amd: 'mapbox-gl',
    },
    'maplibre-gl': {
      root: 'maplibregl',
      commonjs: 'maplibre-gl',
      commonjs2: 'maplibre-gl',
      amd: 'maplibre-gl',
    },
  },
  chainWebpack(memo) {
    // 关闭压缩方便调试，默认开启
    // memo.optimization.minimize(false);

    // 打包体积分析
    memo
      .plugin('webpack-bundle-analyzer')
      .use(BundleAnalyzerPlugin, [{ analyzerMode: 'static', openAnalyzer: false }]);

    const styleLoader = require.resolve('@umijs/bundler-webpack/compiled/style-loader');

    // CSS 内联到 JS 中：将 mini-css-extract-loader 替换为 style-loader
    memo.module.rule('css').use('mini-css-extract').loader(styleLoader).end();
    memo.module.rule('less').use('mini-css-extract').loader(styleLoader).end();

    return memo;
  },
};

export default defineConfig({
  extends: '../../.fatherrc.base.ts',
  umd: isProduction ? umdConfig : undefined,
  define: {
    'process.env.VERSION': JSON.stringify(version),
  },
});
