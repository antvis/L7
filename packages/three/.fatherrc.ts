import type { IFatherConfig } from 'father';
import { defineConfig } from 'father';

const isProduction = process.env.NODE_ENV === 'production';

const umdConfig: IFatherConfig['umd'] = {
  name: 'L7Three',
  output: {
    path: './dist',
    filename: 'l7-three.min.js',
  },
  platform: 'browser',
  targets: { ie: 11 },
  externals: {
    '@antv/l7': 'L7',
    three: 'Three',
  },
  chainWebpack(memo) {
    // 关闭压缩方便调试，默认开启
    // memo.optimization.minimize(false);

    // 打包体积分析
    // memo
    //   .plugin('webpack-bundle-analyzer')
    //   .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin, [{ analyzerMode: 'static', openAnalyzer: false }]);

    return memo;
  },
};

export default defineConfig({
  extends: '../../.fatherrc.base.ts',
  umd: isProduction ? umdConfig : undefined,
});
