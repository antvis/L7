"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _postcss = _interopRequireDefault(require("postcss"));

var _icssUtils = require("icss-utils");

var _loaderUtils = _interopRequireDefault(require("loader-utils"));

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const pluginName = 'postcss-icss-parser';

function hasImportMessage(messages, url) {
  return messages.find(message => message.pluginName === pluginName && message.type === 'import' && message.item.url === url && message.item.media === '');
}

var _default = _postcss.default.plugin(pluginName, (options = {}) => function process(css, result) {
  const importReplacements = Object.create(null);
  const {
    icssImports,
    icssExports
  } = (0, _icssUtils.extractICSS)(css);
  let index = 0;

  for (const importUrl of Object.keys(icssImports)) {
    const url = _loaderUtils.default.parseString(importUrl);

    for (const token of Object.keys(icssImports[importUrl])) {
      index += 1;
      importReplacements[token] = `___CSS_LOADER_IMPORT___${index}___`;
      result.messages.push({
        pluginName,
        type: 'icss-import',
        item: {
          url,
          export: icssImports[importUrl][token],
          index
        }
      });

      if (!hasImportMessage(result.messages, url)) {
        const media = '';
        const {
          loaderContext,
          importPrefix
        } = options;
        result.messages.push({
          pluginName,
          type: 'import',
          import: (0, _utils.getImportItemCode)({
            url,
            media
          }, loaderContext, importPrefix),
          item: {
            url,
            media
          }
        });
      }
    }
  }

  (0, _icssUtils.replaceSymbols)(css, importReplacements);

  for (const exportName of Object.keys(icssExports)) {
    const name = exportName;
    const value = (0, _icssUtils.replaceValueSymbols)(icssExports[name], importReplacements);
    result.messages.push({
      pluginName,
      export: (0, _utils.getExportItemCode)(name, value, options.localsConvention),
      type: 'export',
      item: {
        name,
        value
      }
    });
  }
});

exports.default = _default;