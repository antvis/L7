import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React, { Component } from 'react';

var Nav = function (_Component) {
  _inherits(Nav, _Component);

  function Nav() {
    _classCallCheck(this, Nav);

    return _possibleConstructorReturn(this, _Component.apply(this, arguments));
  }

  Nav.prototype.render = function render() {
    var props = this.props;

    return React.createElement('div', props);
  };

  return Nav;
}(Component);

export default Nav;