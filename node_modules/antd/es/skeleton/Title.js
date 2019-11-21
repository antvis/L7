function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

/* eslint-disable jsx-a11y/heading-has-content */
import * as React from 'react';
import classNames from 'classnames';

var Title = function Title(_ref) {
  var prefixCls = _ref.prefixCls,
      className = _ref.className,
      width = _ref.width,
      style = _ref.style;
  return React.createElement("h3", {
    className: classNames(prefixCls, className),
    style: _extends({
      width: width
    }, style)
  });
};

export default Title;
//# sourceMappingURL=Title.js.map
