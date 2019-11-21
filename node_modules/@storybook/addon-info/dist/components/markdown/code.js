"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.array.index-of");

require("core-js/modules/es.object.assign");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.keys");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Blockquote = Blockquote;
Object.defineProperty(exports, "Pre", {
  enumerable: true,
  get: function get() {
    return _pre["default"];
  }
});
exports.Code = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _components = require("@storybook/components");

var _theming = require("@storybook/theming");

var _pre = _interopRequireDefault(require("./pre/pre"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var Code = function Code(_ref) {
  var code = _ref.code,
      _ref$language = _ref.language,
      language = _ref$language === void 0 ? 'plaintext' : _ref$language,
      rest = _objectWithoutProperties(_ref, ["code", "language"]);

  return _react["default"].createElement(_theming.ThemeProvider, {
    theme: (0, _theming.convert)()
  }, _react["default"].createElement(_components.SyntaxHighlighter, _extends({
    bordered: true,
    copyable: true,
    format: false,
    language: language
  }, rest), code));
};

exports.Code = Code;
Code.propTypes = {
  language: _propTypes["default"].string.isRequired,
  code: _propTypes["default"].string.isRequired
};

function Blockquote(_ref2) {
  var children = _ref2.children;
  var style = {
    fontSize: '1.88em',
    fontFamily: 'Menlo, Monaco, "Courier New", monospace',
    borderLeft: '8px solid #fafafa',
    padding: '1rem'
  };
  return _react["default"].createElement("blockquote", {
    style: style
  }, children);
}

Blockquote.propTypes = {
  children: _propTypes["default"].node
};
Blockquote.defaultProps = {
  children: null
};