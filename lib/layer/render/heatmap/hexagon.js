"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = DrawHexagon;

var THREE = _interopRequireWildcard(require("../../../core/three"));

var _hexagon = _interopRequireDefault(require("../../../geom/material/hexagon"));

var _buffer = require("../../../geom/buffer/");

var _shaderModule = require("../../../util/shaderModule");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function DrawHexagon(layerData, layer, source) {
  var style = layer.get('styleOptions');

  var _layer$get = layer.get('activedOptions'),
      fill = _layer$get.fill;

  var radius = source.data.radius;
  var opacity = style.opacity,
      _style$angle = style.angle,
      angle = _style$angle === void 0 ? 0 : _style$angle,
      coverage = style.coverage,
      lights = style.lights;
  var geometryBuffer = (0, _buffer.getBuffer)(layer.type, 'shape');
  var buffer = new geometryBuffer({
    layerData: layerData,
    shapeType: layer.shapeType
  });
  var attributes = buffer.attributes,
      instanceGeometry = buffer.instanceGeometry;
  var instancedGeometry = new THREE.InstancedBufferGeometry();
  instancedGeometry.setIndex(instanceGeometry.indexArray);
  instancedGeometry.addAttribute('miter', new THREE.Float32BufferAttribute(instanceGeometry.positions, 3));

  if (instanceGeometry.normals) {
    instancedGeometry.addAttribute('normal', new THREE.Float32BufferAttribute(instanceGeometry.normals, 3));
  }

  instancedGeometry.addAttribute('position', new THREE.InstancedBufferAttribute(new Float32Array(attributes.positions), 3));
  instancedGeometry.addAttribute('a_color', new THREE.InstancedBufferAttribute(new Float32Array(attributes.colors), 4));
  instancedGeometry.addAttribute('pickingId', new THREE.InstancedBufferAttribute(new Float32Array(attributes.pickingIds), 1));
  instancedGeometry.addAttribute('a_size', new THREE.InstancedBufferAttribute(new Float32Array(attributes.sizes), 1));
  var material = new _hexagon["default"](_objectSpread({
    u_opacity: opacity,
    u_radius: radius,
    u_angle: angle / 180 * Math.PI,
    u_coverage: coverage,
    u_activeColor: fill
  }, (0, _shaderModule.generateLightingUniforms)(lights)), {
    SHAPE: false,
    LIGHTING: !!instanceGeometry.normals
  });
  var hexgonMesh = new THREE.Mesh(instancedGeometry, material);
  return hexgonMesh;
}