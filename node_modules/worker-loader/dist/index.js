'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = loader;
exports.pitch = pitch;

var _options = require('./options.json');

var _options2 = _interopRequireDefault(_options);

var _loaderUtils = require('loader-utils');

var _loaderUtils2 = _interopRequireDefault(_loaderUtils);

var _schemaUtils = require('schema-utils');

var _schemaUtils2 = _interopRequireDefault(_schemaUtils);

var _NodeTargetPlugin = require('webpack/lib/node/NodeTargetPlugin');

var _NodeTargetPlugin2 = _interopRequireDefault(_NodeTargetPlugin);

var _SingleEntryPlugin = require('webpack/lib/SingleEntryPlugin');

var _SingleEntryPlugin2 = _interopRequireDefault(_SingleEntryPlugin);

var _WebWorkerTemplatePlugin = require('webpack/lib/webworker/WebWorkerTemplatePlugin');

var _WebWorkerTemplatePlugin2 = _interopRequireDefault(_WebWorkerTemplatePlugin);

var _workers = require('./workers/');

var _workers2 = _interopRequireDefault(_workers);

var _Error = require('./Error');

var _Error2 = _interopRequireDefault(_Error);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable
  import/first,
  import/order,
  comma-dangle,
  linebreak-style,
  no-param-reassign,
  no-underscore-dangle,
  prefer-destructuring
*/
function loader() {}

function pitch(request) {
  const options = _loaderUtils2.default.getOptions(this) || {};

  (0, _schemaUtils2.default)(_options2.default, options, 'Worker Loader');

  if (!this.webpack) {
    throw new _Error2.default({
      name: 'Worker Loader',
      message: 'This loader is only usable with webpack'
    });
  }

  this.cacheable(false);

  const cb = this.async();

  const filename = _loaderUtils2.default.interpolateName(this, options.name || '[hash].worker.js', {
    context: options.context || this.rootContext || this.options.context,
    regExp: options.regExp
  });

  const worker = {};

  worker.options = {
    filename,
    chunkFilename: `[id].${filename}`,
    namedChunkFilename: null
  };

  worker.compiler = this._compilation.createChildCompiler('worker', worker.options);

  // Tapable.apply is deprecated in tapable@1.0.0-x.
  // The plugins should now call apply themselves.
  new _WebWorkerTemplatePlugin2.default(worker.options).apply(worker.compiler);

  if (this.target !== 'webworker' && this.target !== 'web') {
    new _NodeTargetPlugin2.default().apply(worker.compiler);
  }

  new _SingleEntryPlugin2.default(this.context, `!!${request}`, 'main').apply(worker.compiler);

  const subCache = `subcache ${__dirname} ${request}`;

  worker.compilation = compilation => {
    if (compilation.cache) {
      if (!compilation.cache[subCache]) {
        compilation.cache[subCache] = {};
      }

      compilation.cache = compilation.cache[subCache];
    }
  };

  if (worker.compiler.hooks) {
    const plugin = { name: 'WorkerLoader' };

    worker.compiler.hooks.compilation.tap(plugin, worker.compilation);
  } else {
    worker.compiler.plugin('compilation', worker.compilation);
  }

  worker.compiler.runAsChild((err, entries, compilation) => {
    if (err) return cb(err);

    if (entries[0]) {
      worker.file = entries[0].files[0];

      worker.factory = (0, _workers2.default)(worker.file, compilation.assets[worker.file].source(), options);

      if (options.fallback === false) {
        delete this._compilation.assets[worker.file];
      }

      return cb(null, `module.exports = function() {\n  return ${worker.factory};\n};`);
    }

    return cb(null, null);
  });
}