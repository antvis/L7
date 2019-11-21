"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.array.index-of");

require("core-js/modules/es.object.assign");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.keys");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Icons = void 0;

var _react = _interopRequireDefault(require("react"));

var _theming = require("@storybook/theming");

var _icons = _interopRequireDefault(require("./icons"));

var _svg = _interopRequireDefault(require("./svg"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var Path = _theming.styled.path({
  fill: 'currentColor'
});

// TODO: if we can resize the 1024 to 20, we can remove the size attributes
var Icons = function Icons(_ref) {
  var icon = _ref.icon,
      props = _objectWithoutProperties(_ref, ["icon"]);

  return _react["default"].createElement(_svg["default"], _extends({
    viewBox: "0 0 1024 1024"
  }, props), _react["default"].createElement(Path, {
    d: _icons["default"][icon]
  }));
};

exports.Icons = Icons;
Icons.displayName = "Icons";