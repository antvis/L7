"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = polygonGeom;
exports.pointGeom = pointGeom;

var _geom = _interopRequireDefault(require("../../geom/geom"));

var _index = require("../../geom/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// geom shape buffer geometry material
// shape name type()
// buffer  1:n  geometry
// geometry
//
function polygonGeom(shape, coordinates, properties, layerid) {
  var polygongeom = _geom.default.polygon;
  var _polygongeom$shape = polygongeom[shape],
      buffer = _polygongeom$shape.buffer,
      geometry = _polygongeom$shape.geometry,
      material = _polygongeom$shape.material; // polygon 映射表

  var bufferData = new _index.GeoBuffer[buffer]({
    coordinates: coordinates,
    properties: properties,
    shape: shape
  });
  bufferData.bufferStruct.name = layerid;
  var bg = new _index.bufferGeometry[geometry](bufferData.bufferStruct);

  var mtl = _index.Material[material]();

  return {
    geometry: bg,
    mtl: mtl
  };
}

function pointGeom(shape, bufferData) {
  var pointgeom = _geom.default.point;
  var _pointgeom$shape = pointgeom[shape],
      geometry = _pointgeom$shape.geometry,
      material = _pointgeom$shape.material;
  var bg = new _index.bufferGeometry[geometry](bufferData.bufferStruct);

  var mtl = _index.Material[material]();

  return {
    geometry: bg,
    mtl: mtl
  };
}