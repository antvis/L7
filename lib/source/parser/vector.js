"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = vector;

var _bkdrHash = require("../../util/bkdr-hash");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Extent = 4096;

function vector(data, cfg) {
  var tile = cfg.tile;
  var resultdata = [];
  var featureKeys = {};
  var x0 = Extent * tile[0];
  var y0 = Extent * tile[1];

  function covertP20(points) {
    return points.map(function (point) {
      var x1 = (x0 + point.x << 20 - tile[2] - 4) - 215440491;
      var y2 = (y0 + point.y << 20 - tile[2] - 4) - 106744817;
      return [x1, -y2, 0];
    });
  }

  var index = 0;

  for (var i = 0; i < data.length; i++) {
    var feature = data.feature(i);
    var coords = feature.loadGeometry();
    var properties = feature.properties;
    var id = i + 1;

    if (cfg.idField && properties[cfg.idField]) {
      var value = properties[cfg.idField];
      id = (0, _bkdrHash.djb2hash)(value) % 1000019;
      featureKeys[id] = {
        index: index,
        idField: value
      };
    }

    var geocoords = classifyRings(coords);

    for (var j = 0; j < geocoords.length; j++) {
      var geo = geocoords[j].map(function (coord) {
        return covertP20(coord);
      });
      index++;
      resultdata.push(_objectSpread({}, properties, {
        _id: feature.id || id,
        coordinates: geo
      }));
    }
  }

  return {
    dataArray: resultdata,
    featureKeys: featureKeys
  };
}

function signedArea(ring) {
  var sum = 0;

  for (var i = 0, len = ring.length, j = len - 1, p1, p2; i < len; j = i++) {
    p1 = ring[i];
    p2 = ring[j];
    sum += (p2.x - p1.x) * (p1.y + p2.y);
  }

  return sum;
}

function classifyRings(rings) {
  var len = rings.length;
  if (len <= 1) return [rings];
  var polygons = [];
  var polygon;
  var ccw;

  for (var i = 0; i < len; i++) {
    var area = signedArea(rings[i]);
    if (area === 0) continue;
    if (ccw === undefined) ccw = area < 0;

    if (ccw === area < 0) {
      if (polygon) polygons.push(polygon);
      polygon = [rings[i]];
    } else {
      polygon.push(rings[i]);
    }
  }

  if (polygon) polygons.push(polygon);
  return polygons;
}