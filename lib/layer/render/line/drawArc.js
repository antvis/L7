"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = DrawArcLine;

var THREE = _interopRequireWildcard(require("../../../core/three"));

var _lineMaterial = require("../../../geom/material/lineMaterial");

var _buffer2 = require("../../../geom/buffer/");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function DrawArcLine(layerData, layer, buffer) {
  var style = layer.get('styleOptions');
  var activeOption = layer.get('activedOptions');

  if (!buffer) {
    var geometryBuffer = (0, _buffer2.getBuffer)(layer.type, layer.shapeType);
    buffer = new geometryBuffer({
      layerData: layerData,
      shapeType: layer.shapeType,
      style: style
    });
  }

  var _buffer = buffer,
      attributes = _buffer.attributes,
      indexArray = _buffer.indexArray;
  var geometry = new THREE.BufferGeometry();
  geometry.setIndex(new THREE.Uint32BufferAttribute(indexArray, 1));
  geometry.addAttribute('position', new THREE.Float32BufferAttribute(attributes.positions, 3));
  geometry.addAttribute('a_color', new THREE.Float32BufferAttribute(attributes.colors, 4));
  geometry.addAttribute('a_instance', new THREE.Float32BufferAttribute(attributes.instanceArray, 4));
  geometry.addAttribute('a_size', new THREE.Float32BufferAttribute(attributes.sizes, 1));
  var lineMaterial = new _lineMaterial.ArcLineMaterial({
    u_opacity: style.opacity,
    u_zoom: layer.scene.getZoom(),
    activeColor: activeOption.fill,
    shapeType: layer.shapeType
  }, {
    SHAPE: false
  });
  var arcMesh = new THREE.Mesh(geometry, lineMaterial);
  return arcMesh;
}