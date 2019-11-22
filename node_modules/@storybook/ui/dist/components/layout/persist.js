"use strict";

require("core-js/modules/es.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.set = exports.get = void 0;

var _store = _interopRequireDefault(require("store2"));

var _debounce = _interopRequireDefault(require("lodash/debounce"));

var _memoizerific = _interopRequireDefault(require("memoizerific"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var get = function get() {
  try {
    var data = _store["default"].local.get("storybook-layout");

    return data || false;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return false;
  }
};

exports.get = get;
var write = (0, _memoizerific["default"])(1)(function (changes) {
  try {
    _store["default"].local.set("storybook-layout", changes);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }
});
var set = (0, _debounce["default"])(write, 500);
exports.set = set;