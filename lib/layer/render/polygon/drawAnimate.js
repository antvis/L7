"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = DrawAnimate;

var THREE = _interopRequireWildcard(require("../../../core/three"));

var _polygonMaterial = _interopRequireDefault(require("../../../geom/material/polygonMaterial"));

var _buffer2 = require("../../../geom/buffer/");

var _shaderModule = require("../../../util/shaderModule");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function DrawAnimate(layerData, layer, buffer) {
  var style = layer.get('styleOptions');

  var _layer$map$getCameraS = layer.map.getCameraState(),
      near = _layer$map$getCameraS.near,
      far = _layer$map$getCameraS.far;

  layer.scene.startAnimate();

  if (!buffer) {
    var geometryBuffer = (0, _buffer2.getBuffer)(layer.type, 'extrude');
    buffer = new geometryBuffer({
      layerData: layerData,
      uv: true
    });
  }

  var _buffer = buffer,
      attributes = _buffer.attributes,
      indexArray = _buffer.indexArray;
  var opacity = style.opacity,
      baseColor = style.baseColor,
      brightColor = style.brightColor,
      windowColor = style.windowColor,
      lights = style.lights;
  var geometry = new THREE.BufferGeometry();

  if (indexArray) {
    geometry.setIndex(new THREE.Uint32BufferAttribute(indexArray, 1));
  }

  geometry.addAttribute('position', new THREE.Float32BufferAttribute(attributes.positions, 3));
  geometry.addAttribute('a_color', new THREE.Float32BufferAttribute(attributes.colors, 4));
  geometry.addAttribute('pickingId', new THREE.Float32BufferAttribute(attributes.pickingIds, 1));
  geometry.addAttribute('faceUv', new THREE.Float32BufferAttribute(attributes.uv, 2)); // geometry.addAttribute('a_size', new THREE.Float32BufferAttribute(attributes.sizes, 1));

  geometry.computeVertexNormals();
  var material = new _polygonMaterial["default"](_objectSpread({
    u_opacity: opacity,
    u_baseColor: baseColor,
    u_brightColor: brightColor,
    u_windowColor: windowColor,
    u_near: near,
    u_far: far
  }, (0, _shaderModule.generateLightingUniforms)(lights)), {
    SHAPE: false,
    LIGHTING: true,
    ANIMATE: true
  });
  var fillPolygonMesh = new THREE.Mesh(geometry, material);
  return fillPolygonMesh;
}

DrawAnimate.prototype.updateStyle = function (style) {
  this.fillPolygonMesh.material.updateUninform({
    u_opacity: style.opacity,
    u_baseColor: style.baseColor,
    u_brightColor: style.brightColor,
    u_windowColor: style.windowColor
  });
};