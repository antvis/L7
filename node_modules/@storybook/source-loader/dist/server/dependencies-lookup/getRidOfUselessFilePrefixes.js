"use strict";

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.string.replace");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRidOfUselessFilePrefixes = getRidOfUselessFilePrefixes;

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function commonDir(...resources) {
  const firstResource = (resources[0] || '').split(_path.default.sep);
  let i = 1;

  while (i < firstResource.length && // eslint-disable-next-line no-loop-func
  resources.every(resource => resource.startsWith(firstResource.slice(0, i).join(_path.default.sep)))) {
    i += 1;
  }

  return firstResource.slice(0, i - 1).join(_path.default.sep);
}

function getRidOfUselessFilePrefixes({
  resource,
  source,
  sourceJson,
  addsMap,
  dependencies,
  localDependencies,
  idsToFrameworks
}) {
  const commondir = commonDir(resource, ...Object.keys(localDependencies || {}));
  return {
    prefix: commondir,
    source,
    sourceJson,
    addsMap,
    dependencies,
    idsToFrameworks,
    resource: commondir === resource ? '/index.js' : resource.substring(commondir.length).replace(_path.default.sep === '\\' ? /\\/g : /\//g, '/'),
    localDependencies: Object.assign({}, ...Object.entries(localDependencies || {}).map(([depFileName, dependency]) => ({
      [depFileName.substring(commondir.length).replace(new RegExp(_path.default.sep === '\\' ? /\\/g : /\//g, 'g'), '/')]: dependency
    })))
  };
}