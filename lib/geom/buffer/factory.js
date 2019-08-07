"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerBuffer = exports.getBuffer = exports.Buffer_MAP = void 0;
var Buffer_MAP = {};
exports.Buffer_MAP = Buffer_MAP;

var getBuffer = function getBuffer(bufferType, shapeType) {
  return Buffer_MAP[bufferType.toLowerCase()] && Buffer_MAP[bufferType.toLowerCase()][shapeType.toLowerCase()];
};

exports.getBuffer = getBuffer;

var registerBuffer = function registerBuffer(bufferType, shapeType, render) {
  if (getBuffer(bufferType, shapeType)) {
    throw new Error("Render shapeType '".concat(shapeType, "' existed."));
  } // 存储到 map 中


  if (!Buffer_MAP[bufferType.toLowerCase()]) Buffer_MAP[bufferType.toLowerCase()] = {};
  Buffer_MAP[bufferType.toLowerCase()][shapeType.toLowerCase()] = render;
};

exports.registerBuffer = registerBuffer;