"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _base = _interopRequireDefault(require("../core/base"));

var _util = _interopRequireDefault(require("../util"));

var _global = _interopRequireDefault(require("../global"));

var THREE = _interopRequireWildcard(require("../core/three"));

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

var WORLD_SIZE = 512;
var MERCATOR_A = 6378137.0;
var WORLD_SCALE = 1 / 100;
var PROJECTION_WORLD_SIZE = WORLD_SIZE / (MERCATOR_A * Math.PI) / 2;

var MapBox =
/*#__PURE__*/
function (_Base) {
  _inherits(MapBox, _Base);

  _createClass(MapBox, [{
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
      var d = Math.PI / 180;
      var x = -MERCATOR_A * lnglat[0] * d * PROJECTION_WORLD_SIZE;
      var y = -MERCATOR_A * Math.log(Math.tan(Math.PI * 0.25 + 0.5 * lnglat[1] * d)) * PROJECTION_WORLD_SIZE;
      return {
        x: x,
        y: y
      };
    }
  }]);

  function MapBox(cfg) {
    var _this;

    _classCallCheck(this, MapBox);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(MapBox).call(this, cfg));
    _this.container = _this.get('container');

    _this.initMap();

    _this.addOverLayer();

    setTimeout(function () {
      _this.emit('mapLoad');
    }, 100);
    return _this;
  }

  _createClass(MapBox, [{
    key: "initMap",
    value: function initMap() {
      mapboxgl.accessToken = 'pk.eyJ1IjoibHp4dWUiLCJhIjoiYnhfTURyRSJ9.Ugm314vAKPHBzcPmY1p4KQ';
      this.map = new mapboxgl.Map(this._attrs);
    }
  }, {
    key: "asyncCamera",
    value: function asyncCamera(engine) {
      var _this2 = this;

      this.engine = engine;
      var camera = engine._camera;
      var scene = engine.world;
      var pickScene = engine._picking.world;
      camera.matrixAutoUpdate = false;
      scene.position.x = scene.position.y = WORLD_SIZE / 2;
      scene.matrixAutoUpdate = false;
      pickScene.position.x = pickScene.position.y = WORLD_SIZE / 2;
      pickScene.matrixAutoUpdate = false;
      this.updateCamera();
      this.map.on('move', function () {
        _this2.updateCamera();
      });
    }
  }, {
    key: "updateCamera",
    value: function updateCamera() {
      var engine = this.engine;
      var scene = engine.world;
      var pickScene = engine._picking.world;
      var camera = engine._camera; // Build a projection matrix, paralleling the code found in Mapbox GL JS

      var fov = 0.6435011087932844;
      var cameraToCenterDistance = 0.5 / Math.tan(fov / 2) * this.map.transform.height * WORLD_SCALE;
      var halfFov = fov / 2;
      var groundAngle = Math.PI / 2 + this.map.transform._pitch;
      var topHalfSurfaceDistance = Math.sin(halfFov) * cameraToCenterDistance / Math.sin(Math.PI - groundAngle - halfFov); // Calculate z distance of the farthest fragment that should be rendered.

      var furthestDistance = Math.cos(Math.PI / 2 - this.map.transform._pitch) * topHalfSurfaceDistance + cameraToCenterDistance; // Add a bit extra to avoid precision problems when a fragment's distance is exactly `furthestDistance`

      var farZ = furthestDistance * 1.1;

      if (this.pitch > 50) {
        farZ = 1000;
      }

      var _this$map$transform$p = this.map.transform.point,
          x = _this$map$transform$p.x,
          y = _this$map$transform$p.y;
      camera.projectionMatrix = this.makePerspectiveMatrix(fov, this.map.transform.width / this.map.transform.height, 1, farZ);
      var cameraWorldMatrix = new THREE.Matrix4();
      var cameraTranslateZ = new THREE.Matrix4().makeTranslation(0, 0, cameraToCenterDistance);
      var cameraRotateX = new THREE.Matrix4().makeRotationX(this.map.transform._pitch);
      var cameraRotateZ = new THREE.Matrix4().makeRotationZ(this.map.transform.angle);
      var cameraTranslateXY = new THREE.Matrix4().makeTranslation(x * WORLD_SCALE, -y * WORLD_SCALE, 0); // const cameraTranslateCenter = new THREE.Matrix4().makeTranslation(0, 0, cameraToCenterDistance);
      // Unlike the Mapbox GL JS camera, separate camera translation and rotation out into its world matrix
      // If this is applied directly to the projection matrix, it will work OK but break raycasting

      cameraWorldMatrix.premultiply(cameraTranslateZ).premultiply(cameraRotateX).premultiply(cameraRotateZ).premultiply(cameraTranslateXY);
      camera.matrixWorld.copy(cameraWorldMatrix);
      var zoomPow = this.map.transform.scale * WORLD_SCALE; // Handle scaling and translation of objects in the map in the world's matrix transform, not the camera

      var scale = new THREE.Matrix4();
      var translateCenter = new THREE.Matrix4();
      var translateMap = new THREE.Matrix4();
      var rotateMap = new THREE.Matrix4();
      scale.makeScale(zoomPow, zoomPow, 1.0);
      translateCenter.makeTranslation(WORLD_SIZE / 2, -WORLD_SIZE / 2, 0);
      translateMap.makeTranslation(-this.map.transform.x, this.map.transform.y, 0);
      rotateMap.makeRotationZ(Math.PI);
      scene.matrix = new THREE.Matrix4();
      scene.matrix.premultiply(rotateMap).premultiply(translateCenter).premultiply(scale);
      pickScene.matrix = new THREE.Matrix4();
      pickScene.matrix.premultiply(rotateMap).premultiply(translateCenter).premultiply(scale);
    }
  }, {
    key: "makePerspectiveMatrix",
    value: function makePerspectiveMatrix(fovy, aspect, near, far) {
      var out = new THREE.Matrix4();
      var f = 1.0 / Math.tan(fovy / 2),
          nf = 1 / (near - far);
      var newMatrix = [f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0];
      out.elements = newMatrix;
      return out;
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
      this.renderDom.style.cssText += 'position: absolute;top: 0; z-index:10;height: 100%;width: 100%;pointer-events: none;';
      this.renderDom.id = 'l7_canvaslayer';
      canvasContainer.appendChild(this.renderDom);
    }
  }, {
    key: "mixMap",
    value: function mixMap(scene) {
      var map = this.map;

      scene.getZoom = function () {
        return map.getZoom();
      };

      scene.getCenter = function () {
        return map.getCenter();
      };

      scene.getPitch = function () {
        return map.getPitch();
      };

      scene.containerToLngLat = function (point) {
        return map.unproject(point);
      };
    }
  }]);

  return MapBox;
}(_base["default"]);

exports["default"] = MapBox;