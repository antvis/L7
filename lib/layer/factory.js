"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerLayer = exports.getLayer = exports.LAYER_MAP = void 0;
var LAYER_MAP = {};
exports.LAYER_MAP = LAYER_MAP;

var getLayer = function getLayer(type) {
  return LAYER_MAP[type.toLowerCase()];
};

exports.getLayer = getLayer;

var registerLayer = function registerLayer(type, layer) {
  if (getLayer(type)) {
    throw new Error("Layer type '".concat(type, "' existed."));
  } // 存储到 map 中


  LAYER_MAP[type] = layer;
};

exports.registerLayer = registerLayer;