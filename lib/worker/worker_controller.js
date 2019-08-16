"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _actor = _interopRequireDefault(require("./actor"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var id = 1;

function asyncAll(array, fn, callback) {
  if (!array.length) {
    return callback(null, []);
  }

  var remaining = array.length;
  var results = new Array(array.length);
  var error = null;
  array.forEach(function (item, i) {
    fn(item, function (err, result) {
      if (err) error = err;
      results[i] = result;
      if (--remaining === 0) callback(error, results);
    });
  });
}

var WorkerController =
/*#__PURE__*/
function () {
  function WorkerController(workerPool, parent) {
    _classCallCheck(this, WorkerController);

    this.workerPool = workerPool;
    this.actors = [];
    this.currentActor = 0;
    this.id = id++;
    var workers = this.workerPool.acquire(this.id);

    for (var i = 0; i < workers.length; i++) {
      var worker = workers[i];
      var actor = new WorkerController.Actor(worker, parent, this.id);
      actor.name = "Worker ".concat(i);
      this.actors.push(actor);
    }
  }
  /**
   * Broadcast a message to all Workers.
   */


  _createClass(WorkerController, [{
    key: "broadcast",
    value: function broadcast(type, data, cb) {
      cb = cb || function () {};

      asyncAll(this.actors, function (actor, done) {
        actor.send(type, data, done);
      }, cb);
    }
  }, {
    key: "send",
    value: function send(type, data, callback, targetID) {
      if (typeof targetID !== 'number' || isNaN(targetID)) {
        // Use round robin to send requests to web workers.
        targetID = this.currentActor = (this.currentActor + 1) % this.actors.length;
      }

      this.actors[targetID].send(type, data, callback, targetID);
      return targetID;
    }
  }, {
    key: "remove",
    value: function remove() {
      this.actors.forEach(function (actor) {
        actor.remove();
      });
      this.actors = [];
      this.workerPool.release(this.id);
    }
  }]);

  return WorkerController;
}();

exports["default"] = WorkerController;
WorkerController.Actor = _actor["default"];