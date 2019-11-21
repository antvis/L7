"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = _interopRequireDefault(require("path"));

var _interpretFiles = require("./interpret-files");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function loadConfigFiles({
  configDir
}) {
  const storybookConfigPath = (0, _interpretFiles.getInterpretedFile)(_path.default.resolve(configDir, 'config'));

  if (storybookConfigPath) {
    return [storybookConfigPath];
  }

  return [];
}

var _default = loadConfigFiles;
exports.default = _default;