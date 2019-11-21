"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = _interopRequireDefault(require("path"));

var _serverRequire = _interopRequireDefault(require("./server-require"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const webpackConfigs = ['webpack.config', 'webpackfile'];

var _default = configDir => (0, _serverRequire.default)(webpackConfigs.map(configName => _path.default.resolve(configDir, configName)));

exports.default = _default;