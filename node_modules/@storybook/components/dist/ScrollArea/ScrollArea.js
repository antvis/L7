"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.array.index-of");

require("core-js/modules/es.object.assign");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.get-own-property-descriptor");

require("core-js/modules/es.object.keys");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ScrollArea = void 0;

var _react = _interopRequireWildcard(require("react"));

var _theming = require("@storybook/theming");

var _simplebarReact = _interopRequireDefault(require("simplebar-react"));

var _ScrollAreaStyles = require("./ScrollAreaStyles");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var Scroll = (0, _theming.styled)(function (_ref) {
  var vertical = _ref.vertical,
      horizontal = _ref.horizontal,
      rest = _objectWithoutProperties(_ref, ["vertical", "horizontal"]);

  return _react["default"].createElement(_simplebarReact["default"], rest);
})(function (_ref2) {
  var vertical = _ref2.vertical;
  return !vertical ? {
    overflowY: 'hidden'
  } : {
    overflowY: 'auto',
    height: '100%'
  };
}, function (_ref3) {
  var horizontal = _ref3.horizontal;
  return !horizontal ? {
    overflowX: 'hidden'
  } : {
    overflowX: 'auto',
    width: '100%'
  };
});

var _ref5 =
/*#__PURE__*/
_react["default"].createElement(_theming.Global, {
  styles: _ScrollAreaStyles.getScrollAreaStyles
});

var ScrollArea = function ScrollArea(_ref4) {
  var children = _ref4.children,
      vertical = _ref4.vertical,
      horizontal = _ref4.horizontal,
      props = _objectWithoutProperties(_ref4, ["children", "vertical", "horizontal"]);

  return _react["default"].createElement(_react.Fragment, null, _ref5, _react["default"].createElement(Scroll, _extends({
    vertical: vertical,
    horizontal: horizontal
  }, props), children));
};

exports.ScrollArea = ScrollArea;
ScrollArea.displayName = "ScrollArea";
ScrollArea.defaultProps = {
  horizontal: false,
  vertical: false
};