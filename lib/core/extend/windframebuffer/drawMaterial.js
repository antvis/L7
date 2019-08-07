"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = DrawMaterial;

var _material = _interopRequireDefault(require("../../../geom/material/material"));

var _draw_vert = _interopRequireDefault(require("./draw_vert.glsl"));

var _draw_frag = _interopRequireDefault(require("./draw_frag.glsl"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function DrawMaterial(options) {
  var material = new _material.default({
    uniforms: {
      u_color_ramp: {
        value: options.u_color_ramp
      },
      u_wind_max: {
        value: options.u_wind_max
      },
      u_particles_res: {
        value: options.u_particles_res
      },
      u_wind_min: {
        value: options.u_wind_min
      },
      u_opacity: {
        value: options.u_opacity
      },
      u_wind: {
        value: options.u_wind
      },
      u_particles: {
        value: options.u_particles
      },
      u_bbox: {
        value: options.u_bbox
      }
    },
    vertexShader: _draw_vert.default,
    fragmentShader: _draw_frag.default,
    transparent: true
  }); // material.blending = THREE.AdditiveBlending

  return material;
}