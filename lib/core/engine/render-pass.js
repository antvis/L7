"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var THREE = _interopRequireWildcard(require("../three"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

// jscs:disable

/* eslint-disable */

/**
 * @author alteredq / http://alteredqualia.com/
 */
var RenderPass = function RenderPass(scene, camera, overrideMaterial, clearColor, clearAlpha) {
  this.scene = scene;
  this.camera = camera;
  this.overrideMaterial = overrideMaterial;
  this.clearColor = clearColor;
  this.clearAlpha = clearAlpha !== undefined ? clearAlpha : 1;
  this.oldClearColor = new THREE.Color();
  this.oldClearAlpha = 1;
  this.enabled = true;
  this.clear = false;
  this.needsSwap = false;
};

RenderPass.prototype = {
  render: function render(renderer, writeBuffer, readBuffer, delta) {
    this.scene.overrideMaterial = this.overrideMaterial;

    if (this.clearColor) {
      this.oldClearColor.copy(renderer.getClearColor());
      this.oldClearAlpha = renderer.getClearAlpha();
      renderer.setClearColor(this.clearColor, this.clearAlpha);
    }

    renderer.render(this.scene, this.camera, readBuffer, this.clear);

    if (this.clearColor) {
      renderer.setClearColor(this.oldClearColor, this.oldClearAlpha);
    }

    this.scene.overrideMaterial = null;
  }
};
var _default = RenderPass;
exports["default"] = _default;