"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MapProvider = void 0;

var _base = _interopRequireDefault(require("../core/base"));

var Theme = _interopRequireWildcard(require("../theme/index"));

var _util = _interopRequireDefault(require("../util"));

var _global = require("../global");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var DEG2RAD = Math.PI / 180;

var MapProvider =
/*#__PURE__*/
function (_Base) {
  _inherits(MapProvider, _Base);

  _createClass(MapProvider, [{
    key: "getDefaultCfg",
    value: function getDefaultCfg() {
      return _util.default.assign(_global.scene, {
        resizeEnable: true,
        viewMode: '3D'
      });
    }
  }]);

  function MapProvider(container, cfg) {
    var _this;

    _classCallCheck(this, MapProvider);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(MapProvider).call(this, cfg));
    _this.container = container;

    _this.initMap();

    _this.addOverLayer();

    setTimeout(function () {
      _this.emit('mapLoad');
    }, 100);
    return _this;
  }

  _createClass(MapProvider, [{
    key: "initMap",
    value: function initMap() {
      var mapStyle = this.get('mapStyle');

      switch (mapStyle) {
        case 'dark':
          this.set('mapStyle', Theme.DarkTheme.mapStyle);
          break;

        case 'light':
          this.set('mapStyle', Theme.LightTheme.mapStyle);
          break;

        default:
          this.set('mapStyle', mapStyle);
      }

      this.set('zooms', [this.get('minZoom'), this.get('maxZoom')]);
      this.map = new AMap.Map(this.container, this._attrs);
    }
  }, {
    key: "asyncCamera",
    value: function asyncCamera(engine) {
      this._engine = engine;
      var camera = engine._camera;
      var scene = engine._scene;
      var pickScene = engine._picking._pickingScene;
      this.map.on('camerachange', function (e) {
        var mapCamera = e.camera;
        var fov = mapCamera.fov,
            near = mapCamera.near,
            far = mapCamera.far,
            height = mapCamera.height,
            pitch = mapCamera.pitch,
            rotation = mapCamera.rotation,
            aspect = mapCamera.aspect;
        pitch *= DEG2RAD;
        rotation *= DEG2RAD;
        camera.fov = 180 * fov / Math.PI;
        camera.aspect = aspect;
        camera.near = near;
        camera.far = far;
        camera.updateProjectionMatrix();
        camera.position.z = height * Math.cos(pitch);
        camera.position.x = height * Math.sin(pitch) * Math.sin(rotation);
        camera.position.y = -height * Math.sin(pitch) * Math.cos(rotation);
        camera.up.x = -Math.cos(pitch) * Math.sin(rotation);
        camera.up.y = Math.cos(pitch) * Math.cos(rotation);
        camera.up.z = Math.sin(pitch);
        camera.lookAt(0, 0, 0);
        scene.position.x = -e.camera.position.x;
        scene.position.y = e.camera.position.y;
        pickScene.position.x = -e.camera.position.x;
        pickScene.position.y = e.camera.position.y;
      });
    }
  }, {
    key: "projectFlat",
    value: function projectFlat(lnglat) {
      return this.map.lngLatToGeodeticCoord(lnglat);
    }
  }, {
    key: "getCenter",
    value: function getCenter() {
      return this.map.getCenter();
    }
  }, {
    key: "getCenterFlat",
    value: function getCenterFlat() {
      return this.projectFlat(this.getCenter());
    }
  }, {
    key: "addOverLayer",
    value: function addOverLayer() {
      var canvasContainer = document.getElementById(this.container);
      this.canvasContainer = canvasContainer;
      this.renderDom = document.createElement('div');
      this.renderDom.style.cssText += 'position: absolute;top: 0; z-index:1;height: 100%;width: 100%;pointer-events: none;';
      this.renderDom.id = 'l7_canvaslayer';
      canvasContainer.appendChild(this.renderDom);
    }
  }]);

  return MapProvider;
}(_base.default);

exports.MapProvider = MapProvider;