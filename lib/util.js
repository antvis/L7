"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var Utils = _interopRequireWildcard(require("@antv/util"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

var Util = Utils.mix({}, Utils, {
  assign: Utils.mix,
  // simple mix
  merge: Utils.deepMix,
  // deep mix
  cloneDeep: Utils.clone,
  isFinite: isFinite,
  isNaN: isNaN,
  snapEqual: Utils.isNumberEqual,
  remove: Utils.pull,
  inArray: Utils.contains
});
Util.Array = {
  groupToMap: Utils.groupToMap,
  group: Utils.group,
  merge: Util.merge,
  values: Utils.valuesOfKey,
  getRange: Utils.getRange,
  firstValue: Utils.firstValue,
  remove: Utils.pull
};
var _default = Util;
exports["default"] = _default;