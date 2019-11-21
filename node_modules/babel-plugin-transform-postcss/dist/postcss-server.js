'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._streams = exports.main = undefined;

var _net = require('net');

var _net2 = _interopRequireDefault(_net);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _postcss = require('postcss');

var _postcss2 = _interopRequireDefault(_postcss);

var _postcssLoadConfig = require('postcss-load-config');

var _postcssLoadConfig2 = _interopRequireDefault(_postcssLoadConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const debug = (0, _debug2.default)('babel-plugin-transform-postcss');
const streams = { stderr: process.stderr }; // overwritable by tests
const md5 = data => _crypto2.default.createHash('md5').update(data).digest('hex');
const error = (...args) => {
  let prefix = 'babel-plugin-transform-postcss: ';
  const message = _util2.default.format(...args);

  if (streams.stderr.isTTY) {
    prefix = `\x1b[31m${prefix}\x1b[0m`;
  }

  streams.stderr.write(`${prefix}${message}\n`);
};

const main = (() => {
  var _ref = _asyncToGenerator(function* (socketPath, tmpPath) {

    try {
      _fs2.default.mkdirSync(tmpPath);
    } // eslint-disable-line no-sync
    catch (err) {
      if (err.code !== 'EEXIST') {
        throw err;
      }
    }

    const options = { allowHalfOpen: true };
    const server = _net2.default.createServer(options, function (connection) {
      let data = '';

      connection.on('data', function (chunk) {
        data += chunk.toString('utf8');
      });

      connection.on('end', _asyncToGenerator(function* () {
        try {
          let tokens, cache;
          const { cssFile, config } = JSON.parse(data);
          const cachePath = `${_path2.default.join(tmpPath, cssFile.replace(/[^a-z]/ig, ''))}.cache`;
          const source = // eslint-disable-next-line no-sync
          _fs2.default.readFileSync(cssFile, 'utf8');
          const hash = md5(source);

          // eslint-disable-next-line no-sync
          try {
            cache = JSON.parse(_fs2.default.readFileSync(cachePath, 'utf8'));
          } catch (err) {
            if (err.code !== 'ENOENT') {
              throw err;
            }
          }

          if (cache && cache.hash === hash) {
            connection.end(JSON.stringify(cache.tokens));

            return;
          }

          const extractModules = function (_, resultTokens) {
            tokens = resultTokens;
          };

          let configPath = _path2.default.dirname(cssFile);

          if (config) {
            configPath = _path2.default.resolve(config);
          }

          const { plugins, options: postcssOpts } = yield (0, _postcssLoadConfig2.default)({ extractModules }, configPath);

          const runner = (0, _postcss2.default)(plugins);

          yield runner.process(source, Object.assign({
            from: cssFile,
            to: cssFile // eslint-disable-line id-length
          }, postcssOpts));

          cache = {
            hash,
            tokens
          };

          // eslint-disable-next-line no-sync
          _fs2.default.writeFileSync(cachePath, JSON.stringify(cache));

          connection.end(JSON.stringify(tokens));
        } catch (err) {
          error(err.stack);
          connection.end();
        }
      }));
    });

    if (_fs2.default.existsSync(socketPath)) {
      // eslint-disable-line no-sync
      error(`Server already running on socket ${socketPath}`);
      process.exit(1);

      return server; // tests can make it past process.exit
    }

    yield new Promise(function (resolve, reject) {
      server.on('error', function (err) {
        return reject(err);
      });
      server.on('listening', function () {
        const handler = function () {
          _fs2.default.unlinkSync(socketPath); // eslint-disable-line no-sync
        };

        server.on('close', function () {
          process.removeListener('exit', handler);
          process.removeListener('SIGINT', handler);
          process.removeListener('SIGTERM', handler);
        });

        process.on('exit', handler);
        process.on('SIGINT', handler);
        process.on('SIGTERM', handler);

        resolve();
      });

      server.listen(socketPath, function () {
        debug(`babel-plugin-transform-postcss server running on socket ${socketPath}`);
      });
    });

    return server;
  });

  function main(_x, _x2) {
    return _ref.apply(this, arguments);
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