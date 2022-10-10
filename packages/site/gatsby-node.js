const path = require('path');
exports.onCreateWebpackConfig = ({ getConfig }) => {
  const config = getConfig();
  config.module.rules.push({
    test: /\.glsl$/,
    use: {
      loader: 'glsl-shaders-loader'
    }
  });
  config.resolve.extensions.push('.glsl');
  config.resolve.alias = {
    ...config.resolve.alias,
    '@antv/l7': path.resolve(__dirname, '../l7/src'),
    '@antv/l7-mini': path.resolve(__dirname, '../mini/src'),
    '@antv/l7-maps/lib/map': path.resolve(__dirname, '../maps/src/map'),
    '@antv/l7-core': path.resolve(__dirname, '../core/src'),
    '@antv/l7-component': path.resolve(__dirname, '../component/src'),
    '@antv/l7-layers': path.resolve(__dirname, '../layers/src'),
    '@antv/l7-map': path.resolve(__dirname, '../map/src'),
    '@antv/l7-maps': path.resolve(__dirname, '../maps/src'),
    '@antv/l7-renderer': path.resolve(__dirname, '../renderer/src'),
    '@antv/l7-scene': path.resolve(__dirname, '../scene/src'),
    '@antv/l7-source': path.resolve(__dirname, '../source/src'),
    '@antv/l7-utils': path.resolve(__dirname, '../utils/src'),
    '@antv/l7-three': path.resolve(__dirname, '../three/src')
  }
};
