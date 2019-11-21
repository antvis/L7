const defaultWebpackConfig = require('./dist/server/preview/base-webpack.config');
const serverUtils = require('./dist/server/utils/template');
const buildStatic = require('./dist/server/build-static');
const buildDev = require('./dist/server/build-dev');

const managerPreset = require.resolve('./dist/server/manager/manager-preset');

module.exports = Object.assign(
  { managerPreset },
  defaultWebpackConfig,
  buildStatic,
  buildDev,
  serverUtils
);
