const path = require('path');

// Export a function. Accept the base config as the only param.
module.exports = {
  webpackFinal: async (config, { configType }) => {
    config.module.rules.push({
      test: /\.stories\**.svg$/,
      loader: 'svg-inline-loader'
    }
    );
    return config;
  },
};
