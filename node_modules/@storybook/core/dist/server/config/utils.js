"use strict";

require("core-js/modules/es.array.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadEnv = loadEnv;
exports.excludePaths = exports.nodeModulesPaths = exports.includePaths = void 0;

var _path = _interopRequireDefault(require("path"));

var _lazyUniversalDotenv = require("lazy-universal-dotenv");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const includePaths = [_path.default.resolve('./')];
exports.includePaths = includePaths;

const nodeModulesPaths = _path.default.resolve('./node_modules');

exports.nodeModulesPaths = nodeModulesPaths;
const excludePaths = [nodeModulesPaths];
exports.excludePaths = excludePaths;

const nodePathsToArray = nodePath => nodePath.split(process.platform === 'win32' ? ';' : ':').filter(Boolean).map(p => _path.default.resolve('./', p)); // Load environment variables starts with STORYBOOK_ to the client side.


function loadEnv(options = {}) {
  const defaultNodeEnv = options.production ? 'production' : 'development';
  const env = {
    NODE_ENV: process.env.NODE_ENV || defaultNodeEnv,
    NODE_PATH: process.env.NODE_PATH || '',
    // This is to support CRA's public folder feature.
    // In production we set this to dot(.) to allow the browser to access these assets
    // even when deployed inside a subpath. (like in GitHub pages)
    // In development this is just empty as we always serves from the root.
    PUBLIC_URL: options.production ? '.' : ''
  };
  Object.keys(process.env).filter(name => /^STORYBOOK_/.test(name)).forEach(name => {
    env[name] = process.env[name];
  });
  const base = Object.entries(env).reduce((acc, [k, v]) => Object.assign(acc, {
    [k]: JSON.stringify(v)
  }), {});
  const {
    stringified,
    raw
  } = (0, _lazyUniversalDotenv.getEnvironment)({
    nodeEnv: env.NODE_ENV
  });
  const fullRaw = Object.assign({}, env, raw);
  fullRaw.NODE_PATH = nodePathsToArray(fullRaw.NODE_PATH || '');
  return {
    stringified: Object.assign({}, base, stringified),
    raw: fullRaw
  };
}