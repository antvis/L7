"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var THREE = _interopRequireWildcard(require("../../core/three"));

var _base = _interopRequireDefault(require("../../core/base"));

var _object3dUtil = require("../../util/object3d-util");

var _index = _interopRequireDefault(require("../../core/controller/index"));

var _geoCoord = require("@antv/geo-coord");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var r2d = 180 / Math.PI;
var tileURLRegex = /\{([zxy])\}/g;

var Tile =
/*#__PURE__*/
function (_Base) {
  _inherits(Tile, _Base);

  function Tile(key, url, layer) {
    var _this;

    _classCallCheck(this, Tile);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Tile).call(this, {
      scales: {},
      attrs: {}
    }));
    _this.layer = layer;
    _this._tile = key.split('_').map(function (v) {
      return v * 1;
    });
    _this._path = url;
    _this._tileLnglatBounds = _this._tileLnglatBounds(_this._tile);
    _this._tileBounds = _this._tileBounds(_this._tileLnglatBounds);
    _this._center = _this._tileBounds.getCenter();
    _this._centerLnglat = _this._tileLnglatBounds.getCenter();
    _this._object3D = new THREE.Object3D({
      name: key
    });
    _this._object3D.frustumCulled = false; // this._object3D.name = key;

    _this._object3D.onBeforeRender = function () {};

    _this._isLoaded = false;

    _this.requestTileAsync(function (data) {
      return _this._init(data);
    });

    return _this;
  }

  _createClass(Tile, [{
    key: "_init",
    value: function _init(data) {
      // this._creatSource(data); // 获取Source
      this.layerSource = data;

      if (this.layerSource.data === null) {
        this.isValid = false;
        return;
      }

      this.isValid = true;

      this._initControllers();

      this._createMesh();
    }
  }, {
    key: "repaint",
    value: function repaint() {
      this._initControllers();

      this._createMesh();
    }
  }, {
    key: "requestTileAsync",
    value: function requestTileAsync(done) {
      var data = this.layer.tileSource.getTileData(this._tile[0], this._tile[1], this._tile[2]);

      if (data.loaded) {
        done(data.data);
      } else {
        data.data.then(function (data) {
          done(data);
        });
      }
    }
  }, {
    key: "_initControllers",
    value: function _initControllers() {
      var mappingCtr = new _index["default"].Mapping({
        layer: this.layer,
        mesh: this
      });
      var bufferCtr = new _index["default"].Buffer({
        layer: this.layer,
        mesh: this
      });
      this.set('mappingController', mappingCtr);
      this.set('bufferController', bufferCtr);
    }
  }, {
    key: "_createMesh",
    value: function _createMesh() {}
  }, {
    key: "_getTileURL",
    value: function _getTileURL(urlParams) {
      if (!urlParams.s) {
        // Default to a random choice of a, b or c
        urlParams.s = String.fromCharCode(97 + Math.floor(Math.random() * 3));
      }

      tileURLRegex.lastIndex = 0;
      return this._path.replace(tileURLRegex, function (value, key) {
        return urlParams[key];
      });
    } // 经纬度范围转瓦片范围

  }, {
    key: "_tileBounds",
    value: function _tileBounds(lnglatBound) {
      var ne = this.layer.scene.project([lnglatBound.getNorthEast().lng, lnglatBound.getNorthEast().lat]);
      var sw = this.layer.scene.project([lnglatBound.getSouthWest().lng, lnglatBound.getSouthWest().lat]);
      return (0, _geoCoord.toBounds)(sw, ne);
    }
  }, {
    key: "getMesh",
    value: function getMesh() {
      return this._object3D;
    } // Get tile bounds in WGS84 coordinates

  }, {
    key: "_tileLnglatBounds",
    value: function _tileLnglatBounds(tile) {
      var e = this._tile2lng(tile[0] + 1, tile[2]);

      var w = this._tile2lng(tile[0], tile[2]);

      var s = this._tile2lat(tile[1] + 1, tile[2]);

      var n = this._tile2lat(tile[1], tile[2]);

      return (0, _geoCoord.toLngLatBounds)([w, n], [e, s]);
    }
  }, {
    key: "_tile2lng",
    value: function _tile2lng(x, z) {
      return x / Math.pow(2, z) * 360 - 180;
    }
  }, {
    key: "_tile2lat",
    value: function _tile2lat(y, z) {
      var n = Math.PI - 2 * Math.PI * y / Math.pow(2, z);
      return r2d * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
    }
  }, {
    key: "_retainParent",
    value: function _retainParent(x, y, z) {
      var minZoom = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 5;
      var x2 = Math.floor(x / 2),
          y2 = Math.floor(y / 2),
          z2 = z - 1,
          coords2 = [+x2, +y2, +z2];
      var tile = this._tiles[coords2]; // 计算保留

      if (tile && tile.active) {
        tile.retain = true;
        return true;
      } else if (tile && tile.loaded) {
        tile.retain = true;
      }

      if (z2 > minZoom) {
        return this._retainParent(x2, y2, z2, minZoom);
      }

      return false;
    }
  }, {
    key: "updateColor",
    value: function updateColor() {
      var bufferCtr = this.get('bufferController');
      this.get('mappingController').update();

      bufferCtr._updateColorAttributes(this.getMesh().children[0]);
    }
  }, {
    key: "updateStyle",
    value: function updateStyle() {
      var bufferCtr = this.get('bufferController');

      bufferCtr._updateStyle(this.getMesh().children[0]);
    }
  }, {
    key: "_preRender",
    value: function _preRender() {}
  }, {
    key: "destroy",
    value: function destroy() {
      _get(_getPrototypeOf(Tile.prototype), "destroy", this).call(this);

      (0, _object3dUtil.destoryObject)(this._object3D);
    }
  }]);

  return Tile;
}(_base["default"]);

exports["default"] = Tile;