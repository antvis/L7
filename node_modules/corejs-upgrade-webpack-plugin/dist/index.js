"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = CoreJSUpgradeWebpackPlugin;
exports.rewriteCoreJsRequest = void 0;

var _webpack = require("webpack");

var _resolveFrom = _interopRequireDefault(require("resolve-from"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const rewriteAndPreservePrefix = (originalRequest, newPath, newModuleName = 'core-js') => {
  const result = originalRequest.match(/(.*\/)core-js\/.*/);
  const requestPrefix = result ? result[1] : '';
  return `${requestPrefix}${newModuleName}/${newPath}`;
};

const rewriteRenamedModules = path => {
  if (path === 'web.dom.iterable') {
    return path.replace('web.dom.', 'web.dom-collections.');
  }

  return path;
};

const rewriteCoreJsRequest = (originalRequest, lowerVersion = false) => {
  if (!originalRequest) {
    throw new Error('no originalRequest');
  }

  if (/core-js\/modules\/es(6|7)\.(.*)/.test(originalRequest)) {
    const [, matchedVersion, matchedPath] = originalRequest.match(/core-js\/modules\/es(6|7)\.(.*)/);
    const version = matchedVersion;
    const path = rewriteRenamedModules(matchedPath);

    if (version === '6' || lowerVersion) {
      return rewriteAndPreservePrefix(originalRequest, `modules/es.${path}`);
    }

    if (version === '7') {
      return rewriteAndPreservePrefix(originalRequest, `modules/esnext.${path}`);
    }
  }

  if (/core-js(?:\/library)?\/fn\/(.*)/.test(originalRequest)) {
    const [, matchedPath] = originalRequest.match(/core-js(?:\/library)?\/fn\/(.*)/);
    const path = rewriteRenamedModules(matchedPath);
    return rewriteAndPreservePrefix(originalRequest, `features/${path}`, 'core-js-pure');
  }

  if (/core-js\/es(5|6|7)(.*)/.test(originalRequest)) {
    const [, matchedVersion, matchedPath] = originalRequest.match(/core-js\/es(5|6|7)(.*)?/);
    const version = matchedVersion;

    if (version === '5') {
      return null;
    }

    if (version === '6' || lowerVersion) {
      const asAModule = matchedPath.replace('.js', '');
      const path = rewriteRenamedModules(asAModule);
      return rewriteAndPreservePrefix(originalRequest, `es${path}`);
    }

    if (version === '7') {
      return null;
    }
  }

  if (/core-js\/(object)\/(.*)/.test(originalRequest)) {
    const [, matchedPath] = originalRequest.match(/core-js\/(.*)?/);
    const path = rewriteRenamedModules(matchedPath);
    return rewriteAndPreservePrefix(originalRequest, `features/${path}`);
  }

  return originalRequest;
};

exports.rewriteCoreJsRequest = rewriteCoreJsRequest;
const defaultOptions = {
  resolveFrom: false
};

function CoreJSUpgradeWebpackPlugin(options) {
  options = Object.assign({}, defaultOptions, options || {});
  const resolve = options.resolveFrom ? _resolveFrom.default.bind(null, options.resolveFrom) : require.resolve;
  return new _webpack.NormalModuleReplacementPlugin(/core-js/, resource => {
    const originalRequest = resource.userRequest || resource.request;

    if (originalRequest.startsWith('./') || originalRequest.startsWith('../')) {
      return;
    }

    if (originalRequest.match(/@babel\/runtime\/core-js/)) {
      return;
    }

    try {
      require.resolve(originalRequest);
    } catch (originalError) {
      let error = true; // attempt to upgrade the path from core-js v2 to v3

      if (error) {
        try {
          // eslint-disable-next-line no-param-reassign
          resource.request = resolve(rewriteCoreJsRequest(originalRequest));
          error = false;
        } catch (e) {}
      } // attempt to downgrade the path from es7 to es6


      if (error) {
        try {
          // eslint-disable-next-line no-param-reassign
          resource.request = resolve(rewriteCoreJsRequest(originalRequest, true));
          error = false;
        } catch (e) {}
      }

      if (error) {
        throw originalError;
      }
    }
  });
}

;