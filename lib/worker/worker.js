"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _vector_tile_worker_source = _interopRequireDefault(require("../source/vector_tile_worker_source"));

var _actor = _interopRequireDefault(require("./actor"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// 统一管理workerSource 实例化
var Worker =
/*#__PURE__*/
function () {
  function Worker(self) {
    var _this = this;

    _classCallCheck(this, Worker);

    this.self = self;
    this.actor = new _actor["default"](self, this);
    this.workerSourceTypes = {
      vector: _vector_tile_worker_source["default"]
    };
    this.workerSources = {};

    this.self.registerWorkerSource = function (name, WorkerSource) {
      if (_this.workerSourceTypes[name]) {
        throw new Error("Worker source with name \"".concat(name, "\" already registered."));
      }

      _this.workerSourceTypes[name] = WorkerSource;
    };

    this.layerStyles = {};
  }

  _createClass(Worker, [{
    key: "loadTile",
    value: function loadTile(mapId, params, callback) {
      this.getWorkerSource(mapId, params.type, params.sourceID).loadTile(params, callback);
    }
  }, {
    key: "abortTile",
    value: function abortTile(mapId, params, callback) {
      this.getWorkerSource(mapId, params.type, params.sourceID).abortTile(params, callback);
    }
  }, {
    key: "removeTile",
    value: function removeTile(mapId, params, callback) {
      this.getWorkerSource(mapId, params.type, params.sourceID).removeTile(params, callback);
    }
  }, {
    key: "setLayers",
    value: function setLayers(mapId, layercfgs, callback) {
      this.layerStyles[mapId] = layercfgs; // mapid layerID

      if (this.workerSources[mapId]) {
        for (var sourceId in this.workerSources[mapId].vector) {
          this.workerSources[mapId].vector[sourceId].layerStyle = layercfgs;
        }
      }

      callback();
    } // updateLayers(id, params, callback) {
    // }

    /**
     * 获取workerSource
     * @param {string} mapId WorkerPool Id
     * @param {string} type 瓦片类型 目前支持Vector
     * @param {string} source souce ID
     * @return {*} WorkerSource
     */

  }, {
    key: "getWorkerSource",
    value: function getWorkerSource(mapId, type, source) {
      var _this2 = this;

      if (!this.workerSources[mapId]) {
        this.workerSources[mapId] = {};
      }

      if (!this.workerSources[mapId][type]) {
        this.workerSources[mapId][type] = {};
      }

      if (!this.workerSources[mapId][type][source]) {
        // use a wrapped actor so that we can attach a target mapId param
        // to any messages invoked by the WorkerSource
        var actor = {
          send: function send(type, data, callback) {
            _this2.actor.send(type, data, callback, mapId);
          }
        };
        this.workerSources[mapId][type][source] = new this.workerSourceTypes[type](actor, this.layerStyles[mapId]);
      }

      return this.workerSources[mapId][type][source];
    }
  }]);

  return Worker;
}();

exports["default"] = Worker;
self.worker = new Worker(self);