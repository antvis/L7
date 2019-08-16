"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var geom = {
  point: {
    symbol: ['circle', 'hexagon', 'triangle', 'diamond'],
    native: {
      buffer: '',
      geometry: 'PointGeometry',
      material: 'PointMaterial'
    },
    line: {
      buffer: 'PointBuffer',
      geometry: 'PolygonLine',
      material: 'MeshlineMaterial'
    },
    fill: {
      buffer: 'PointBuffer',
      geometry: 'PolygonGeometry',
      material: 'PolygonMaterial'
    },
    extrude: {
      buffer: 'PointBuffer',
      geometry: 'PolygonGeometry',
      material: 'PolygonMaterial'
    },
    extrudeline: {
      buffer: 'PointBuffer',
      geometry: 'PolygonLine',
      material: 'MeshlineMaterial'
    },
    pointGrid: {
      buffer: 'pointGrid',
      geometry: 'PolygonLine',
      material: 'MeshlineMaterial'
    }
  },
  line: {
    shape: ['native']
  },
  polygon: {
    line: {
      buffer: 'polygonLineBuffer',
      geometry: 'PolygonLine',
      material: 'MeshlineMaterial'
    },
    fill: {
      buffer: 'PolygonBuffer',
      geometry: 'PolygonGeometry',
      material: 'PolygonMaterial'
    },
    extrude: {
      buffer: 'PolygonBuffer',
      geometry: 'PolygonGeometry',
      material: 'PolygonMaterial'
    },
    extrudeline: {
      buffer: 'polygonLineBuffer',
      geometry: 'PolygonLine',
      material: 'MeshlineMaterial'
    }
  }
};
var _default = geom;
exports.default = _default;