"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LineMaterial = LineMaterial;
exports.ArcLineMaterial = ArcLineMaterial;
exports.MeshLineMaterial = MeshLineMaterial;

var THREE = _interopRequireWildcard(require("../../core/three"));

var _material = _interopRequireDefault(require("./material"));

var _shaderModule = require("../../util/shaderModule");

var _deepMix = _interopRequireDefault(require("@antv/util/lib/deep-mix"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function LineMaterial(options) {
  var _getModule = (0, _shaderModule.getModule)('line'),
      vs = _getModule.vs,
      fs = _getModule.fs;

  var material = new _material["default"]({
    uniforms: {
      u_opacity: {
        value: options.u_opacity || 1.0
      },
      u_time: {
        value: options.u_time || 0
      },
      u_zoom: {
        value: options.u_zoom || 10
      },
      u_activeId: {
        value: options.activeId || 0
      },
      u_activeColor: {
        value: options.activeColor || [1.0, 0, 0, 1.0]
      }
    },
    vertexShader: vs,
    fragmentShader: fs,
    transparent: true // blending: THREE.AdditiveBlending

  });
  return material;
}

function ArcLineMaterial(options) {
  var moduleName = 'arcline';

  if (options.shapeType === 'greatCircle') {
    moduleName = 'greatcircle';
  }

  var _getModule2 = (0, _shaderModule.getModule)(moduleName),
      vs = _getModule2.vs,
      fs = _getModule2.fs;

  var material = new _material["default"]({
    uniforms: {
      u_opacity: {
        value: options.u_opacity || 1.0
      },
      segmentNumber: {
        value: 29
      },
      u_time: {
        value: 0
      },
      u_zoom: {
        value: options.u_zoom || 10
      },
      u_activeId: {
        value: options.activeId || 0
      },
      u_activeColor: {
        value: options.activeColor || [1.0, 0, 0, 1.0]
      }
    },
    vertexShader: vs,
    fragmentShader: fs,
    transparent: true,
    blending: THREE.AdditiveBlending
  });
  return material;
}

function MeshLineMaterial(options, defines) {
  var _getModule3 = (0, _shaderModule.getModule)('meshline'),
      vs = _getModule3.vs,
      fs = _getModule3.fs,
      uniforms = _getModule3.uniforms;

  var material = new _material["default"]({
    uniforms: (0, _shaderModule.wrapUniforms)((0, _deepMix["default"])(uniforms, options, {
      u_activeId: options.activeId,
      u_activeColor: options.activeColor
    })),
    defines: defines,
    vertexShader: vs,
    fragmentShader: fs,
    transparent: true // blending: THREE.AdditiveBlending

  });
  return material;
}