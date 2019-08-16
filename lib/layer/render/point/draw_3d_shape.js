"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = Draw3DShape;

var THREE = _interopRequireWildcard(require("../../../core/three"));

var _buffer = require("../../../geom/buffer/");

var _polygonMaterial = _interopRequireDefault(require("../../../geom/material/polygonMaterial"));

var _shaderModule = require("../../../util/shaderModule");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function Draw3DShape(layerData, layer) {
  var style = layer.get('styleOptions');
  var activeOption = layer.get('activedOptions');
  var geometryBuffer = (0, _buffer.getBuffer)('shape', 'extrude');
  var buffer = new geometryBuffer({
    layerData: layerData,
    shapeType: layer.shapeType
  });
  var attributes = buffer.attributes,
      indexArray = buffer.indexArray;
  var geometry = new THREE.BufferGeometry();
  geometry.setIndex(new THREE.Uint32BufferAttribute(indexArray, 1));
  geometry.addAttribute('position', new THREE.Float32BufferAttribute(attributes.positions, 3));
  geometry.addAttribute('a_color', new THREE.Float32BufferAttribute(attributes.colors, 4));
  geometry.addAttribute('pickingId', new THREE.Float32BufferAttribute(attributes.pickingIds, 1));
  geometry.addAttribute('normal', new THREE.Float32BufferAttribute(attributes.normals, 3));
  geometry.addAttribute('a_shape', new THREE.Float32BufferAttribute(attributes.miters, 3));
  geometry.addAttribute('a_size', new THREE.Float32BufferAttribute(attributes.sizes, 3));
  var material = new _polygonMaterial["default"](_objectSpread({
    u_opacity: style.opacity,
    u_activeColor: activeOption.fill,
    u_zoom: layer.scene.getZoom()
  }, (0, _shaderModule.generateLightingUniforms)(style.lights)), {
    SHAPE: true,
    LIGHTING: true
  });
  material.setDefinesvalue('SHAPE', true);
  material.setBending(style.blending);
  var fillMesh = new THREE.Mesh(geometry, material);
  return fillMesh;
}