'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._retries = exports._streams = exports.main = undefined;

var _net = require('net');

var _net2 = _interopRequireDefault(_net);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// exponential backoff, roughly 100ms-6s
const retries = [1, 2, 3, 4, 5].map(num => Math.exp(num) * 40);
const streams = { stdout: process.stdout }; // overwritable by tests

const communicate = (() => {
  var _ref = _asyncToGenerator(function* (socketPath, message) {
    yield new Promise(function (resolve, reject) {
      const client = _net2.default.connect(socketPath, function () {
        client.end(message);
        client.pipe(streams.stdout);
      });

      client.on('error', function (err) {
        return reject(err);
      });
      client.on('close', function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });

  function communicate(_x, _x2) {
    return _ref.apply(this, arguments);
  }

  return communicate;
})();

const main = (() => {
  var _ref2 = _asyncToGenerator(function* (...args) {
    try {
      yield communicate(...args);
    } catch (err) {
      const recoverable = err.code === 'ECONNREFUSED' || err.code === 'ENOENT';

      if (recoverable && retries.length) {
        yield new Promise(function (resolve, reject) {
          setTimeout(function () {
            main(...args).then(resolve, reject);
          }, retries.shift());
        });
      }
    }
  });

  function main() {
    return _ref2.apply(this, arguments);
  }

  return main;
})();

/* istanbul ignore if */
if (require.main === module) {
  _asyncToGenerator(function* () {
    try {
      yield main(...process.argv.slice(2));
    } catch (err) {
      process.stderr.write(`${err.stack}\n`);process.exit(1);
    }
  })();
}

exports.main = main;
exports._streams = streams;
exports._retries = retries;