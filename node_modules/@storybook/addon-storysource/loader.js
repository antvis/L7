const deprecate = require('util-deprecate');

deprecate(() => {},
'@storybook/addon-storysource/loader is deprecated, please use @storybook/source-loader instead.')();

module.exports = require('@storybook/source-loader');
