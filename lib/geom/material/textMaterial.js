"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = TextMaterial;

var _material = _interopRequireDefault(require("./material"));

var _shaderModule = require("../../util/shaderModule");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function TextMaterial(options) {
  var _getModule = (0, _shaderModule.getModule)('text'),
      vs = _getModule.vs,
      fs = _getModule.fs;

  var material = new _material["default"]({
    uniforms: {
      u_opacity: {
        value: options.u_opacity || 1.0
      },
      u_texture: {
        value: options.u_texture
      },
      u_strokeWidth: {
        value: options.u_strokeWidth
      },
      u_stroke: {
        value: options.u_stroke
      },
      u_textTextureSize: {
        value: options.u_textTextureSize
      },
      u_scale: {
        value: options.u_scale
      },
      u_gamma: {
        value: options.u_gamma
      },
      u_buffer: {
        value: options.u_buffer
      },
      u_glSize: {
        value: options.u_glSize
      },
      u_activeId: {
        value: options.u_activeId || 0
      },
      u_activeColor: {
        value: options.u_activeColor
      }
    },
    vertexShader: vs,
    fragmentShader: fs,
    transparent: true
  });
  return material;
}