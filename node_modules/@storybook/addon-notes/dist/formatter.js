"use strict";

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.reduce");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.regexp.exec");

require("core-js/modules/es.string.match");

require("core-js/modules/es.string.replace");

require("core-js/modules/es.string.split");

require("core-js/modules/es.string.trim");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatter = void 0;

var _memoizerific = _interopRequireDefault(require("memoizerific"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var formatter = (0, _memoizerific["default"])(2)(function (code) {
  // code provided to the component is often coming from template literals, which preserve whitespace.
  // sometimes the first line doesn't have padding, but the second does.
  // we split the code-string into lines, then if we find padding on line 0 or 1,
  // we assume that padding is bad, and remove that much padding on all following lines
  return code.split(/\n/).reduce(function (acc, i, index) {
    var match = i.match(/^((:?\s|\t)+)/);
    var padding = match ? match[1] : '';

    if (acc.firstIndent === '' && padding && index < 3) {
      return {
        result: "".concat(acc.result, "\n").concat(i.replace(padding, '')),
        firstIndent: padding
      };
    }

    return {
      result: "".concat(acc.result, "\n").concat(i.replace(acc.firstIndent, '').replace(/\s*$/, '')),
      firstIndent: acc.firstIndent
    };
  }, {
    firstIndent: '',
    result: ''
  }).result.trim();
});
exports.formatter = formatter;