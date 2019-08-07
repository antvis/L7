"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = ImageMaterial;

var _material = _interopRequireDefault(require("./material"));

var _shaderModule = require("../../util/shaderModule");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ImageMaterial(options) {
  var _getModule = (0, _shaderModule.getModule)('raster'),
      vs = _getModule.vs,
      fs = _getModule.fs;

  var material = new _material["default"]({
    uniforms: {
      u_opacity: {
        value: options.u_opacity
      },
      u_texture: {
        value: options.u_texture
      },
      u_colorTexture: {
        value: options.u_colorTexture
      },
      u_min: {
        value: options.u_min
      },
      u_max: {
        value: options.u_max
      },
      u_extent: {
        value: options.u_extent
      },
      u_dimension: {
        value: options.u_dimension
      }
    },
    vertexShader: vs,
    fragmentShader: fs,
    transparent: false
  }); // material.roughness = 1;
  // material.metalness = 0.1;
  // material.envMapIntensity = 3;

  return material;
}