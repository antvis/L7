"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = drawCircle;

var THREE = _interopRequireWildcard(require("../../../core/three"));

var _circleMaterial = _interopRequireDefault(require("../../../geom/material/circleMaterial"));

var _buffer2 = require("../../../geom/buffer/");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

/**
 * 绘制 SDF，不仅是圆形
 * 手动构建点阵坐标系，便于实现描边、反走样效果
 */
function drawCircle(layerData, layer, buffer) {
  var style = layer.get('styleOptions');
  var activeOption = layer.get('activedOptions');

  if (!buffer) {
    var geometryBuffer = (0, _buffer2.getBuffer)(layer.type, layer.shapeType);
    buffer = new geometryBuffer({
      layerData: layerData
    });
  } // const { aPosition, aPackedData } = buffer.attributes;


  var _buffer = buffer,
      attributes = _buffer.attributes,
      indexArray = _buffer.indexArray;
  var geometry = new THREE.BufferGeometry();

  if (buffer.indexArray) {
    geometry.setIndex(new THREE.Uint32BufferAttribute(indexArray, 1));
  } // geometry.addAttribute('position', new THREE.Float32BufferAttribute(aPosition, 3));


  geometry.addAttribute('position', new THREE.Float32BufferAttribute(attributes.positions, 3));
  geometry.addAttribute('a_color', new THREE.Float32BufferAttribute(attributes.colors, 4));
  geometry.addAttribute('pickingId', new THREE.Float32BufferAttribute(attributes.pickingIds, 1));
  geometry.addAttribute('miter', new THREE.Float32BufferAttribute(attributes.miters, 2));
  geometry.addAttribute('a_size', new THREE.Float32BufferAttribute(attributes.sizes, 1));
  geometry.addAttribute('a_shape', new THREE.Float32BufferAttribute(attributes.shapes, 1)); // geometry.addAttribute('a_packed_data', new THREE.Float32BufferAttribute(aPackedData, 4));

  var material = new _circleMaterial["default"]({
    u_opacity: style.opacity,
    u_activeColor: activeOption.fill,
    u_zoom: layer.scene.getZoom(),
    u_stroke_color: style.stroke,
    u_stroke_width: style.strokeWidth,
    u_stroke_opacity: style.strokeOpacity
  });
  material.depthTest = false;
  material.setBending(style.blending);
  var fillMesh = new THREE.Mesh(geometry, material);
  return fillMesh;
}