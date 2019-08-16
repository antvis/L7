"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _base = _interopRequireDefault(require("../core/base"));

var _tile_cache = _interopRequireDefault(require("../layer/tile/tile_cache"));

var _vector_tile_source = _interopRequireDefault(require("./vector_tile_source"));

var _geoCoord = require("@antv/geo-coord");

var _vector_tile_mesh = _interopRequireDefault(require("../layer/tile/vector_tile_mesh"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

// 统一管理 source 添加，管理，更新
var SouceCache =
/*#__PURE__*/
function (_Base) {
  _inherits(SouceCache, _Base);

  function SouceCache(scene, cfg) {
    var _this;

    _classCallCheck(this, SouceCache);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SouceCache).call(this, _objectSpread({
      cacheLimit: 50,
      minZoom: 0,
      maxZoom: 18,
      keepBuffer: 0
    }, cfg)));
    _this._tileMap = {}; // 视野内瓦片坐标序列

    _this.tileList = {}; // 正在使用的瓦片坐标，记录瓦片的使用状态

    _this.scene = scene; // TODO 销毁函数

    _this._tileCache = new _tile_cache["default"](_this.get('cacheLimit'), _this._destroyTile.bind(_assertThisInitialized(_this)));
    _this.layers = _this.scene.getLayers();
    _this._source = new _vector_tile_source["default"](cfg, _this.scene.style.WorkerController);
    _this.layersTiles = {}; // 存储当前source所有layer的瓦片
    // this._tiles = new THREE.Object3D();

    return _this;
  }

  _createClass(SouceCache, [{
    key: "getLayerById",
    value: function getLayerById(id) {
      var layers = this.scene.getLayers();

      for (var i = 0; i < layers.length; i += 1) {
        if (layers[i].layerId === id * 1) {
          return layers[i];
        }
      }
    }
    /**
     * 移除视野外的瓦片，计算新增的瓦片数据
     * @param {*}tileMap 瓦片列表
     */

  }, {
    key: "update",
    value: function update() {
      var _this2 = this;

      // if (!layercfg && this.layercfg) return;
      // this._layercfg = layercfg;
      this._calculateTileIDs(); // this.updateList = this._getNewTiles(this._tileMap);// 计算新增瓦片
      // this._pruneTiles();


      var _loop = function _loop(i) {
        // 瓦片相关参数
        var tileId = _this2.updateTileList[i].join('_');

        var tileinfo = _this2.tileList[tileId];
        tileinfo.loading = true;

        var tiles = _this2._tileCache.getTile(tileId);

        if (tiles !== undefined) {
          tileinfo.active = true;
          tileinfo.loaded = true;

          for (var layerId in tiles) {
            var layer = _this2.getLayerById(layerId);

            var tileMesh = tiles[layerId];
            layer.tiles.add(tileMesh.getMesh());

            _this2.scene._engine.update();
          }

          _this2._pruneTiles();

          return "continue";
        }

        _this2._source.loadTile(tileinfo, function (err, data) {
          if (!err && data !== undefined) {
            _this2._renderTile(tileinfo, data);

            tileinfo.active = true;
          }

          tileinfo.loaded = true;

          _this2._pruneTiles();
        });
      };

      for (var i = 0; i < this.updateTileList.length; i++) {
        var _ret = _loop(i);

        if (_ret === "continue") continue;
      }
    }
  }, {
    key: "_renderTile",
    value: function _renderTile(tileinfo, data) {
      var tileId = tileinfo.id;
      var tiles = {};

      for (var layerId in data) {
        var layer = this.getLayerById(layerId);
        var tileMesh = new _vector_tile_mesh["default"](layer, data[layerId]);
        tiles[layerId] = tileMesh;
        layer.tiles.add(tileMesh.getMesh());

        this.scene._engine.update();
      }

      this._tileCache.setTile(tiles, tileId);
    } // 计算视野内的瓦片坐标

  }, {
    key: "_calculateTileIDs",
    value: function _calculateTileIDs() {
      this._tileMap = {};
      this.updateTileList = [];
      var zoom = Math.floor(this.scene.getZoom()); // - window.window.devicePixelRatio + 1; // zoom - 1

      var minSourceZoom = this.get('minZoom');
      var maxSourceZoom = this.get('maxZoom');
      this.tileZoom = zoom > maxSourceZoom ? maxSourceZoom : zoom;
      var currentZoom = this.scene.getZoom();

      if (currentZoom < minSourceZoom) {
        this._removeTiles(); // 小于source最小范围不在处理


        return;
      }

      var pixelBounds = this._getPixelBounds();

      var tileRange = this._pxBoundsToTileRange(pixelBounds);

      var margin = this.get('keepBuffer');
      var center = this.scene.getCenter();
      var centerPoint = this.scene.crs.lngLatToPoint((0, _geoCoord.toLngLat)(center.lng, center.lat), this.tileZoom);
      var centerXY = centerPoint.divideBy(256).floor();
      this._noPruneRange = new _geoCoord.Bounds(tileRange.getBottomLeft().subtract([margin, -margin]), tileRange.getTopRight().add([margin, -margin]));

      if (!(isFinite(tileRange.min.x) && isFinite(tileRange.min.y) && isFinite(tileRange.max.x) && isFinite(tileRange.max.y))) {
        throw new Error('Attempted to load an infinite number of tiles');
      }

      for (var j = tileRange.min.y; j <= tileRange.max.y; j++) {
        for (var i = tileRange.min.x; i <= tileRange.max.x; i++) {
          var coords = [i, j, this.tileZoom];
          var tile = this.tileList[coords.join('_')];

          if (tile && tile.loading) {
            tile.current = true;
            tile.retain = true;
          } else {
            this.tileList[coords.join('_')] = {
              current: true,
              active: false,
              retain: true,
              loading: false,
              coords: coords,
              id: coords.join('_')
            };
            this.updateTileList.push(coords);
          }
        }
      } // 根据中心点排序


      this.updateTileList.sort(function (a, b) {
        var tile1 = a;
        var tile2 = b;
        var d1 = Math.pow(tile1[0] * 1 - centerXY.x, 2) + Math.pow(tile1[1] * 1 - centerXY.y, 2);
        var d2 = Math.pow(tile2[0] * 1 - centerXY.x, 2) + Math.pow(tile2[1] * 1 - centerXY.y, 2);
        return d1 - d2;
      });

      this._pruneTiles();
    }
  }, {
    key: "_getPixelBounds",
    value: function _getPixelBounds() {
      var viewPort = this.scene.getBounds().toBounds();
      var NE = viewPort.getNorthEast();
      var SW = viewPort.getSouthWest();
      var zoom = this.tileZoom;
      var center = this.scene.getCenter();
      var NEPoint = this.scene.crs.lngLatToPoint((0, _geoCoord.toLngLat)(NE.lng, NE.lat), zoom);
      var SWPoint = this.scene.crs.lngLatToPoint((0, _geoCoord.toLngLat)(SW.lng, SW.lat), zoom);
      var centerPoint = this.scene.crs.lngLatToPoint((0, _geoCoord.toLngLat)(center.lng, center.lat), zoom);
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
    key: "_loadTile",
    value: function _loadTile(tile, callback) {
      return this._source.loadTile(tile, callback);
    }
  }, {
    key: "_unloadTile",
    value: function _unloadTile(tile) {
      if (this._source.unloadTile) {
        return this._source.unloadTile(tile, function () {});
      }
    }
  }, {
    key: "_abortTile",
    value: function _abortTile(tile) {
      if (this._source.abortTile) {
        return this._source.abortTile(tile, function () {});
      }
    }
  }, {
    key: "reload",
    value: function reload() {}
  }, {
    key: "_reloadTile",
    value: function _reloadTile() {}
  }, {
    key: "_removeTile",
    value: function _removeTile() {}
  }, {
    key: "clearTiles",
    value: function clearTiles() {}
  }, {
    key: "_pruneTiles",
    value: function _pruneTiles() {
      var tile;
      var zoom = this.tileZoom;

      for (var key in this.tileList) {
        var c = this.tileList[key].coords;

        if (c[2] !== zoom || !this._noPruneRange.contains(new _geoCoord.Point(c[0], c[1]))) {
          this.tileList[key].current = false;
          this.tileList[key].retain = false;
        }
      }

      for (var _key in this.tileList) {
        tile = this.tileList[_key];

        if (tile.current && !tile.active) {
          var _key$split$map = _key.split('_').map(function (v) {
            return v * 1;
          }),
              _key$split$map2 = _slicedToArray(_key$split$map, 3),
              x = _key$split$map2[0],
              y = _key$split$map2[1],
              z = _key$split$map2[2];

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
        tile.current = true;
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
            tile.current = true;
            continue;
          } else if (tile && tile.loaded) {
            tile.retain = true;
            tile.current = true;
          }

          if (z + 1 < maxZoom) {
            this._retainChildren(i, j, z + 1, maxZoom);
          }
        }
      }
    }
  }, {
    key: "_removeOutTiles",
    value: function _removeOutTiles() {
      var _this3 = this;

      // 移除视野外的tile
      for (var key in this.tileList) {
        if (!this.tileList[key].retain) {
          this._abortTile(this.tileList[key]);

          this._unloadTile(this.tileList[key]);

          delete this.tileList[key];
        }
      }

      var layers = this.scene.getLayers();

      var _loop2 = function _loop2(i) {
        var id = _this3.get('sourceID');

        var layerSource = layers[i].get('sourceOption').id;

        if (layerSource !== id) {
          return {
            v: void 0
          };
        }

        layers[i].tiles.children.forEach(function (tile) {
          var key = tile.name;

          if (!_this3.tileList[key]) {
            layers[i].tiles.remove(tile);
          }
        });
      };

      for (var i = 0; i < layers.length; i++) {
        var _ret2 = _loop2(i);

        if (_typeof(_ret2) === "object") return _ret2.v;
      } // 移除对应的数据

    }
  }, {
    key: "_destroyTile",
    value: function _destroyTile(tile, key) {
      this._unloadTile(key);
    } // 移除视野外的tile

  }]);

  return SouceCache;
}(_base["default"]);

exports["default"] = SouceCache;