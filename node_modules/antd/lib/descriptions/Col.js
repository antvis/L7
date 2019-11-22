"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var React = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Col = function Col(props) {
  var _classNames;

  var child = props.child,
      bordered = props.bordered,
      colon = props.colon,
      type = props.type,
      layout = props.layout;
  var _child$props = child.props,
      prefixCls = _child$props.prefixCls,
      label = _child$props.label,
      className = _child$props.className,
      children = _child$props.children,
      _child$props$span = _child$props.span,
      span = _child$props$span === void 0 ? 1 : _child$props$span;
  var labelProps = {
    className: (0, _classnames["default"])("".concat(prefixCls, "-item-label"), className, (_classNames = {}, _defineProperty(_classNames, "".concat(prefixCls, "-item-colon"), colon), _defineProperty(_classNames, "".concat(prefixCls, "-item-no-label"), !label), _classNames)),
    key: 'label'
  };

  if (layout === 'vertical') {
    labelProps.colSpan = span * 2 - 1;
  }

  if (bordered) {
    if (type === 'label') {
      return React.createElement("th", labelProps, label);
    }

    return React.createElement("td", {
      className: (0, _classnames["default"])("".concat(prefixCls, "-item-content"), className),
      key: "content",
      colSpan: span * 2 - 1
    }, children);
  }

  if (layout === 'vertical') {
    if (type === 'content') {
      return React.createElement("td", {
        colSpan: span,
        className: (0, _classnames["default"])("".concat(prefixCls, "-item"), className)
      }, React.createElement("span", {
        className: "".concat(prefixCls, "-item-content"),
        key: "content"
      }, children));
    }

    return React.createElement("td", {
      colSpan: span,
      className: (0, _classnames["default"])("".concat(prefixCls, "-item"), className)
    }, React.createElement("span", {
      className: (0, _classnames["default"])("".concat(prefixCls, "-item-label"), _defineProperty({}, "".concat(prefixCls, "-item-colon"), colon)),
      key: "label"
    }, label));
  }

  return React.createElement("td", {
    colSpan: span,
    className: (0, _classnames["default"])("".concat(prefixCls, "-item"), className)
  }, React.createElement("span", labelProps, label), React.createElement("span", {
    className: "".concat(prefixCls, "-item-content"),
    key: "content"
  }, children));
};

var _default = Col;
exports["default"] = _default;
//# sourceMappingURL=Col.js.map
