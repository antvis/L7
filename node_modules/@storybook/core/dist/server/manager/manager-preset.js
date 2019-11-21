"use strict";

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.promise");

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  managerWebpack: true,
  managerEntries: true,
  addons: true
};
exports.managerWebpack = managerWebpack;
exports.managerEntries = managerEntries;
exports.addons = addons;

var _loadCustomAddonsFile = _interopRequireDefault(require("../utils/load-custom-addons-file"));

var _managerWebpack = _interopRequireDefault(require("./manager-webpack.config"));

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

async function managerWebpack(_, options) {
  return (0, _managerWebpack.default)(options);
}

async function managerEntries(_, options) {
  const {
    presets,
    managerEntry = '../../client/manager'
  } = options;
  const entries = [require.resolve('../common/polyfills')];
  const installedAddons = await presets.apply('addons', [], options);

  if (installedAddons && installedAddons.length) {
    entries.push(...installedAddons);
  }

  entries.push(require.resolve(managerEntry));
  return entries;
}

async function addons(_, options) {
  return (0, _loadCustomAddonsFile.default)(options);
}