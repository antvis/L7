import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

var LazyRenderBox = function (_Component) {
  _inherits(LazyRenderBox, _Component);

  function LazyRenderBox() {
    _classCallCheck(this, LazyRenderBox);

    return _possibleConstructorReturn(this, _Component.apply(this, arguments));
  }

  LazyRenderBox.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
    return nextProps.hiddenClassName || nextProps.visible;
  };

  LazyRenderBox.prototype.render = function render() {
    var _props = this.props,
        hiddenClassName = _props.hiddenClassName,
        visible = _props.visible,
        props = _objectWithoutProperties(_props, ['hiddenClassName', 'visible']);

    if (hiddenClassName || React.Children.count(props.children) > 1) {
      if (!visible && hiddenClassName) {
        props.className += ' ' + hiddenClassName;
      }
      return React.createElement('div', props);
    }

    return React.Children.only(props.children);
  };

  return LazyRenderBox;
}(Component);

LazyRenderBox.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  visible: PropTypes.bool,
  hiddenClassName: PropTypes.string
};


export default LazyRenderBox;