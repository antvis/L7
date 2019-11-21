"use strict";

require("core-js/modules/es.promise");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.babel = void 0;

var _loadCustomBabelConfig = _interopRequireDefault(require("../utils/load-custom-babel-config"));

var _babel = _interopRequireDefault(require("./babel"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const babel = async (_, options) => {
  const {
    configDir,
    presets
  } = options;
  return (0, _loadCustomBabelConfig.default)(configDir, () => presets.apply('babelDefault', (0, _babel.default)(options), options));
};

exports.babel = babel;