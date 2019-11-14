const setWebpackConfig = require('./.storybook/webpack.config');

exports.onCreateWebpackConfig = ({ getConfig, stage, plugins }) => {
  const config = getConfig();
  config.resolve.extensions.push('.glsl');
  console.log(config);
};
