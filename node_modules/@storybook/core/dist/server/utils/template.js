"use strict";

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.string.replace");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPreviewBodyHtml = getPreviewBodyHtml;
exports.getPreviewHeadHtml = getPreviewHeadHtml;
exports.getManagerHeadHtml = getManagerHeadHtml;

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const interpolate = (string, data = {}) => Object.entries(data).reduce((acc, [k, v]) => acc.replace(new RegExp(`%${k}%`, 'g'), v), string);

function getPreviewBodyHtml(configDirPath, interpolations) {
  const base = _fs.default.readFileSync(_path.default.resolve(__dirname, '../templates/base-preview-body.html'), 'utf8');

  const bodyHtmlPath = _path.default.resolve(configDirPath, 'preview-body.html');

  let result = base;

  if (_fs.default.existsSync(bodyHtmlPath)) {
    result = _fs.default.readFileSync(bodyHtmlPath, 'utf8') + result;
  }

  return interpolate(result, interpolations);
}

function getPreviewHeadHtml(configDirPath, interpolations) {
  const base = _fs.default.readFileSync(_path.default.resolve(__dirname, '../templates/base-preview-head.html'), 'utf8');

  const headHtmlPath = _path.default.resolve(configDirPath, 'preview-head.html');

  let result = base;

  if (_fs.default.existsSync(headHtmlPath)) {
    result += _fs.default.readFileSync(headHtmlPath, 'utf8');
  }

  return interpolate(result, interpolations);
}

function getManagerHeadHtml(configDirPath, interpolations) {
  const base = _fs.default.readFileSync(_path.default.resolve(__dirname, '../templates/base-manager-head.html'), 'utf8');

  const scriptPath = _path.default.resolve(configDirPath, 'manager-head.html');

  let result = base;

  if (_fs.default.existsSync(scriptPath)) {
    result += _fs.default.readFileSync(scriptPath, 'utf8');
  }

  return interpolate(result, interpolations);
}