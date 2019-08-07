"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _lruCache = _interopRequireDefault(require("../../util/lru-cache"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var TileCache =
/*#__PURE__*/
function () {
  function TileCache() {
    var limit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 50;

    _classCallCheck(this, TileCache);

    this._cache = new _lruCache["default"](limit);
  }

  _createClass(TileCache, [{
    key: "getTile",
    value: function getTile(z, x, y) {
      var key = this._generateKey(z, x, y);

      return this._cache.get(key);
    }
  }, {
    key: "setTile",
    value: function setTile(tile, z, x, y) {
      var key = this._generateKey(z, x, y);

      this._cache.set(key, tile);
    }
  }, {
    key: "_generateKey",
    value: function _generateKey(z, x, y) {
      return [z, x, y].join('_');
    }
  }, {
    key: "destory",
    value: function destory() {
      this._cache.clear();
    }
  }]);

  return TileCache;
}();

exports["default"] = TileCache;