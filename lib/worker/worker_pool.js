"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _web_worker = _interopRequireDefault(require("./web_worker"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Constructs a worker pool.
 * @private
 */
var WorkerPool =
/*#__PURE__*/
function () {
  function WorkerPool() {
    _classCallCheck(this, WorkerPool);

    this.active = {};
  }

  _createClass(WorkerPool, [{
    key: "acquire",
    value: function acquire(mapId) {
      if (!this.workers) {
        // Lazily look up the value of mapboxgl.workerCount so that
        // client code has had a chance to set it.
        this.workers = [];

        while (this.workers.length < WorkerPool.workerCount) {
          this.workers.push(new _web_worker["default"]());
        }
      }

      this.active[mapId] = true;
      return this.workers.slice();
    }
  }, {
    key: "release",
    value: function release(mapId) {
      delete this.active[mapId];

      if (Object.keys(this.active).length === 0) {
        this.workers.forEach(function (w) {
          w.terminate();
        });
        this.workers = null;
      }
    }
  }]);

  return WorkerPool;
}();

exports["default"] = WorkerPool;
WorkerPool.workerCount = Math.max(Math.floor(window.navigator.hardwareConcurrency / 2), 1);