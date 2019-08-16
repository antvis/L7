"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var THREE = _interopRequireWildcard(require("../three"));

var _copyShader = _interopRequireDefault(require("./copy-shader"));

var _shaderPass = _interopRequireDefault(require("./shader-pass"));

var _maskPass = _interopRequireWildcard(require("./mask-pass"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

// jscs:disable

/* eslint-disable */

/**
 * @author alteredq / http://alteredqualia.com/
 */
var EffectComposer = function EffectComposer(renderer, renderTarget) {
  this.renderer = renderer;

  if (renderTarget === undefined) {
    var pixelRatio = renderer.getPixelRatio();
    var width = Math.floor(renderer.context.canvas.width / pixelRatio) || 1;
    var height = Math.floor(renderer.context.canvas.height / pixelRatio) || 1;
    var parameters = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      stencilBuffer: false
    };
    renderTarget = new THREE.WebGLRenderTarget(width, height, parameters);
  }

  this.renderTarget1 = renderTarget;
  this.renderTarget2 = renderTarget.clone();
  this.writeBuffer = this.renderTarget1;
  this.readBuffer = this.renderTarget2;
  this.passes = [];
  if (_copyShader["default"] === undefined) console.error("EffectComposer relies on THREE.CopyShader");
  this.copyPass = new _shaderPass["default"](_copyShader["default"]);
};

EffectComposer.prototype = {
  swapBuffers: function swapBuffers() {
    var tmp = this.readBuffer;
    this.readBuffer = this.writeBuffer;
    this.writeBuffer = tmp;
  },
  visible: true,
  type: 'composer',
  addPass: function addPass(pass) {
    this.passes.push(pass);
  },
  insertPass: function insertPass(pass, index) {
    this.passes.splice(index, 0, pass);
  },
  render: function render(delta) {
    this.writeBuffer = this.renderTarget1;
    this.readBuffer = this.renderTarget2;
    var maskActive = false;
    var pass,
        i,
        il = this.passes.length;

    for (i = 0; i < il; i++) {
      pass = this.passes[i];
      if (!pass.enabled) continue;
      pass.render(this.renderer, this.writeBuffer, this.readBuffer, delta, maskActive);

      if (pass.needsSwap) {
        if (maskActive) {
          var context = this.renderer.context;
          context.stencilFunc(context.NOTEQUAL, 1, 0xffffffff);
          this.copyPass.render(this.renderer, this.writeBuffer, this.readBuffer, delta);
          context.stencilFunc(context.EQUAL, 1, 0xffffffff);
        }

        this.swapBuffers();
      }

      if (pass instanceof _maskPass["default"]) {
        maskActive = true;
      } else if (pass instanceof _maskPass.ClearMaskPass) {
        maskActive = false;
      }
    }
  },
  reset: function reset(renderTarget) {
    if (renderTarget === undefined) {
      renderTarget = this.renderTarget1.clone();
      var pixelRatio = this.renderer.getPixelRatio();
      renderTarget.setSize(Math.floor(this.renderer.context.canvas.width / pixelRatio), Math.floor(this.renderer.context.canvas.height / pixelRatio));
    }

    this.renderTarget1.dispose();
    this.renderTarget1 = renderTarget;
    this.renderTarget2.dispose();
    this.renderTarget2 = renderTarget.clone();
    this.writeBuffer = this.renderTarget1;
    this.readBuffer = this.renderTarget2;
  },
  setSize: function setSize(width, height) {
    this.renderTarget1.setSize(width, height);
    this.renderTarget2.setSize(width, height);
  }
};
var _default = EffectComposer;
exports["default"] = _default;