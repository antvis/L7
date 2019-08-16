"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var WorkerPool =
/*#__PURE__*/
function () {
  function WorkerPool(workerCount) {
    _classCallCheck(this, WorkerPool);

    this.workerCount = workerCount || Math.max(Math.floor(window.navigator.hardwareConcurrency / 2), 1);
    this.workers = []; // worker线程池

    this.workerQueue = []; // 任务队列

    this._initWorker(); // 初始化线程池

  }

  _createClass(WorkerPool, [{
    key: "_initWorker",
    value: function _initWorker() {
      while (this.workers.length < this.workerCount) {
        this.workers.push(new Worker());
      }
    }
  }, {
    key: "runTask",
    value: function runTask(payload) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        if (_this.workers.length > 0) {
          var worker = _this.workers.shift(); // 从线程池取出一个worker


          worker.postMessage(payload); // 向线程发送数据

          var workerCallback = function workerCallback(e) {
            resolve(e.data); // 成功则返回数据
            // 移除事件监听

            worker.removeEventListener('message', workerCallback); // 重新放回线程池

            _this.workers.push(worker); // 如果任务队列的数据还有则从任务队列继续取数据执行任务


            if (_this.workerQueue.length > 0) {
              var queueData = _this.workerQueue.shift();

              _this.runTask(queueData.payload).then(function (data) {
                queueData.resolve(data);
              });
            }
          }; // 监听worker事件


          worker.addEventListener('message', workerCallback);
          worker.addEventListener('error', function (e) {
            reject('filename:' + e.filename + '\nmessage:' + e.message + '\nlineno:' + e.lineno);
          });
        } else {
          // 如果线程池都被占用，则将数据丢入任务队列，并保存对应的resolve和reject
          _this.workerQueue.push({
            payload: payload,
            resolve: resolve,
            reject: reject
          });
        }
      });
    }
  }, {
    key: "release",
    value: function release() {
      this.workers.forEach(function (worker) {
        worker.terminate();
      });
    }
  }]);

  return WorkerPool;
}();

var _default = WorkerPool;
exports["default"] = _default;