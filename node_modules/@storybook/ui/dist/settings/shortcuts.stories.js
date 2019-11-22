"use strict";

require("core-js/modules/es.object.assign");

require("core-js/modules/es.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaults = exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _addonActions = require("@storybook/addon-actions");

var _shortcuts = _interopRequireDefault(require("./shortcuts"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var defaultShortcuts = {
  fullScreen: ['F'],
  togglePanel: ['A'],
  panelPosition: ['D'],
  toggleNav: ['S'],
  toolbar: ['T'],
  search: ['/'],
  focusNav: ['1'],
  focusIframe: ['2'],
  focusPanel: ['3'],
  prevComponent: ['alt', 'ArrowUp'],
  nextComponent: ['alt', 'ArrowDown'],
  prevStory: ['alt', 'ArrowLeft'],
  nextStory: ['alt', 'ArrowRight'],
  shortcutsPage: ['ctrl', 'shift', ','],
  aboutPage: [','],
  escape: ['escape'] // This one is not customizable

};
var actions = (0, _addonActions.actions)('setShortcut', 'restoreDefaultShortcut', 'restoreAllDefaultShortcuts', 'onClose');
var _default = {
  component: _shortcuts["default"],
  title: 'UI|Settings/ShortcutsScreen',
  decorators: [function (s) {
    return _react["default"].createElement("div", {
      style: {
        position: 'relative',
        height: 'calc(100vh)',
        width: 'calc(100vw)'
      }
    }, s());
  }]
};
exports["default"] = _default;

var defaults = function defaults() {
  return _react["default"].createElement(_shortcuts["default"], _extends({
    shortcutKeys: defaultShortcuts
  }, actions));
};

exports.defaults = defaults;
defaults.displayName = "defaults";
defaults.story = {
  name: 'default shortcuts'
};