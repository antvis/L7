"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _wolfy87Eventemitter = _interopRequireDefault(require("wolfy87-eventemitter"));

var THREE = _interopRequireWildcard(require("../three"));

var _scene = _interopRequireDefault(require("./scene"));

var _camera = _interopRequireDefault(require("./camera"));

var _renderer = _interopRequireDefault(require("./renderer"));

var _picking = _interopRequireDefault(require("./picking/picking"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Engine =
/*#__PURE__*/
function (_EventEmitter) {
  _inherits(Engine, _EventEmitter);

  function Engine(container, world) {
    var _this;

    _classCallCheck(this, Engine);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Engine).call(this));
    _this._scene = _scene["default"];
    _this._camera = new _camera["default"](container).camera;
    _this._renderer = new _renderer["default"](container).renderer;
    _this._world = world; // 地图场景实例
    // for MapBox

    _this.world = new THREE.Group();

    _this._scene.add(_this.world);

    _this._picking = (0, _picking["default"])(_this._world, _this._renderer, _this._camera);
    _this.clock = new THREE.Clock();
    _this.composerLayers = [];
    return _this;
  }

  _createClass(Engine, [{
    key: "_initPostProcessing",
    value: function _initPostProcessing() {
      this.composerLayers.forEach(function (layer) {
        layer.visible && layer.render();
      });
    }
  }, {
    key: "update",
    value: function update() {
      this._renderer.clear();

      this._renderer.render(this._scene, this._camera);

      this._initPostProcessing();
    }
  }, {
    key: "destroy",
    value: function destroy() {} // 渲染第三方Scene对象

  }, {
    key: "renderScene",
    value: function renderScene(scene) {
      this._renderer.render(scene, this._camera);
    }
  }, {
    key: "run",
    value: function run() {
      this.update();
      this.engineID = requestAnimationFrame(this.run.bind(this));
    }
  }, {
    key: "stop",
    value: function stop() {
      cancelAnimationFrame(this.engineID);
    }
  }]);

  return Engine;
}(_wolfy87Eventemitter["default"]);

exports["default"] = Engine;