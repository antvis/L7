"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = ImageMaterial;

var _shaderModule = require("../../util/shaderModule");

var _material = _interopRequireDefault(require("./material"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ImageMaterial(options) {
  var _getModule = (0, _shaderModule.getModule)('image'),
      vs = _getModule.vs,
      fs = _getModule.fs;

  var material = new _material["default"]({
    uniforms: {
      u_opacity: {
        value: options.u_opacity
      },
      u_texture: {
        value: options.u_texture
      }
    },
    vertexShader: vs,
    fragmentShader: fs,
    transparent: true,
    depthTest: false
  });
  return material;
}