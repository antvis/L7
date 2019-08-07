"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = PickingMaterial;

var _material = _interopRequireDefault(require("../../../geom/material/material"));

var _picking_frag = _interopRequireDefault(require("./picking_frag.glsl"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// import picking_vert from './picking_vert.glsl';
function PickingMaterial(options) {
  var material = new _material["default"]({
    uniforms: {
      u_zoom: {
        value: options.u_zoom || 1
      }
    },
    defines: {
      PICK: true
    },
    vertexShader: options.vs,
    fragmentShader: _picking_frag["default"],
    transparent: false
  });
  return material;
}