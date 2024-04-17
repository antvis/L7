import type { IFatherConfig } from 'father';
import { defineConfig } from 'father';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

const isProduction = process.env.NODE_ENV === 'production';

const umdConfig: IFatherConfig['umd'] = {
  name: 'L7Maps',
  output: {
    path: './dist',
    filename: 'l7-maps.min.js',
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

    return memo;
  },
};

export default defineConfig({
  extends: '../../.fatherrc.base.ts',
  // 使用 babel 编译 esm/cjs 产物，启用 transform-import-css-l7 插件完成 CSS 内联打包
  esm: { transformer: 'babel' },
  cjs: isProduction ? { transformer: 'babel' } : undefined,
  umd: isProduction ? umdConfig : undefined,
});
