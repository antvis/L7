"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pointToHexbin = pointToHexbin;

var _d3Hexbin = require("d3-hexbin");

var _project = require("../../geo/project");

var statistics = _interopRequireWildcard(require("./statistics"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var R_EARTH = 6378000;

function pointToHexbin(data, option) {
  var dataArray = data.dataArray;
  var _option$size = option.size,
      size = _option$size === void 0 ? 10 : _option$size;
  var pixlSize = size / (2 * Math.PI * R_EARTH) * (256 << 20) / 2;
  var screenPoints = dataArray.map(function (point) {
    var _aProjectFlat = (0, _project.aProjectFlat)(point.coordinates),
        x = _aProjectFlat.x,
        y = _aProjectFlat.y;

    return _objectSpread({}, point, {
      coordinates: [x, y]
    });
  });
  var newHexbin = (0, _d3Hexbin.hexbin)().radius(pixlSize).x(function (d) {
    return d.coordinates[0];
  }).y(function (d) {
    return d.coordinates[1];
  });
  var hexbinBins = newHexbin(screenPoints);
  var result = {
    radius: pixlSize
  };
  result.dataArray = hexbinBins.map(function (hex, index) {
    if (option.field && option.method) {
      var columns = getColumn(hex, option.field);
      hex[option.method] = statistics[option.method](columns);
    }

    var item = {};
    item[option.method] = hex[option.method];
    return _objectSpread({}, item, {
      count: hex.length,
      coordinates: (0, _project.unProjectFlat)([hex.x, hex.y]),
      _id: index + 1
    });
  });
  return result;
}

function getColumn(data, columnName) {
  return data.map(function (item) {
    return item[columnName];
  });
}