"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = DrawStroke;

var _pointLineMaterial = _interopRequireDefault(require("../../../geom/material/pointLineMaterial"));

var PointBuffer = _interopRequireWildcard(require("../../../geom/buffer/point/index"));

var THREE = _interopRequireWildcard(require("../../../core/three"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * @author lzxue
 * @email lzx199065@gmail.com
 * @create date 2018-11-29 16:35:34
 * @modify date 2018-11-29 16:35:34
 * @desc [description] 绘制图形的边框
*/
function DrawStroke(layerData, layer) {
  var style = layer.get('styleOptions');
  var activeOption = layer.get('activedOptions');
  var strokeWidth = style.strokeWidth,
      stroke = style.stroke,
      strokeOpacity = style.strokeOpacity;
  var attributes = PointBuffer.StrokeBuffer(layerData, style);
  var geometry = new THREE.BufferGeometry();
  geometry.setIndex(attributes.indexArray);
  geometry.addAttribute('position', new THREE.Float32BufferAttribute(attributes.positions, 3));
  geometry.addAttribute('a_shape', new THREE.Float32BufferAttribute(attributes.shapes, 3));
  geometry.addAttribute('a_size', new THREE.Float32BufferAttribute(attributes.sizes, 3));
  geometry.addAttribute('normal', new THREE.Float32BufferAttribute(attributes.normal, 3));
  geometry.addAttribute('a_miter', new THREE.Float32BufferAttribute(attributes.miter, 1));
  geometry.addAttribute('pickingId', new THREE.Float32BufferAttribute(attributes.pickingIds, 1));
  geometry.addAttribute('a_color', new THREE.Float32BufferAttribute(attributes.colors, 4));
  var material = new _pointLineMaterial["default"]({
    u_strokeOpacity: strokeOpacity,
    u_stroke: stroke,
    u_strokeWidth: strokeWidth,
    u_activeColor: activeOption.fill
  });
  var strokeMesh = new THREE.Mesh(geometry, material);
  return strokeMesh;
}