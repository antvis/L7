"use strict";

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.array.sort");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getInterpretedFile = getInterpretedFile;
exports.getInterpretedFileWithExt = getInterpretedFileWithExt;

var _fs = _interopRequireDefault(require("fs"));

var _interpret = require("interpret");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const boost = new Set(['.js', '.jsx', '.ts', '.tsx']);

function sortExtensions() {
  return [...Array.from(boost), ...Object.keys(_interpret.extensions).filter(ext => !boost.has(ext)).sort((a, b) => a.length - b.length)];
}

const possibleExtensions = sortExtensions();

function getInterpretedFile(pathToFile) {
  return possibleExtensions.map(ext => `${pathToFile}${ext}`).find(candidate => _fs.default.existsSync(candidate));
}

function getInterpretedFileWithExt(pathToFile) {
  return possibleExtensions.map(ext => ({
    path: `${pathToFile}${ext}`,
    ext
  })).find(candidate => _fs.default.existsSync(candidate.path));
}