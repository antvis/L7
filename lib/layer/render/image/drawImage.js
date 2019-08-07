"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = DrawImage;

var THREE = _interopRequireWildcard(require("../../../core/three"));

var _imageMaterial = _interopRequireDefault(require("../../../geom/material/imageMaterial"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function DrawImage(attributes, style) {
  var geometry = new THREE.BufferGeometry();
  geometry.addAttribute('position', new THREE.Float32BufferAttribute(attributes.vertices, 3));
  geometry.addAttribute('uv', new THREE.Float32BufferAttribute(attributes.uvs, 2));
  var opacity = style.opacity;
  var material = new _imageMaterial["default"]({
    u_texture: attributes.texture,
    u_opacity: opacity
  });
  return new THREE.Mesh(geometry, material);
}