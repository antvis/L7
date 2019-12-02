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
    '@antv/l7': path.resolve(__dirname, 'packages/l7/src'),
    '@antv/l7-maps': path.resolve(__dirname, 'packages/maps/src')
  };
};
