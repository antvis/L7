"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "MapBox", {
  enumerable: true,
  get: function get() {
    return _mapbox["default"];
  }
});
Object.defineProperty(exports, "AMap", {
  enumerable: true,
  get: function get() {
    return _AMap["default"];
  }
});
exports.registerMap = exports.getMap = void 0;

var _mapbox = _interopRequireDefault(require("./mapbox"));

var _AMap = _interopRequireDefault(require("./AMap"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var MapType = {
  amap: _AMap["default"],
  mapbox: _mapbox["default"]
};

var getMap = function getMap(type) {
  return MapType[type.toLowerCase()];
};

exports.getMap = getMap;

var registerMap = function registerMap(type, map) {
  if (getMap(type)) {
    throw new Error("Map type '".concat(type, "' existed."));
  }

  map.type = type; // 存储到 map 中

  MapType[type.toLowerCase()] = map;
};

exports.registerMap = registerMap;