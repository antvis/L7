"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * LRU Cache class with limit
 *
 * Update order for each get/set operation
 * Delete oldest when reach given limit
 */
var LRUCache =
/*#__PURE__*/
function () {
  function LRUCache() {
    var limit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 5;

    _classCallCheck(this, LRUCache);

    this.limit = limit;
    this.clear();
  }

  _createClass(LRUCache, [{
    key: "clear",
    value: function clear() {
      this._cache = {}; // access/update order, first item is oldest, last item is newest

      this._order = [];
    }
  }, {
    key: "get",
    value: function get(key) {
      var value = this._cache[key];

      if (value) {
        // update order
        this._deleteOrder(key);

        this._appendOrder(key);
      }

      return value;
    }
  }, {
    key: "set",
    value: function set(key, value) {
      if (!this._cache[key]) {
        // if reach limit, delete the oldest
        if (Object.keys(this._cache).length === this.limit) {
          this["delete"](this._order[0]);
        }

        this._cache[key] = value;

        this._appendOrder(key);
      } else {
        // if found in cache, delete the old one, insert new one to the first of list
        this["delete"](key);
        this._cache[key] = value;

        this._appendOrder(key);
      }
    }
  }, {
    key: "delete",
    value: function _delete(key) {
      var value = this._cache[key];

      if (value) {
        this._deleteCache(key);

        this._deleteOrder(key);
      }
    }
  }, {
    key: "_deleteCache",
    value: function _deleteCache(key) {
      delete this._cache[key];
    }
  }, {
    key: "_deleteOrder",
    value: function _deleteOrder(key) {
      var index = this._order.findIndex(function (o) {
        return o === key;
      });

      if (index >= 0) {
        this._order.splice(index, 1);
      }
    }
  }, {
    key: "_appendOrder",
    value: function _appendOrder(key) {
      this._order.push(key);
    }
  }]);

  return LRUCache;
}();

exports["default"] = LRUCache;