"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _lruCache = _interopRequireDefault(require("../util/lru-cache"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var TileDataCache =
/*#__PURE__*/
function () {
  function TileDataCache() {
    var limit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 50;
    var tileDestroy = arguments.length > 1 ? arguments[1] : undefined;

    _classCallCheck(this, TileDataCache);

    this._cache = new _lruCache["default"](limit, tileDestroy);
  }

  _createClass(TileDataCache, [{
    key: "getTile",
    value: function getTile(key) {
      return this._cache.get(key);
    }
  }, {
    key: "setTile",
    value: function setTile(tile, key) {
      this._cache.set(key, tile);
    }
  }, {
    key: "removeTile",
    value: function removeTile(key) {
      return this._cache["delete"](key);
    }
  }, {
    key: "destory",
    value: function destory() {
      this._cache.clear();
    }
  }]);

  return TileDataCache;
}();

exports["default"] = TileDataCache;