"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _layer = _interopRequireDefault(require("../../core/layer"));

var _util = _interopRequireDefault(require("../../util"));

var _diff = _interopRequireDefault(require("../../util/diff"));

var _tileSource = _interopRequireDefault(require("../../source/tileSource"));

var THREE = _interopRequireWildcard(require("../../core/three"));

var _index = _interopRequireDefault(require("../../core/controller/index"));

var _global = _interopRequireDefault(require("../../global"));

var _tileCache = _interopRequireDefault(require("./tileCache"));

var _geoCoord = require("@antv/geo-coord");

var _index2 = require("@antv/geo-coord/lib/util/index");

var _crsEpsg = require("@antv/geo-coord/lib/geo/crs/crs-epsg3857");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

var pointShape = _global["default"].pointShape;

var TileLayer =
/*#__PURE__*/
function (_Layer) {
  _inherits(TileLayer, _Layer);

  function TileLayer(scene, cfg) {
    var _this;

    _classCallCheck(this, TileLayer);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TileLayer).call(this, scene, _objectSpread({}, cfg, {
      minSourceZoom: 0,
      maxSOurceZoom: 18,
      keepBuffer: 2
    })));
    _this._tileCache = new _tileCache["default"](50, _this._destroyTile);
    _this._crs = _crsEpsg.epsg3857;
    _this._tiles = new THREE.Object3D();
    _this._tiles.frustumCulled = false;
    _this._tileKeys = [];
    _this.tileList = {};
    _this.type = _this.get('layerType');
    return _this;
  }

  _createClass(TileLayer, [{
    key: "shape",
    value: function shape(field, values) {
      var layerType = this.get('layerType');

      if (layerType === 'point') {
        return _get(_getPrototypeOf(TileLayer.prototype), "shape", this).call(this, field, values);
      }

      this.shape = field;
      return this;
    }
  }, {
    key: "source",
    value: function source(data) {
      var cfg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (data instanceof _tileSource["default"]) {
        data.set('mapType', this.scene.mapType);
        this.tileSource = data;
      } else {
        cfg.mapType = this.scene.mapType;
        this.tileSource = new _tileSource["default"](data, cfg);
      }

      return this;
    }
  }, {
    key: "_initControllers",
    value: function _initControllers() {
      var pickCtr = new _index["default"].Picking({
        layer: this
      });
      var interactionCtr = new _index["default"].Interaction({
        layer: this
      });
      this.set('pickingController', pickCtr);
      this.set('interacionController', interactionCtr);
    }
  }, {
    key: "render",
    value: function render() {
      this._visibleWithZoom();

      this._updateDraw();

      this.scene._engine.update();

      return this;
    }
  }, {
    key: "draw",
    value: function draw() {
      this._object3D.add(this._tiles);

      this._calculateLOD();
    }
  }, {
    key: "drawTile",
    value: function drawTile() {}
  }, {
    key: "zoomchange",
    value: function zoomchange(ev) {
      var _this2 = this;

      _get(_getPrototypeOf(TileLayer.prototype), "zoomchange", this).call(this, ev);

      this._visibleWithZoom();

      requestAnimationFrame(function () {
        _this2._calculateLOD();
      });

      this._calculateLOD();
    }
  }, {
    key: "dragend",
    value: function dragend(ev) {
      var _this3 = this;

      _get(_getPrototypeOf(TileLayer.prototype), "dragend", this).call(this, ev);

      requestAnimationFrame(function () {
        _this3._calculateLOD();
      });
    }
  }, {
    key: "_calculateLOD",
    value: function _calculateLOD() {
      var _this4 = this;

      /**
       * 加载完成 active
       * 需要显示 current
       * 是否保留 retain
       */
      var zoom = Math.floor(this.scene.getZoom()) - 1;
      var minZoom = this.get('minZoom');
      var maxZoom = this.get('maxZoom');
      var minSourceZoom = this.tileSource.get('minSourceZoom');
      var maxSourceZoom = this.tileSource.get('maxSourceZoom');
      var currentZoom = this.scene.getZoom();
      this.tileZoom = zoom > maxSourceZoom ? maxSourceZoom : zoom;

      if (currentZoom < minZoom || currentZoom >= maxZoom || currentZoom < minSourceZoom) {
        this._removeTiles();

        this._object3D.visible = false;
        return;
      } else if (this.get('visible')) {
        this._object3D.visible = true;
      }

      this.show();
      this.updateTileList = [];
      var center = this.scene.getCenter();

      var centerPoint = this._crs.lngLatToPoint((0, _geoCoord.toLngLat)(center.lng, center.lat), this.tileZoom);

      var centerXY = centerPoint.divideBy(256).floor();

      var pixelBounds = this._getPixelBounds();

      var tileRange = this._pxBoundsToTileRange(pixelBounds);

      var margin = this.get('keepBuffer');
      this.noPruneRange = new _geoCoord.Bounds(tileRange.getBottomLeft().subtract([margin, -margin]), tileRange.getTopRight().add([margin, -margin]));

      if (!(isFinite(tileRange.min.x) && isFinite(tileRange.min.y) && isFinite(tileRange.max.x) && isFinite(tileRange.max.y))) {
        throw new Error('Attempted to load an infinite number of tiles');
      }

      for (var j = tileRange.min.y; j <= tileRange.max.y; j++) {
        for (var i = tileRange.min.x; i <= tileRange.max.x; i++) {
          var coords = [i, j, this.tileZoom];
          var tile = this.tileList[coords.join('_')];

          if (tile) {
            tile.current = true;
          } else {
            this.tileList[coords.join('_')] = {
              current: true,
              coords: coords
            };
            this.updateTileList.push(coords);
          }
        }
      }

      this.updateTileList.sort(function (a, b) {
        var tile1 = a;
        var tile2 = b;
        var d1 = Math.pow(tile1[0] * 1 - centerXY.x, 2) + Math.pow(tile1[1] * 1 - centerXY.y, 2);
        var d2 = Math.pow(tile2[0] * 1 - centerXY.x, 2) + Math.pow(tile2[1] * 1 - centerXY.y, 2);
        return d1 - d2;
      });

      this._pruneTiles(); // 更新瓦片数据


      this.updateTileList.forEach(function (coords) {
        var key = coords.join('_');

        if (_this4.tileList[key].current) {
          _this4._requestTile(key, _this4);
        }
      });
    }
  }, {
    key: "_getShape",
    value: function _getShape(layerData) {
      var shape = null;

      if (!layerData[0].hasOwnProperty('shape')) {
        return 'normal';
      }

      for (var i = 0; i < layerData.length; i++) {
        shape = layerData[i].shape;

        if (shape !== undefined) {
          break;
        }
      }

      if (pointShape['2d'].indexOf(shape) !== -1) {
        return 'circle';
      } else if (pointShape['3d'].indexOf(shape) !== -1) {
        return 'fill';
      } else if (this.scene.image.imagesIds.indexOf(shape) !== -1) {
        return 'image';
      }

      return 'text';
    }
  }, {
    key: "_updateTileList",
    value: function _updateTileList(x, y, z) {
      var key = [x, y, z].join('_');
      var tile = this.tileList[key];

      if (tile) {
        tile.current = true;
      } else {
        this.tileList[key] = {
          current: true,
          active: false,
          coords: key.split('_')
        };
        this.updateTileList.push(key);
      }
    }
  }, {
    key: "_requestTile",
    value: function _requestTile(key, layer) {
      var _this5 = this;

      var t = this.tileList[key];

      if (!t) {
        return;
      }

      var tile = this._tileCache.getTile(key);

      if (!tile) {
        tile = this._createTile(key, layer);
        tile.on('tileLoaded', function () {
          t.active = true;
          var mesh = tile.getMesh();
          mesh.name = key;

          _this5._tileCache.setTile(tile, key);

          _this5._tileKeys.push(key);

          if (mesh.type === 'composer') {
            _this5.scene._engine.composerLayers.push(mesh);

            _this5.scene._engine.update();

            _this5._pruneTiles();

            return;
          }

          if (mesh.children.length !== 0) {
            _this5._tiles.add(tile.getMesh());

            _this5._addPickTile(tile.getMesh());
          }

          _this5.scene._engine.update();

          _this5._pruneTiles();
        });
      } else {
        if (tile.getMesh().type === 'composer') {
          this.scene._engine.composerLayers.push(tile.getMesh());

          this.scene._engine.update();

          this._pruneTiles();

          return;
        }

        if (tile.needUpdate) {
          tile.updateColor();
          tile.needUpdate = false;
        }

        this._tiles.add(tile.getMesh());

        t.active = true;

        this._addPickTile(tile.getMesh());

        this._tileKeys.push(key);

        this.scene._engine.update();

        this._pruneTiles();
      }
    }
  }, {
    key: "_addPickTile",
    value: function _addPickTile(meshobj) {
      if (this.type === 'image') {
        return;
      }

      var pickCtr = this.get('pickingController');
      var mesh = meshobj.children[0];
      mesh.name = meshobj.name;
      pickCtr.addPickMesh(mesh);
    } // 根据距离优先级查找

  }, {
    key: "getSelectFeature",
    value: function getSelectFeature(id, lnglat) {
      var zoom = this.tileZoom;

      var tilePoint = this._crs.lngLatToPoint((0, _geoCoord.toLngLat)(lnglat.lng, lnglat.lat), zoom);

      var tileXY = tilePoint.divideBy(256).floor();
      var key = [tileXY.x, tileXY.y, zoom].join('_');

      var tile = this._tileCache.getTile(key);

      var feature = tile ? tile.getSelectFeature(id) : null;
      return {
        feature: feature
      };
    }
  }, {
    key: "_pruneTiles",
    value: function _pruneTiles() {
      var tile;
      var zoom = this.tileZoom;

      for (var key in this.tileList) {
        var c = this.tileList[key].coords;

        if (c[2] !== zoom || !this.noPruneRange.contains(new _geoCoord.Point(c[0], c[1]))) {
          this.tileList[key].current = false;
        }
      }

      for (var _key in this.tileList) {
        tile = this.tileList[_key];
        tile.retain = tile.current;
      }

      for (var _key2 in this.tileList) {
        tile = this.tileList[_key2];

        if (tile.current && !tile.active) {
          var _key2$split$map = _key2.split('_').map(function (v) {
            return v * 1;
          }),
              _key2$split$map2 = _slicedToArray(_key2$split$map, 3),
              x = _key2$split$map2[0],
              y = _key2$split$map2[1],
              z = _key2$split$map2[2];

          if (!this._retainParent(x, y, z, z - 5)) {
            this._retainChildren(x, y, z, z + 2);
          }
        }
      }

      this._removeOutTiles();
    }
  }, {
    key: "_retainParent",
    value: function _retainParent(x, y, z, minZoom) {
      var x2 = Math.floor(x / 2);
      var y2 = Math.floor(y / 2);
      var z2 = z - 1;
      var tile = this.tileList[[x2, y2, z2].join('_')];

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
    key: "_retainChildren",
    value: function _retainChildren(x, y, z, maxZoom) {
      for (var i = 2 * x; i < 2 * x + 2; i++) {
        for (var j = 2 * y; j < 2 * y + 2; j++) {
          var key = [i, j, z + 1].join('_');
          var tile = this.tileList[key];

          if (tile && tile.active) {
            tile.retain = true;
            continue;
          } else if (tile && tile.loaded) {
            tile.retain = true;
          }

          if (z + 1 < maxZoom) {
            this._retainChildren(i, j, z + 1, maxZoom);
          }
        }
      }
    } // 移除视野外的tile

  }, {
    key: "_removeOutTiles",
    value: function _removeOutTiles() {
      var _this6 = this;

      for (var key in this.tileList) {
        if (!this.tileList[key].retain) {
          (function () {
            var tileObj = _this6._tileCache.getTile(key);

            if (tileObj) {
              tileObj._abortRequest();

              var pickCtr = _this6.get('pickingController');

              pickCtr && pickCtr.removePickMeshByName(tileObj.getMesh().name);

              _this6._tiles.remove(tileObj.getMesh());
            }

            if (tileObj && tileObj.getMesh().type === 'composer') {
              _this6.scene._engine.composerLayers = _this6.scene._engine.composerLayers.filter(function (obj) {
                return obj.name !== tileObj.getMesh().name;
              });
            }

            delete _this6.tileList[key];
          })();
        }
      }

      if (this._tiles.children.length > Object.keys(this.tileList).length) {
        this._tiles.children.forEach(function (tile) {
          var key = tile.name;

          if (!_this6.tileList[key]) {
            _this6._tiles.remove(tile);
          }
        });
      } // 移除 空的geom


      this.scene._engine.update();
    }
  }, {
    key: "_removeTiles",
    value: function _removeTiles() {
      this.hide();

      if (!this._tiles || !this._tiles.children) {
        return;
      }

      for (var i = this._tiles.children.length - 1; i >= 0; i--) {
        this._tiles.remove(this._tiles.children[i]);
      }

      this.tileList = [];
      this._tileKeys = [];

      this._tileCache.destory();

      var pickCtr = this.get('pickingController');
      pickCtr.removeAllMesh();
    }
  }, {
    key: "_getPixelBounds",
    value: function _getPixelBounds() {
      var viewPort = this.scene.getBounds().toBounds();
      var NE = viewPort.getNorthEast();
      var SW = viewPort.getSouthWest();
      var zoom = this.tileZoom;
      var center = this.scene.getCenter();

      var NEPoint = this._crs.lngLatToPoint((0, _geoCoord.toLngLat)(NE.lng, NE.lat), zoom);

      var SWPoint = this._crs.lngLatToPoint((0, _geoCoord.toLngLat)(SW.lng, SW.lat), zoom);

      var centerPoint = this._crs.lngLatToPoint((0, _geoCoord.toLngLat)(center.lng, center.lat), zoom);

      var topHeight = centerPoint.y - NEPoint.y;
      var bottomHeight = SWPoint.y - centerPoint.y; // 跨日界线的情况

      var leftWidth;
      var rightWidth;

      if (center.lng - NE.lng > 0 || center.lng - SW.lng < 0) {
        var width = Math.pow(2, zoom) * 256 / 360 * (180 - NE.lng) + Math.pow(2, zoom) * 256 / 360 * (SW.lng + 180);

        if (center.lng - NE.lng > 0) {
          // 日界线在右侧
          leftWidth = Math.pow(2, zoom) * 256 / 360 * (center.lng - NE.lng);
          rightWidth = width - leftWidth;
        } else {
          rightWidth = Math.pow(2, zoom) * 256 / 360 * (SW.lng - center.lng);
          leftWidth = width - rightWidth;
        }
      } else {
        // 不跨日界线
        leftWidth = Math.pow(2, zoom) * 256 / 360 * (center.lng - SW.lng);
        rightWidth = Math.pow(2, zoom) * 256 / 360 * (NE.lng - center.lng);
      }

      var pixelBounds = new _geoCoord.Bounds(centerPoint.subtract(leftWidth, topHeight), centerPoint.add(rightWidth, bottomHeight));
      return pixelBounds;
    }
  }, {
    key: "_pxBoundsToTileRange",
    value: function _pxBoundsToTileRange(pixelBounds) {
      return new _geoCoord.Bounds(pixelBounds.min.divideBy(256).floor(), pixelBounds.max.divideBy(256).ceil().subtract([1, 1]));
    }
  }, {
    key: "_wrapCoords",
    value: function _wrapCoords(coords) {
      var wrapX = [0, Math.pow(2, coords[2])];
      var newX = (0, _index2.wrapNum)(coords[0], wrapX);
      return [newX, coords[1], coords[2]];
    }
  }, {
    key: "_destroyTile",
    value: function _destroyTile(tile) {
      tile.destroy();
      tile = null;
    }
  }, {
    key: "_updateDraw",
    value: function _updateDraw() {
      var _this7 = this;

      var preAttrs = this.get('preAttrOptions');
      var nextAttrs = this.get('attrOptions');
      var preStyle = this.get('preStyleOption');
      var nextStyle = this.get('styleOptions');

      if (preAttrs === undefined && preStyle === undefined) {
        // 首次渲染
        this._setPreOption();

        this._scaleByZoom();

        this._initControllers();

        this._initInteraction();

        this._initMapEvent();

        this.draw();

        this._setPreOption();

        return;
      }

      if (!this._tiles.children.length > 0 || !this._object3D.visible) {
        return;
      } // 更新数据颜色 过滤 filter


      if (!_util["default"].isEqual(preAttrs.color, nextAttrs.color) || !_util["default"].isEqual(preAttrs.filter, nextAttrs.filter)) {
        this._tileCache.setNeedUpdate();

        this._tiles.children.forEach(function (tile) {
          var tileObj = _this7._tileCache.getTile(tile.name);

          tileObj.updateColor();
          tileObj.needUpdate = false;

          _this7.scene._engine.update();
        });
      } // 更新Size


      if (!_util["default"].isEqual(preAttrs.size, nextAttrs.size)) {} // this._tiles.children(tile => {
      //   this._tileCache.get(tile.name).updateSize();
      // });
      // 更新形状


      if (!_util["default"].isEqual(preAttrs.shape, nextAttrs.shape)) {// this._tiles.children(tile => {
        //   this._tileCache.get(tile.name).updateShape();
        // });
      }

      if (!_util["default"].isEqual(preStyle, nextStyle)) {
        // 判断新增，修改，删除
        var newStyle = {};

        _util["default"].each((0, _diff["default"])(preStyle, nextStyle), function (_ref) {
          var type = _ref.type,
              key = _ref.key,
              value = _ref.value;
          type !== 'remove' && (newStyle[key] = value); // newStyle[key] = type === 'remove' ? null : value;
        });

        this._tiles.children(function (tile) {
          _this7._tileCache.get(tile.name).updateStyle();
        });
      }

      this._setPreOption();
    }
  }, {
    key: "destroy",
    value: function destroy() {}
  }]);

  return TileLayer;
}(_layer["default"]);

exports["default"] = TileLayer;