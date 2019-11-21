"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.hiddenGuard = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var hiddenGuard = {
  width: '1px',
  height: '0px',
  padding: 0,
  overflow: 'hidden',
  position: 'fixed',
  top: '1px',
  left: '1px'
};
exports.hiddenGuard = hiddenGuard;

var InFocusGuard = function InFocusGuard(_ref) {
  var children = _ref.children;
  return _react.default.createElement(_react.default.Fragment, null, _react.default.createElement("div", {
    key: "guard-first",
    "data-focus-guard": true,
    "data-focus-auto-guard": true,
    style: hiddenGuard
  }), children, children && _react.default.createElement("div", {
    key: "guard-last",
    "data-focus-guard": true,
    "data-focus-auto-guard": true,
    style: hiddenGuard
  }));
};

InFocusGuard.propTypes = process.env.NODE_ENV !== "production" ? {
  children: _propTypes.default.node
} : {};
InFocusGuard.defaultProps = {
  children: null
};
var _default = InFocusGuard;
exports.default = _default;