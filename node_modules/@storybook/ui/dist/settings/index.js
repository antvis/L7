"use strict";

require("core-js/modules/es.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _about_page = _interopRequireDefault(require("./about_page"));

var _shortcuts_page = _interopRequireDefault(require("./shortcuts_page"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _ref =
/*#__PURE__*/
_react["default"].createElement(_about_page["default"], {
  key: "about"
});

var _ref2 =
/*#__PURE__*/
_react["default"].createElement(_shortcuts_page["default"], {
  key: "shortcuts"
});

var SettingsPages = function SettingsPages() {
  return [_ref, _ref2];
};

exports["default"] = SettingsPages;