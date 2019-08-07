"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _source = _interopRequireDefault(require("../core/source"));

var _ajax = require("../util/ajax");

var _tile_data_cache = _interopRequireDefault(require("./tile_data_cache"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var tileURLRegex = /\{([zxy])\}/g;

var TileSource =
/*#__PURE__*/
function (_Source) {
  _inherits(TileSource, _Source);

  function TileSource(url, cfg) {
    var _this;

    _classCallCheck(this, TileSource);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TileSource).call(this, cfg));
    _this.cfg = cfg;
    _this.urlTemplate = url;
    _this._tileDataCache = new _tile_data_cache["default"](50, _this.tileDestroy);
    _this.type = 'tile';
    return _this;
  }

  _createClass(TileSource, [{
    key: "getTileData",
    value: function getTileData(x, y, z) {
      var _this2 = this;

      var key = [x, y, z].join('_');

      var tileData = this._tileDataCache.getTile(key);

      if (!tileData) {
        var tiledataPromise = new Promise(function (resolve) {
          if (tileData) {
            setTimeout(function () {
              resolve(tileData);
            }, 0);
          } else {
            _this2._requestTileData(x, y, z, resolve);
          }
        });
        tileData = {
          loading: true,
          data: tiledataPromise
        };

        this._tileDataCache.setTile(tileData, key);

        return tileData;
      }

      return tileData;
    }
  }, {
    key: "_init",
    value: function _init() {
      var parser = this.get('parser');
      this.set('minSourceZoom', parser && parser.minZoom || 0);
      this.set('maxSourceZoom', parser && parser.maxZoom || 18);
    }
  }, {
    key: "_generateSource",
    value: function _generateSource(x, y, z, data) {
      this.cfg.parser.tile = [x, y, z];
      var tileData = new _source["default"](_objectSpread({}, this.cfg, {
        mapType: this.get('mapType'),
        data: data,
        tile: [x, y, z]
      }));
      return tileData;
    }
  }, {
    key: "_requestTileData",
    value: function _requestTileData(x, y, z, done) {
      var _this3 = this;

      var urlParams = {
        x: x,
        y: y,
        z: z
      };

      var url = this._getTileURL(urlParams);

      var key = [x, y, z].join('_');
      this.xhrRequest = (0, _ajax.getArrayBuffer)({
        url: url
      }, function (err, data) {
        if (err) {
          _this3._noData = true;

          _this3._tileDataCache.setTile({
            loaded: true,
            data: {
              data: null
            }
          }, key);

          return;
        }

        var tileData = _this3._generateSource(x, y, z, data.data);

        _this3._tileDataCache.setTile({
          loaded: true,
          data: tileData
        }, key);

        done(tileData);
      });
    }
  }, {
    key: "getRequestUrl",
    value: function getRequestUrl(x, y, z) {
      var urlParams = {
        x: x,
        y: y,
        z: z
      };
      return this._getTileURL(urlParams);
    }
  }, {
    key: "_getTileURL",
    value: function _getTileURL(urlParams) {
      if (!urlParams.s) {
        // Default to a random choice of a, b or c
        urlParams.s = String.fromCharCode(97 + Math.floor(Math.random() * 3));
      }

      tileURLRegex.lastIndex = 0;
      return this.urlTemplate.replace(tileURLRegex, function (value, key) {
        return urlParams[key];
      });
    }
  }, {
    key: "tileDestroy",
    value: function tileDestroy(tile) {
      if (!tile || !tile.data || tile.loading || !tile.data.data || !tile.data.data.dataArray) {
        return;
      }

      var tileData = tile.data;
      tileData.destroy();
    }
  }]);

  return TileSource;
}(_source["default"]);

exports["default"] = TileSource;