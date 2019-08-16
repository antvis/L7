"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _worker_transform = require("./worker_transform");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function bindAll(fns, context) {
  fns.forEach(function (fn) {
    if (!context[fn]) {
      return;
    }

    context[fn] = context[fn].bind(context);
  });
}

var Actor =
/*#__PURE__*/
function () {
  function Actor(target, parent, mapId) {
    _classCallCheck(this, Actor);

    this.target = target;
    this.parent = parent;
    this.mapId = mapId;
    this.callbacks = {};
    this.callbackID = 0;
    bindAll(['receive'], this);
    this.target.addEventListener('message', this.receive, false);
  }

  _createClass(Actor, [{
    key: "send",
    value: function send(type, data, callback, targetMapId) {
      var _this = this;

      var id = callback ? "".concat(this.mapId, "_").concat(this.callbackID++) : null;
      if (callback) this.callbacks[id] = callback;
      var buffer = [];
      this.target.postMessage({
        targetMapId: targetMapId,
        sourceMapId: this.mapId,
        type: type,
        id: String(id),
        data: data
      }, buffer);

      if (callback) {
        return {
          cancel: function cancel() {
            return _this.target.postMessage({
              targetMapId: targetMapId,
              sourceMapId: _this.mapId,
              type: '<cancel>',
              id: String(id)
            });
          }
        };
      }
    }
  }, {
    key: "receive",
    value: function receive(message) {
      var _this2 = this;

      // TODO 处理中断Worker
      var data = message.data;
      var id = data.id;
      var callback;

      var done = function done(err, data) {
        delete _this2.callbacks[id];
        var buffers = [];

        _this2.target.postMessage({
          // 发送结果数据
          sourceMapId: _this2.mapId,
          type: '<response>',
          id: String(id),
          error: err ? JSON.stringify(err) : null,
          data: (0, _worker_transform.serialize)(data, buffers)
        }, buffers);
      };

      if (data.type === '<response>' || data.type === '<cancel>') {
        callback = this.callbacks[data.id];
        delete this.callbacks[data.id];

        if (callback && data.error) {
          callback(data.error);
        } else if (callback) {
          callback(null, data.data);
        }
      } else if (typeof data.id !== 'undefined' && this.parent[data.type]) {
        // loadTile
        this.parent[data.type](data.sourceMapId, data.data, done);
      } else if (typeof data.id !== 'undefined' && this.parent.getWorkerSource) {
        var keys = data.type.split('.');
        var params = data.data;
        var workerSource = this.parent.getWorkerSource(data.sourceMapId, keys[0], params.source);
        workerSource[keys[1]](params, done);
      } else {
        this.parent[data.type](data.data);
      }
    }
  }]);

  return Actor;
}();

exports["default"] = Actor;