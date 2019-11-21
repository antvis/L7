"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = loader;

var _schemaUtils = _interopRequireDefault(require("schema-utils"));

var _postcss = _interopRequireDefault(require("postcss"));

var _package = _interopRequireDefault(require("postcss/package.json"));

var _loaderUtils = require("loader-utils");

var _options = _interopRequireDefault(require("./options.json"));

var _plugins = require("./plugins");

var _utils = require("./utils");

var _Warning = _interopRequireDefault(require("./Warning"));

var _CssSyntaxError = _interopRequireDefault(require("./CssSyntaxError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
function loader(content, map, meta) {
  const options = (0, _loaderUtils.getOptions)(this) || {};
  (0, _schemaUtils.default)(_options.default, options, {
    name: 'CSS Loader',
    baseDataPath: 'options'
  });
  const callback = this.async();
  const sourceMap = options.sourceMap || false; // Some loaders (example `"postcss-loader": "1.x.x"`) always generates source map, we should remove it
  // eslint-disable-next-line no-param-reassign

  map = sourceMap && map ? (0, _utils.normalizeSourceMap)(map) : null; // Reuse CSS AST (PostCSS AST e.g 'postcss-loader') to avoid reparsing

  if (meta) {
    const {
      ast
    } = meta;

    if (ast && ast.type === 'postcss' && ast.version === _package.default.version) {
      // eslint-disable-next-line no-param-reassign
      content = ast.root;
    }
  }

  const plugins = [];

  if (options.modules) {
    plugins.push(...(0, _utils.getModulesPlugins)(options, this));
  } // Run other loader (`postcss-loader`, `sass-loader` and etc) for importing CSS


  const importPrefix = (0, _utils.getImportPrefix)(this, options.importLoaders);
  plugins.push((0, _plugins.icssParser)({
    loaderContext: this,
    importPrefix,
    localsConvention: options.localsConvention
  }));

  if (options.import !== false) {
    plugins.push((0, _plugins.importParser)({
      loaderContext: this,
      importPrefix,
      filter: (0, _utils.getFilter)(options.import, this.resourcePath)
    }));
  }

  if (options.url !== false) {
    plugins.push((0, _plugins.urlParser)({
      loaderContext: this,
      filter: (0, _utils.getFilter)(options.url, this.resourcePath, value => (0, _loaderUtils.isUrlRequest)(value))
    }));
  }

  (0, _postcss.default)(plugins).process(content, {
    from: (0, _loaderUtils.getRemainingRequest)(this).split('!').pop(),
    to: (0, _loaderUtils.getCurrentRequest)(this).split('!').pop(),
    map: options.sourceMap ? {
      prev: map,
      inline: false,
      annotation: false
    } : null
  }).then(result => {
    result.warnings().forEach(warning => this.emitWarning(new _Warning.default(warning)));

    if (!result.messages) {
      // eslint-disable-next-line no-param-reassign
      result.messages = [];
    }

    const {
      onlyLocals
    } = options;
    const importItems = result.messages.filter(message => message.type === 'import' ? message : false).reduce((accumulator, currentValue) => {
      accumulator.push(currentValue.import);
      return accumulator;
    }, []);
    const exportItems = result.messages.filter(message => message.type === 'export' ? message : false).reduce((accumulator, currentValue) => {
      accumulator.push(currentValue.export);
      return accumulator;
    }, []);
    const importCode = (0, _utils.getImportCode)(importItems, onlyLocals);
    const moduleCode = (0, _utils.getModuleCode)(result, sourceMap, onlyLocals);
    const exportCode = (0, _utils.getExportCode)(exportItems, onlyLocals);
    const apiCode = (0, _utils.getApiCode)(this, sourceMap, onlyLocals);
    return callback(null, (0, _utils.prepareCode)({
      apiCode,
      importCode,
      moduleCode,
      exportCode
    }, result.messages, this, importPrefix, onlyLocals));
  }).catch(error => {
    callback(error.name === 'CssSyntaxError' ? new _CssSyntaxError.default(error) : error);
  });
}