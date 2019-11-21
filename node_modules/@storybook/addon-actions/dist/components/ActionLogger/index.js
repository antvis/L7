"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.array.index-of");

require("core-js/modules/es.array.map");

require("core-js/modules/es.function.name");

require("core-js/modules/es.object.assign");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.get-own-property-descriptor");

require("core-js/modules/es.object.keys");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ActionLogger = exports.Wrapper = void 0;

var _react = _interopRequireWildcard(require("react"));

var _theming = require("@storybook/theming");

var _reactInspector = _interopRequireDefault(require("react-inspector"));

var _components = require("@storybook/components");

var _style = require("./style");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var Wrapper = (0, _theming.styled)(function (_ref) {
  var children = _ref.children,
      className = _ref.className;
  return _react["default"].createElement(_components.ScrollArea, {
    horizontal: true,
    vertical: true,
    className: className
  }, children);
})({
  margin: 0,
  padding: '10px 5px 20px'
});
exports.Wrapper = Wrapper;
var ThemedInspector = (0, _theming.withTheme)(function (_ref2) {
  var theme = _ref2.theme,
      props = _objectWithoutProperties(_ref2, ["theme"]);

  return _react["default"].createElement(_reactInspector["default"], _extends({
    theme: theme.addonActionsTheme || 'chromeLight'
  }, props));
});

var ActionLogger = function ActionLogger(_ref3) {
  var actions = _ref3.actions,
      onClear = _ref3.onClear;
  return _react["default"].createElement(_react.Fragment, null, _react["default"].createElement(Wrapper, {
    title: "actionslogger"
  }, actions.map(function (action) {
    return _react["default"].createElement(_style.Action, {
      key: action.id
    }, action.count > 1 && _react["default"].createElement(_style.Counter, null, action.count), _react["default"].createElement(_style.InspectorContainer, null, _react["default"].createElement(ThemedInspector, {
      sortObjectKeys: true,
      showNonenumerable: false,
      name: action.data.name,
      data: action.data.args || action.data
    })));
  })), _react["default"].createElement(_components.ActionBar, {
    actionItems: [{
      title: 'Clear',
      onClick: onClear
    }]
  }));
};

exports.ActionLogger = ActionLogger;