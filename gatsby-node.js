const path = require('path');
exports.onCreateWebpackConfig = ({ getConfig }) => {
  const config = getConfig();
  config.resolve.extensions.push('.glsl');
  config.resolve.alias = {
    ...config.resolve.alias,
    '@antv/l7': path.resolve(__dirname, 'packages/l7/src'),
    '@antv/l7-core': path.resolve(__dirname, 'packages/core/src'),
    '@antv/l7-component': path.resolve(__dirname, 'packages/component/src'),
    '@antv/l7-layers': path.resolve(__dirname, 'packages/layers/src'),
    '@antv/l7-maps': path.resolve(__dirname, 'packages/maps/src'),
    '@antv/l7-renderer': path.resolve(__dirname, 'packages/renderer/src'),
    '@antv/l7-scene': path.resolve(__dirname, 'packages/scene/src'),
    '@antv/l7-source': path.resolve(__dirname, 'packages/source/src'),
    '@antv/l7-utils': path.resolve(__dirname, 'packages/utils/src'),
  };
};
