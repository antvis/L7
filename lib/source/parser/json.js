"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = json;

var _geojsonRewind = _interopRequireDefault(require("@mapbox/geojson-rewind"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function json(data, cfg) {
  var x = cfg.x,
      y = cfg.y,
      x1 = cfg.x1,
      y1 = cfg.y1,
      coordinates = cfg.coordinates;
  var resultdata = [];
  data.forEach(function (col, featureIndex) {
    var coords = [];

    if (x && y) {
      coords = [col[x], col[y]];
    } // 点数据


    if (x1 && y1) {
      // 弧线 或者线段
      coords = [[col[x], col[y]], [col[x1], col[y1]]];
    }

    if (coordinates) {
      var geometry = {
        type: 'Polygon',
        coordinates: _toConsumableArray(col[coordinates])
      };
      (0, _geojsonRewind["default"])(geometry, true);
      coords = geometry.coordinates;
    }

    col._id = featureIndex + 1;

    var dataItem = _objectSpread({}, col, {
      coordinates: coords
    });

    resultdata.push(dataItem);
  });
  return {
    dataArray: resultdata
  };
}