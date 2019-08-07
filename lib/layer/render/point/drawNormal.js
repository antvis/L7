"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = DrawNormal;

var THREE = _interopRequireWildcard(require("../../../core/three"));

var PointBuffer = _interopRequireWildcard(require("../../../geom/buffer/point/index"));

var _normal_point = _interopRequireDefault(require("../../../geom/material/normal_point"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

/**
 * 原生点绘制
 */
function DrawNormal(layerData, layer) {
  var geometry = new THREE.BufferGeometry();
  var style = layer.get('styleOptions');
  var activeOption = layer.get('activedOptions');
  var opacity = style.opacity;
  var attributes = PointBuffer.NormalBuffer(layerData, style);
  geometry.addAttribute('position', new THREE.Float32BufferAttribute(attributes.vertices, 3));
  geometry.addAttribute('a_color', new THREE.Float32BufferAttribute(attributes.colors, 4));
  geometry.addAttribute('pickingId', new THREE.Float32BufferAttribute(attributes.pickingIds, 1));
  geometry.addAttribute('a_size', new THREE.Float32BufferAttribute(attributes.sizes, 1));
  var material = new _normal_point["default"]({
    u_opacity: opacity,
    u_activeColor: activeOption.fill
  }, {}, style);
  var strokeMesh = new THREE.Points(geometry, material);
  return strokeMesh;
}