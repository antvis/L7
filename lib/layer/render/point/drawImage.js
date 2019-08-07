"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = DrawImage;

var THREE = _interopRequireWildcard(require("../../../core/three"));

var PointBuffer = _interopRequireWildcard(require("../../../geom/buffer/point/index"));

var _pointMaterial = _interopRequireDefault(require("../../../geom/material/pointMaterial"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function DrawImage(layerData, layer) {
  var geometry = new THREE.BufferGeometry();
  var style = layer.get('styleOptions');
  var strokeWidth = style.strokeWidth,
      stroke = style.stroke,
      opacity = style.opacity;
  var texture = layer.scene.image.texture;
  var attributes = PointBuffer.ImageBuffer(layerData, {
    imagePos: layer.scene.image.imagePos
  });
  geometry.addAttribute('position', new THREE.Float32BufferAttribute(attributes.vertices, 3));
  geometry.addAttribute('a_color', new THREE.Float32BufferAttribute(attributes.colors, 4));
  geometry.addAttribute('pickingId', new THREE.Float32BufferAttribute(attributes.pickingIds, 1));
  geometry.addAttribute('uv', new THREE.Float32BufferAttribute(attributes.uv, 2));
  geometry.addAttribute('a_size', new THREE.Float32BufferAttribute(attributes.sizes, 1));
  var material = new _pointMaterial["default"]({
    u_opacity: opacity,
    u_strokeWidth: strokeWidth,
    u_stroke: stroke,
    u_texture: texture
  }, {
    SHAPE: false,
    TEXCOORD_0: true
  });
  material.depthTest = false;
  var strokeMesh = new THREE.Points(geometry, material);
  return strokeMesh;
}