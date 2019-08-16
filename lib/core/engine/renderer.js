"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var THREE = _interopRequireWildcard(require("../three"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Renderer =
/*#__PURE__*/
function () {
  function Renderer(container) {
    _classCallCheck(this, Renderer);

    this.container = container;
    this.initRender();
    this.updateSize();
    window.addEventListener('resize', this.updateSize.bind(this), false);
  }

  _createClass(Renderer, [{
    key: "initRender",
    value: function initRender() {
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        autoClear: false
      });
      this.renderer.setClearColor(0xff0000, 0.0);
      this.pixelRatio = window.devicePixelRatio;
      this.renderer.setPixelRatio(this.pixelRatio);
      this.renderer.gammaInput = true;
      this.renderer.gammaOutput = true;
      this.renderer.shadowMap.enabled = false;
      this.container.appendChild(this.renderer.domElement);
    }
  }, {
    key: "updateSize",
    value: function updateSize() {
      this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }
  }]);

  return Renderer;
}();

exports["default"] = Renderer;