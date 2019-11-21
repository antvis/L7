"use strict";

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.promise");

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  webpack: true,
  entries: true,
  config: true
};
exports.config = exports.entries = exports.webpack = void 0;

var _loadCustomConfigFile = _interopRequireDefault(require("../utils/load-custom-config-file"));

var _iframeWebpack = _interopRequireDefault(require("./iframe-webpack.config"));

var _entries = require("./entries");

var _commonPreset = require("../common/common-preset");

Object.keys(_commonPreset).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _commonPreset[key];
    }
  });
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const webpack = async (_, options) => (0, _iframeWebpack.default)(options);

exports.webpack = webpack;

const entries = async (_, options) => {
  let result = [];
  result = result.concat((await (0, _entries.createPreviewEntry)(options)));

  if (options.configType === 'DEVELOPMENT') {
    result = result.concat(`${require.resolve('webpack-hot-middleware/client')}?reload=true&quiet=true`);
  }

  return result;
};

exports.entries = entries;

const config = async (_, options) => (0, _loadCustomConfigFile.default)(options);

exports.config = config;