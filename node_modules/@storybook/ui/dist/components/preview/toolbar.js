"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.array.index-of");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.keys");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Toolbar = void 0;

var _react = _interopRequireDefault(require("react"));

var _theming = require("@storybook/theming");

var _components = require("@storybook/components");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var Toolbar = (0, _theming.styled)(function (_ref) {
  var shown = _ref.shown,
      props = _objectWithoutProperties(_ref, ["shown"]);

  return _react["default"].createElement(_components.FlexBar, props);
})({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  transition: 'transform .2s linear'
}, function (_ref2) {
  var shown = _ref2.shown;
  return {
    tranform: shown ? 'translateY(0px)' : 'translateY(-40px)'
  };
});
exports.Toolbar = Toolbar;