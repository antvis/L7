import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Touchable from 'rmc-feedback';

var InputHandler = function (_Component) {
  _inherits(InputHandler, _Component);

  function InputHandler() {
    _classCallCheck(this, InputHandler);

    return _possibleConstructorReturn(this, _Component.apply(this, arguments));
  }

  InputHandler.prototype.render = function render() {
    var _props = this.props,
        prefixCls = _props.prefixCls,
        disabled = _props.disabled,
        otherProps = _objectWithoutProperties(_props, ['prefixCls', 'disabled']);

    return React.createElement(
      Touchable,
      {
        disabled: disabled,
        activeClassName: prefixCls + '-handler-active'
      },
      React.createElement('span', otherProps)
    );
  };

  return InputHandler;
}(Component);

InputHandler.propTypes = {
  prefixCls: PropTypes.string,
  disabled: PropTypes.bool,
  onTouchStart: PropTypes.func,
  onTouchEnd: PropTypes.func,
  onMouseDown: PropTypes.func,
  onMouseUp: PropTypes.func,
  onMouseLeave: PropTypes.func
};

export default InputHandler;