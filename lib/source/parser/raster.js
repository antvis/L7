"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = raster;

function raster(data, cfg) {
  var extent = cfg.extent,
      width = cfg.width,
      height = cfg.height,
      min = cfg.min,
      max = cfg.max;
  var resultData = {
    _id: 1,
    dataArray: [{
      data: Array.from(data),
      width: width,
      height: height,
      min: min,
      max: max,
      coordinates: [[extent[0], extent[1]], [extent[2], extent[3]]]
    }]
  };
  return resultData;
}