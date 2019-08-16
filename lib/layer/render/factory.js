"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerRender = exports.getRender = exports.Render_MAP = void 0;
var Render_MAP = {};
exports.Render_MAP = Render_MAP;

var getRender = function getRender(layerType, shapeType) {
  return Render_MAP[layerType.toLowerCase()] && Render_MAP[layerType.toLowerCase()][shapeType.toLowerCase()];
};

exports.getRender = getRender;

var registerRender = function registerRender(layerType, shapeType, render) {
  if (getRender(layerType, shapeType)) {
    throw new Error("Render shapeType '".concat(shapeType, "' existed."));
  } // 存储到 map 中


  if (!Render_MAP[layerType.toLowerCase()]) Render_MAP[layerType.toLowerCase()] = {};
  Render_MAP[layerType.toLowerCase()][shapeType.toLowerCase()] = render;
};

exports.registerRender = registerRender;