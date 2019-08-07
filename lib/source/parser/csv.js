"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = csv;

var _d3Dsv = require("d3-dsv");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function csv(data, cfg) {
  var x = cfg.x,
      y = cfg.y,
      x1 = cfg.x1,
      y1 = cfg.y1;
  var csvdata = (0, _d3Dsv.csvParse)(data);
  var resultdata = [];
  csvdata.forEach(function (col, featureIndex) {
    var coordinates = [];

    if (x && y) {
      coordinates = [col[x] * 1, col[y] * 1];
    } // 点数据


    if (x1 && y1) {
      // 弧线 或者线段
      coordinates = [[col[x] * 1, col[y] * 1], [col[x1] * 1, col[y1] * 1]];
    }

    col._id = featureIndex + 1;

    var dataItem = _objectSpread({}, col, {
      coordinates: coordinates
    });

    resultdata.push(dataItem);
  });
  return {
    dataArray: resultdata
  };
}