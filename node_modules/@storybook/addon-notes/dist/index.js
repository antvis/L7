"use strict";

require("core-js/modules/es.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withMarkdownNotes = exports.withNotes = void 0;

var _addons = require("@storybook/addons");

var _utilDeprecate = _interopRequireDefault(require("util-deprecate"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// todo resolve any after @storybook/addons and @storybook/channels are migrated to TypeScript
var withNotes = (0, _addons.makeDecorator)({
  name: 'withNotes',
  parameterName: 'notes',
  skipIfNoParametersOrOptions: true,
  allowDeprecatedUsage: true,
  wrapper: (0, _utilDeprecate["default"])(function (getStory, context, _ref) {
    var options = _ref.options,
        parameters = _ref.parameters;
    var storyOptions = parameters || options;

    var _ref2 = typeof storyOptions === 'string' ? {
      text: storyOptions,
      markdown: undefined
    } : storyOptions,
        text = _ref2.text,
        markdown = _ref2.markdown;

    if (!text && !markdown) {
      throw new Error("Parameter 'notes' must must be a string or an object with 'text' or 'markdown' properties");
    }

    return getStory(context);
  }, 'withNotes is deprecated')
});
exports.withNotes = withNotes;
var withMarkdownNotes = (0, _utilDeprecate["default"])(function (text, options) {}, 'withMarkdownNotes is deprecated');
exports.withMarkdownNotes = withMarkdownNotes;

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}