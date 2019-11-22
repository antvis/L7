import * as React from 'react';
import classnames from 'classnames';
import { ConfigConsumer } from '../config-provider';
import Icon from '../icon';
import noFound from './noFound';
import serverError from './serverError';
import unauthorized from './unauthorized';
export var IconMap = {
  success: 'check-circle',
  error: 'close-circle',
  info: 'exclamation-circle',
  warning: 'warning'
};
export var ExceptionMap = {
  '404': noFound,
  '500': serverError,
  '403': unauthorized
}; // ExceptionImageMap keys

var ExceptionStatus = Object.keys(ExceptionMap);
/**
 * render icon
 * if ExceptionStatus includes ,render svg image
 * else render iconNode
 * @param prefixCls
 * @param {status, icon}
 */

var renderIcon = function renderIcon(prefixCls, _ref) {
  var status = _ref.status,
      icon = _ref.icon;
  var className = classnames("".concat(prefixCls, "-icon"));

  if (ExceptionStatus.includes(status)) {
    var SVGComponent = ExceptionMap[status];
    return React.createElement("div", {
      className: "".concat(className, " ").concat(prefixCls, "-image")
    }, React.createElement(SVGComponent, null));
  }

  var iconString = IconMap[status];
  var iconNode = icon || React.createElement(Icon, {
    type: iconString,
    theme: "filled"
  });
  return React.createElement("div", {
    className: className
  }, iconNode);
};

var renderExtra = function renderExtra(prefixCls, _ref2) {
  var extra = _ref2.extra;
  return extra && React.createElement("div", {
    className: "".concat(prefixCls, "-extra")
  }, extra);
};

var Result = function Result(props) {
  return React.createElement(ConfigConsumer, null, function (_ref3) {
    var getPrefixCls = _ref3.getPrefixCls;
    var customizePrefixCls = props.prefixCls,
        customizeClassName = props.className,
        subTitle = props.subTitle,
        title = props.title,
        style = props.style,
        children = props.children,
        status = props.status;
    var prefixCls = getPrefixCls('result', customizePrefixCls);
    var className = classnames(prefixCls, "".concat(prefixCls, "-").concat(status), customizeClassName);
    return React.createElement("div", {
      className: className,
      style: style
    }, renderIcon(prefixCls, props), React.createElement("div", {
      className: "".concat(prefixCls, "-title")
    }, title), subTitle && React.createElement("div", {
      className: "".concat(prefixCls, "-subtitle")
    }, subTitle), children && React.createElement("div", {
      className: "".concat(prefixCls, "-content")
    }, children), renderExtra(prefixCls, props));
  });
};

Result.defaultProps = {
  status: 'info'
};
Result.PRESENTED_IMAGE_403 = ExceptionMap[403];
Result.PRESENTED_IMAGE_404 = ExceptionMap[404];
Result.PRESENTED_IMAGE_500 = ExceptionMap[500];
export default Result;
//# sourceMappingURL=index.js.map
