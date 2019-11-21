import * as React from 'react';
import Button from '../button';

var Operation = function Operation(_ref) {
  var disabled = _ref.disabled,
      moveToLeft = _ref.moveToLeft,
      moveToRight = _ref.moveToRight,
      _ref$leftArrowText = _ref.leftArrowText,
      leftArrowText = _ref$leftArrowText === void 0 ? '' : _ref$leftArrowText,
      _ref$rightArrowText = _ref.rightArrowText,
      rightArrowText = _ref$rightArrowText === void 0 ? '' : _ref$rightArrowText,
      leftActive = _ref.leftActive,
      rightActive = _ref.rightActive,
      className = _ref.className,
      style = _ref.style;
  return React.createElement("div", {
    className: className,
    style: style
  }, React.createElement(Button, {
    type: "primary",
    size: "small",
    disabled: disabled || !rightActive,
    onClick: moveToRight,
    icon: "right"
  }, rightArrowText), React.createElement(Button, {
    type: "primary",
    size: "small",
    disabled: disabled || !leftActive,
    onClick: moveToLeft,
    icon: "left"
  }, leftArrowText));
};

export default Operation;
//# sourceMappingURL=operation.js.map
