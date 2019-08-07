"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var THREE = _interopRequireWildcard(require("../three"));

var _util = _interopRequireDefault(require("../../util"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var RenderPass =
/*#__PURE__*/
function () {
  function RenderPass(cfg) {
    _classCallCheck(this, RenderPass);

    var defaultCfg = this._getDefaultCfg();

    _util.default.assign(this, defaultCfg, cfg);

    this._init();
  }

  _createClass(RenderPass, [{
    key: "_getDefaultCfg",
    value: function _getDefaultCfg() {
      var defaultRenderCfg = {
        minFilter: THREE.NearestFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBAFormat,
        stencilBuffer: false,
        depthBuffer: false
      };
      return {
        size: null,
        renderCfg: defaultRenderCfg,
        clearColor: 0x000000,
        clearAlpha: 0.0,
        renderToScreen: false,
        renderTarget: true
      };
    }
  }, {
    key: "_init",
    value: function _init() {
      this.scene = new THREE.Scene();

      if (this.renderTarget) {
        var size = this.size ? this.size : this.renderer.getSize();
        this.renderTarget = new THREE.WebGLRenderTarget(size.width, size.height, this.renderCfg);
        this.texture = this.renderTarget.texture;
      }

      this.originClearColor = this.renderer.getClearColor();
      this.originClearAlpha = this.renderer.getClearAlpha();
    }
  }, {
    key: "setSize",
    value: function setSize(width, height) {
      this.size = {
        width: width,
        height: height
      };
      this.renderTarget && this.renderTarget.setSize(width, height);
    }
  }, {
    key: "add",
    value: function add(mesh) {
      this.scene.add(mesh);
    }
  }, {
    key: "remove",
    value: function remove(mesh) {
      this.scene.remove(mesh);
    }
  }, {
    key: "render",
    value: function render() {
      this.renderer.setClearColor(this.clearColor, this.clearAlpha);

      if (this.renderToScreen) {
        this.renderer.setRenderTarget(null);
        this.renderer.render(this.scene, this.camera);
      } else {
        this.renderTarget && this.renderer.render(this.scene, this.camera, this.renderTarget, true);
        this.renderer.setRenderTarget(null);
      }

      this.renderer.setClearColor(this.originClearColor, this.originClearAlpha);
    }
  }]);

  return RenderPass;
}();

exports.default = RenderPass;