"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = DrawText;

var THREE = _interopRequireWildcard(require("../../../core/three"));

var _textMaterial = _interopRequireDefault(require("../../../geom/material/textMaterial"));

var _text = _interopRequireDefault(require("../../../geom/buffer/point/text"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function DrawText(layerData, layer) {
  var style = layer.get('styleOptions');
  var activeOption = layer.get('activedOptions');

  var _layer$scene$getSize = layer.scene.getSize(),
      width = _layer$scene$getSize.width,
      height = _layer$scene$getSize.height;

  var attributes = new _text["default"](layerData, layer.scene.fontAtlasManager);
  var geometry = new THREE.BufferGeometry();
  geometry.addAttribute('position', new THREE.Float32BufferAttribute(attributes.originPoints, 3));
  geometry.addAttribute('uv', new THREE.Float32BufferAttribute(attributes.textureElements, 2));
  geometry.addAttribute('a_txtsize', new THREE.Float32BufferAttribute(attributes.textSizes, 2));
  geometry.addAttribute('a_txtOffsets', new THREE.Float32BufferAttribute(attributes.textOffsets, 2));
  geometry.addAttribute('a_color', new THREE.Float32BufferAttribute(attributes.colors, 4));
  geometry.addAttribute('pickingId', new THREE.Float32BufferAttribute(attributes.pickingIds, 1));
  var strokeWidth = style.strokeWidth,
      stroke = style.stroke,
      opacity = style.opacity;
  var material = new _textMaterial["default"]({
    name: layer.layerId,
    u_texture: attributes.texture,
    u_strokeWidth: strokeWidth,
    u_stroke: stroke,
    u_textTextureSize: [attributes.fontAtlas.width, attributes.fontAtlas.height],
    u_gamma: 1.0 / 12.0 * (1.4142135623730951 / 2.0),
    u_buffer: 0.75,
    u_opacity: opacity,
    u_glSize: [width, height],
    u_activeColor: activeOption.fill
  });
  var mesh = new THREE.Mesh(geometry, material);
  return mesh;
}