"use strict";

require("core-js/modules/es.object.assign");

require("core-js/modules/es.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _global = require("global");

var _react = _interopRequireDefault(require("react"));

var _router = require("@storybook/router");

var _api = require("@storybook/api");

var _shortcuts = _interopRequireDefault(require("./shortcuts"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var mapper = function mapper(_ref) {
  var api = _ref.api;
  return api;
};

var _default = function _default() {
  return _react["default"].createElement(_router.Route, {
    path: "shortcuts"
  }, _react["default"].createElement(_api.Consumer, {
    filter: mapper
  }, function (_ref2) {
    var getShortcutKeys = _ref2.getShortcutKeys,
        setShortcut = _ref2.setShortcut,
        restoreDefaultShortcut = _ref2.restoreDefaultShortcut,
        restoreAllDefaultShortcuts = _ref2.restoreAllDefaultShortcuts;
    return _react["default"].createElement(_router.Route, {
      path: "shortcuts"
    }, _react["default"].createElement(_shortcuts["default"], _extends({
      shortcutKeys: getShortcutKeys()
    }, {
      setShortcut: setShortcut,
      restoreDefaultShortcut: restoreDefaultShortcut,
      restoreAllDefaultShortcuts: restoreAllDefaultShortcuts
    }, {
      onClose: function onClose() {
        return _global.history.back();
      }
    })));
  }));
};

exports["default"] = _default;