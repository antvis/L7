"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _postcss = _interopRequireDefault(require("postcss"));

var _postcssValueParser = _interopRequireDefault(require("postcss-value-parser"));

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const pluginName = 'postcss-url-parser';
const isUrlFunc = /url/i;
const isImageSetFunc = /^(?:-webkit-)?image-set$/i;
const needParseDecl = /(?:url|(?:-webkit-)?image-set)\(/i;

function getNodeFromUrlFunc(node) {
  return node.nodes && node.nodes[0];
}

function getUrlFromUrlFunc(node) {
  return node.nodes.length !== 0 && node.nodes[0].type === 'string' ? node.nodes[0].value : _postcssValueParser.default.stringify(node.nodes);
}

function walkUrls(parsed, callback) {
  parsed.walk(node => {
    if (node.type !== 'function') {
      return;
    }

    if (isUrlFunc.test(node.value)) {
      callback(getNodeFromUrlFunc(node), getUrlFromUrlFunc(node), false); // Do not traverse inside `url`
      // eslint-disable-next-line consistent-return

      return false;
    }

    if (isImageSetFunc.test(node.value)) {
      node.nodes.forEach(nNode => {
        if (nNode.type === 'function' && isUrlFunc.test(nNode.value)) {
          callback(getNodeFromUrlFunc(nNode), getUrlFromUrlFunc(nNode), false);
        }

        if (nNode.type === 'string') {
          callback(nNode, nNode.value, true);
        }
      }); // Do not traverse inside `image-set`
      // eslint-disable-next-line consistent-return

      return false;
    }
  });
}

function getUrlsFromValue(value, result, filter, decl = null) {
  if (!needParseDecl.test(value)) {
    return;
  }

  const parsed = (0, _postcssValueParser.default)(value);
  const urls = [];
  walkUrls(parsed, (node, url, needQuotes) => {
    if (url.trim().replace(/\\[\r\n]/g, '').length === 0) {
      result.warn(`Unable to find uri in '${decl ? decl.toString() : value}'`, decl ? {
        node: decl
      } : {});
      return;
    }

    if (filter && !filter(url)) {
      return;
    }

    urls.push({
      url,
      needQuotes
    });
  }); // eslint-disable-next-line consistent-return

  return {
    parsed,
    urls
  };
}

function walkDeclsWithUrl(css, result, filter) {
  const items = [];
  css.walkDecls(decl => {
    const item = getUrlsFromValue(decl.value, result, filter, decl);

    if (!item) {
      return;
    }

    if (item.urls.length === 0) {
      return;
    }

    items.push({
      decl,
      parsed: item.parsed,
      urls: item.urls
    });
  });
  return items;
}

var _default = _postcss.default.plugin(pluginName, (options = {}) => function process(css, result) {
  const traversed = walkDeclsWithUrl(css, result, options.filter);
  const paths = (0, _utils.uniqWith)((0, _utils.flatten)(traversed.map(item => item.urls)), (value, other) => value.url === other.url && value.needQuotes === other.needQuotes);

  if (paths.length === 0) {
    return;
  }

  const placeholders = [];
  let hasUrlHelper = false;
  paths.forEach((path, index) => {
    const {
      loaderContext
    } = options;
    const placeholder = `___CSS_LOADER_URL___${index}___`;
    const {
      url,
      needQuotes
    } = path;
    placeholders.push({
      placeholder,
      path
    });

    if (!hasUrlHelper) {
      result.messages.push({
        pluginName,
        type: 'import',
        import: (0, _utils.getUrlHelperCode)(loaderContext)
      }); // eslint-disable-next-line no-param-reassign

      hasUrlHelper = true;
    }

    result.messages.push({
      pluginName,
      type: 'import',
      import: (0, _utils.getUrlItemCode)({
        url,
        placeholder,
        needQuotes
      }, loaderContext),
      importType: 'url',
      placeholder
    });
  });
  traversed.forEach(item => {
    walkUrls(item.parsed, (node, url, needQuotes) => {
      const value = placeholders.find(placeholder => placeholder.path.url === url && placeholder.path.needQuotes === needQuotes);

      if (!value) {
        return;
      }

      const {
        placeholder
      } = value; // eslint-disable-next-line no-param-reassign

      node.type = 'word'; // eslint-disable-next-line no-param-reassign

      node.value = placeholder;
    }); // eslint-disable-next-line no-param-reassign

    item.decl.value = item.parsed.toString();
  });
});

exports.default = _default;