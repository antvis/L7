"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extent = extent;
exports.tranfrormCoord = tranfrormCoord;

/**
 * 计算地理数据范围
 * @param {dataArray} data 地理坐标数据
 * @return {Array} extent
 */
function extent(data) {
  var extent = [Infinity, Infinity, -Infinity, -Infinity];
  data.forEach(function (item) {
    var coordinates = item.coordinates;
    calcExtent(extent, coordinates);
  });
  return extent;
}

function calcExtent(extent, coords) {
  if (Array.isArray(coords[0])) {
    coords.forEach(function (coord) {
      calcExtent(extent, coord);
    });
  } else {
    if (extent[0] > coords[0]) extent[0] = coords[0];
    if (extent[1] > coords[1]) extent[1] = coords[1];
    if (extent[2] < coords[0]) extent[2] = coords[0];
    if (extent[3] < coords[1]) extent[3] = coords[1];
  }

  return extent;
}

function tranfrormCoord(data, cb) {
  return transform(data, cb);
}

function transform(item, cb) {
  if (Array.isArray(item[0])) {
    return item.map(function (coord) {
      return transform(coord, cb);
    });
  }

  return cb(item);
}