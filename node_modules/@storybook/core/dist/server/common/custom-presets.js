"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = loadCustomPresets;

var _path = _interopRequireDefault(require("path"));

var _serverRequire = _interopRequireDefault(require("../utils/server-require"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function loadCustomPresets({
  configDir
}) {
  const presets = (0, _serverRequire.default)(_path.default.resolve(configDir, 'presets'));
  return presets || [];
}