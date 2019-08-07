"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _base = _interopRequireDefault(require("../core/base"));

var _global = _interopRequireDefault(require("../global"));

var Theme = _interopRequireWildcard(require("../theme/index"));

var _util = _interopRequireDefault(require("../util"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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

var GaodeMap =
/*#__PURE__*/
function (_Base) {
  _inherits(GaodeMap, _Base);

  _createClass(GaodeMap, [{
    key: "getDefaultCfg",
    value: function getDefaultCfg() {
      return _util["default"].assign(_global["default"].scene, {
        resizeEnable: true,
        viewMode: '3D'
      });
    }
  }], [{
    key: "project",
    value: function project(lnglat) {
      var maxs = 85.0511287798;
      var lat = Math.max(Math.min(maxs, lnglat[1]), -maxs);
      var scale = 256 << 20;
      var d = Math.PI / 180;
      var x = lnglat[0] * d;
      var y = lat * d;
      y = Math.log(Math.tan(Math.PI / 4 + y / 2));
      var a = 0.5 / Math.PI,
          b = 0.5,
          c = -0.5 / Math.PI;
      d = 0.5;
      x = scale * (a * x + b) - 215440491;
      y = -(scale * (c * y + d) - 106744817);
      return {
        x: x,
        y: y
      };
    }
  }]);

  function GaodeMap(cfg) {
    var _this;

    _classCallCheck(this, GaodeMap);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(GaodeMap).call(this, cfg));
    _this.container = document.getElementById(_this.get('id'));

    _this.initMap();

    _this.addOverLayer();

    setTimeout(function () {
      _this.emit('mapLoad');
    }, 100);
    return _this;
  }

  _createClass(GaodeMap, [{
    key: "initMap",
    value: function initMap() {
      var mapStyle = this.get('mapStyle');

      if (mapStyle) {
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
      }

      this.set('zooms', [this.get('minZoom'), this.get('maxZoom')]);
      var map = this.get('map');

      if (map instanceof AMap.Map) {
        this.map = map;
        this.container = map.getContainer();
        this.get('mapStyle') && this.map.setMapStyle(this.get('mapStyle'));
      } else {
        this.map = new AMap.Map(this.container, this._attrs);
      }
    }
  }, {
    key: "asyncCamera",
    value: function asyncCamera(engine) {
      var _this2 = this;

      this._engine = engine;
      var camera = engine._camera;
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
        camera.position.x += e.camera.position.x;
        camera.position.y += -e.camera.position.y;

        _this2._engine.update();
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
      var canvasContainer = this.container instanceof HTMLElement ? this.container : document.getElementById(this.container);
      this.canvasContainer = canvasContainer;
      this.renderDom = document.createElement('div');
      this.renderDom.style.cssText += 'position: absolute;top: 0; z-index:1;height: 100%;width: 100%;pointer-events: none;';
      this.renderDom.id = 'l7_canvaslayer';
      canvasContainer.appendChild(this.renderDom);
    }
  }, {
    key: "mixMap",
    value: function mixMap(scene) {
      var map = this.map;
      scene.project = GaodeMap.project;

      scene.getZoom = function () {
        return map.getZoom();
      };

      scene.getCenter = function () {
        return map.getCenter();
      };

      scene.getSize = function () {
        return map.getSize();
      };

      scene.getPitch = function () {
        return map.getPitch();
      };

      scene.getRotation = function () {
        return map.getRotation();
      };

      scene.getStatus = function () {
        return map.getStatus();
      };

      scene.getScale = function () {
        return map.getScale();
      };

      scene.getZoom = function () {
        return map.getZoom();
      };

      scene.setZoom = function (zoom) {
        return map.setZoom(zoom);
      };

      scene.getBounds = function () {
        return map.getBounds();
      };

      scene.setZoomAndCenter = function (zoom, center) {
        var lnglat = new AMap.LngLat(center[0], center[1]);
        return map.setZoomAndCenter(zoom, lnglat);
      };

      scene.setBounds = function (extent) {
        return map.setBounds(new AMap.Bounds([extent[0], extent[1]], [extent[2], extent[3]]));
      };

      scene.setRotation = function (rotation) {
        return map.setRotation(rotation);
      };

      scene.setStatus = function (status) {
        return map.setStatus(status);
      };

      scene.zoomIn = function () {
        return map.zoomIn();
      };

      scene.zoomOut = function () {
        return map.zoomOut();
      };

      scene.panTo = function (lnglat) {
        return map.panTo(new AMap.LngLat(lnglat[0], lnglat[1]));
      };

      scene.panBy = function (x, y) {
        return map.panBy(x, y);
      };

      scene.setPitch = function (pitch) {
        return map.setPitch(pitch);
      };

      scene.pixelToLngLat = function (pixel) {
        var ll = new AMap.Pixel(pixel[0], pixel[1]);
        return map.pixelToLngLat(ll);
      };

      scene.lngLatToPixel = function (lnglat) {
        return map.lngLatToPixel(new AMap.LngLat(lnglat[0], lnglat[1]));
      };

      scene.setMapStyle = function (style) {
        return map.setMapStyle(style);
      };

      scene.fitBounds = function (extent) {
        return map.setBounds(new AMap.Bounds([extent[0], extent[1]], [extent[2], extent[3]]));
      };

      scene.containerToLngLat = function (pixel) {
        var ll = new AMap.Pixel(pixel.x, pixel.y);
        return map.containerToLngLat(ll);
      };
    }
  }]);

  return GaodeMap;
}(_base["default"]);

exports["default"] = GaodeMap;