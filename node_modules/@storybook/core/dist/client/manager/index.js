"use strict";

var _global = require("global");

var _ui = _interopRequireDefault(require("@storybook/ui"));

var _provider = _interopRequireDefault(require("./provider"));

var _conditionalPolyfills = require("./conditional-polyfills");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

(0, _conditionalPolyfills.importPolyfills)().then(function () {
  var rootEl = _global.document.getElementById('root');

  (0, _ui["default"])(rootEl, new _provider["default"]());
});