"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shapeBae = exports.GeomBase = void 0;
var GeomBase = {
  color: 'updateDraw',
  size: 'repaint',
  filter: 'updateDraw',
  layer: '',
  pickable: true,
  setLayer: function setLayer(layer) {
    this.layer = layer;
    this.style = layer.get('styleOption');
  },
  getShape: function getShape(type) {
    return type;
  },
  draw: function draw() {
    var shape = this.getShape();
    this.Mesh = shape.Mesh();
  },
  // 更新geometry buffer;
  updateDraw: function updateDraw() {},
  repaint: function repaint() {}
};
exports.GeomBase = GeomBase;
var shapeBae = {
  geometryBuffer: function geometryBuffer() {},
  geometry: function geometry() {},
  material: function material() {},
  mesh: function mesh() {}
};
exports.shapeBae = shapeBae;