import _extends from 'babel-runtime/helpers/extends';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
/* eslint-disable react/prop-types */
import React from 'react';

var Track = function Track(props) {
  var _ref, _ref2;

  var className = props.className,
      included = props.included,
      vertical = props.vertical,
      offset = props.offset,
      length = props.length,
      style = props.style,
      reverse = props.reverse;

  var positonStyle = vertical ? (_ref = {}, _defineProperty(_ref, reverse ? 'top' : 'bottom', offset + '%'), _defineProperty(_ref, reverse ? 'bottom' : 'top', 'auto'), _defineProperty(_ref, 'height', length + '%'), _ref) : (_ref2 = {}, _defineProperty(_ref2, reverse ? 'right' : 'left', offset + '%'), _defineProperty(_ref2, reverse ? 'left' : 'right', 'auto'), _defineProperty(_ref2, 'width', length + '%'), _ref2);

  var elStyle = _extends({}, style, positonStyle);
  return included ? React.createElement('div', { className: className, style: elStyle }) : null;
};

export default Track;