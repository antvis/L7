function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import * as React from 'react';
import classNames from 'classnames';

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
    className: classNames("".concat(prefixCls, "-item-label"), className, (_classNames = {}, _defineProperty(_classNames, "".concat(prefixCls, "-item-colon"), colon), _defineProperty(_classNames, "".concat(prefixCls, "-item-no-label"), !label), _classNames)),
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
      className: classNames("".concat(prefixCls, "-item-content"), className),
      key: "content",
      colSpan: span * 2 - 1
    }, children);
  }

  if (layout === 'vertical') {
    if (type === 'content') {
      return React.createElement("td", {
        colSpan: span,
        className: classNames("".concat(prefixCls, "-item"), className)
      }, React.createElement("span", {
        className: "".concat(prefixCls, "-item-content"),
        key: "content"
      }, children));
    }

    return React.createElement("td", {
      colSpan: span,
      className: classNames("".concat(prefixCls, "-item"), className)
    }, React.createElement("span", {
      className: classNames("".concat(prefixCls, "-item-label"), _defineProperty({}, "".concat(prefixCls, "-item-colon"), colon)),
      key: "label"
    }, label));
  }

  return React.createElement("td", {
    colSpan: span,
    className: classNames("".concat(prefixCls, "-item"), className)
  }, React.createElement("span", labelProps, label), React.createElement("span", {
    className: "".concat(prefixCls, "-item-content"),
    key: "content"
  }, children));
};

export default Col;
//# sourceMappingURL=Col.js.map
