var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import shallowEqual from 'shallowequal';

var PanelContent = function (_Component) {
  _inherits(PanelContent, _Component);

  function PanelContent() {
    _classCallCheck(this, PanelContent);

    return _possibleConstructorReturn(this, (PanelContent.__proto__ || Object.getPrototypeOf(PanelContent)).apply(this, arguments));
  }

  _createClass(PanelContent, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      return this.props.forceRender || !shallowEqual(this.props, nextProps);
    }
  }, {
    key: 'render',
    value: function render() {
      var _classnames;

      this._isActived = this.props.forceRender || this._isActived || this.props.isActive;
      if (!this._isActived) {
        return null;
      }
      var _props = this.props,
          prefixCls = _props.prefixCls,
          isActive = _props.isActive,
          children = _props.children,
          destroyInactivePanel = _props.destroyInactivePanel,
          forceRender = _props.forceRender,
          role = _props.role;

      var contentCls = classnames((_classnames = {}, _defineProperty(_classnames, prefixCls + '-content', true), _defineProperty(_classnames, prefixCls + '-content-active', isActive), _defineProperty(_classnames, prefixCls + '-content-inactive', !isActive), _classnames));
      var child = !forceRender && !isActive && destroyInactivePanel ? null : React.createElement(
        'div',
        { className: prefixCls + '-content-box' },
        children
      );
      return React.createElement(
        'div',
        {
          className: contentCls,
          role: role
        },
        child
      );
    }
  }]);

  return PanelContent;
}(Component);

PanelContent.propTypes = {
  prefixCls: PropTypes.string,
  isActive: PropTypes.bool,
  children: PropTypes.any,
  destroyInactivePanel: PropTypes.bool,
  forceRender: PropTypes.bool,
  role: PropTypes.string
};

export default PanelContent;