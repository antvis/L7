"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ClearMaskPass = exports["default"] = void 0;

var THREE = _interopRequireWildcard(require("../three"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

// jscs:disable

/* eslint-disable */

/**
 * @author alteredq / http://alteredqualia.com/
 */
var MaskPass = function MaskPass(scene, camera) {
  this.scene = scene;
  this.camera = camera;
  this.enabled = true;
  this.clear = true;
  this.needsSwap = false;
  this.inverse = false;
};

MaskPass.prototype = {
  render: function render(renderer, writeBuffer, readBuffer, delta) {
    var context = renderer.context; // don't update color or depth

    context.colorMask(false, false, false, false);
    context.depthMask(false); // set up stencil

    var writeValue, clearValue;

    if (this.inverse) {
      writeValue = 0;
      clearValue = 1;
    } else {
      writeValue = 1;
      clearValue = 0;
    }

    context.enable(context.STENCIL_TEST);
    context.stencilOp(context.REPLACE, context.REPLACE, context.REPLACE);
    context.stencilFunc(context.ALWAYS, writeValue, 0xffffffff);
    context.clearStencil(clearValue); // draw into the stencil buffer

    renderer.render(this.scene, this.camera, readBuffer, this.clear);
    renderer.render(this.scene, this.camera, writeBuffer, this.clear); // re-enable update of color and depth

    context.colorMask(true, true, true, true);
    context.depthMask(true); // only render where stencil is set to 1

    context.stencilFunc(context.EQUAL, 1, 0xffffffff); // draw if == 1

    context.stencilOp(context.KEEP, context.KEEP, context.KEEP);
  }
};

var ClearMaskPass = function ClearMaskPass() {
  this.enabled = true;
};

exports.ClearMaskPass = ClearMaskPass;
ClearMaskPass.prototype = {
  render: function render(renderer, writeBuffer, readBuffer, delta) {
    var context = renderer.context;
    context.disable(context.STENCIL_TEST);
  }
};
var _default = MaskPass;
exports["default"] = _default;