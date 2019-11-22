'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _decoder = require('./decoder.worker');

var _decoder2 = _interopRequireDefault(_decoder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultPoolSize = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency : null;

/**
 * @module pool
 */

/**
 * Pool for workers to decode chunks of the images.
 */

var Pool = function () {
  /**
   * @constructor
   * @param {Number} size The size of the pool. Defaults to the number of CPUs
   *                      available. When this parameter is `null` or 0, then the
   *                      decoding will be done in the main thread.
   */
  function Pool() {
    var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultPoolSize;
    (0, _classCallCheck3.default)(this, Pool);

    this.workers = [];
    this.idleWorkers = [];
    this.waitQueue = [];
    this.decoder = null;

    for (var i = 0; i < size; ++i) {
      var w = new _decoder2.default();
      this.workers.push(w);
      this.idleWorkers.push(w);
    }
  }

  /**
   * Decode the given block of bytes with the set compression method.
   * @param {ArrayBuffer} buffer the array buffer of bytes to decode.
   * @returns {Promise.<ArrayBuffer>} the decoded result as a `Promise`
   */


  (0, _createClass3.default)(Pool, [{
    key: 'decode',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(fileDirectory, buffer) {
        var _this = this;

        var currentWorker;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.waitForWorker();

              case 2:
                currentWorker = _context.sent;
                return _context.abrupt('return', new Promise(function (resolve, reject) {
                  currentWorker.onmessage = function (event) {
                    // this.workers.push(currentWorker);
                    _this.finishTask(currentWorker);
                    resolve(event.data[0]);
                  };
                  currentWorker.onerror = function (error) {
                    // this.workers.push(currentWorker);
                    _this.finishTask(currentWorker);
                    reject(error);
                  };
                  currentWorker.postMessage(['decode', fileDirectory, buffer], [buffer]);
                }));

              case 4:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function decode(_x2, _x3) {
        return _ref.apply(this, arguments);
      }

      return decode;
    }()
  }, {
    key: 'waitForWorker',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
        var idleWorker, waiter, promise;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                idleWorker = this.idleWorkers.pop();

                if (!idleWorker) {
                  _context2.next = 3;
                  break;
                }

                return _context2.abrupt('return', idleWorker);

              case 3:
                waiter = {};
                promise = new Promise(function (resolve) {
                  waiter.resolve = resolve;
                });


                this.waitQueue.push(waiter);
                return _context2.abrupt('return', promise);

              case 7:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function waitForWorker() {
        return _ref2.apply(this, arguments);
      }

      return waitForWorker;
    }()
  }, {
    key: 'finishTask',
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(currentWorker) {
        var waiter;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                waiter = this.waitQueue.pop();

                if (waiter) {
                  waiter.resolve(currentWorker);
                } else {
                  this.idleWorkers.push(currentWorker);
                }

              case 2:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function finishTask(_x4) {
        return _ref3.apply(this, arguments);
      }

      return finishTask;
    }()
  }, {
    key: 'destroy',
    value: function destroy() {
      for (var i = 0; i < this.workers.length; ++i) {
        this.workers[i].terminate();
      }
    }
  }]);
  return Pool;
}();

exports.default = Pool;