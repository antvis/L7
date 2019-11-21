import _extends from 'babel-runtime/helpers/extends';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React, { cloneElement } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { getDataAttr } from './utils';

var TabBarRootNode = function (_React$Component) {
  _inherits(TabBarRootNode, _React$Component);

  function TabBarRootNode() {
    _classCallCheck(this, TabBarRootNode);

    return _possibleConstructorReturn(this, (TabBarRootNode.__proto__ || Object.getPrototypeOf(TabBarRootNode)).apply(this, arguments));
  }

  _createClass(TabBarRootNode, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          prefixCls = _props.prefixCls,
          onKeyDown = _props.onKeyDown,
          className = _props.className,
          extraContent = _props.extraContent,
          style = _props.style,
          tabBarPosition = _props.tabBarPosition,
          children = _props.children,
          restProps = _objectWithoutProperties(_props, ['prefixCls', 'onKeyDown', 'className', 'extraContent', 'style', 'tabBarPosition', 'children']);

      var cls = classnames(prefixCls + '-bar', _defineProperty({}, className, !!className));
      var topOrBottom = tabBarPosition === 'top' || tabBarPosition === 'bottom';
      var tabBarExtraContentStyle = topOrBottom ? { float: 'right' } : {};
      var extraContentStyle = extraContent && extraContent.props ? extraContent.props.style : {};
      var newChildren = children;
      if (extraContent) {
        newChildren = [cloneElement(extraContent, {
          key: 'extra',
          style: _extends({}, tabBarExtraContentStyle, extraContentStyle)
        }), cloneElement(children, { key: 'content' })];
        newChildren = topOrBottom ? newChildren : newChildren.reverse();
      }
      return React.createElement(
        'div',
        _extends({
          role: 'tablist',
          className: cls,
          tabIndex: '0',
          ref: this.props.saveRef('root'),
          onKeyDown: onKeyDown,
          style: style
        }, getDataAttr(restProps)),
        newChildren
      );
    }
  }]);

  return TabBarRootNode;
}(React.Component);

export default TabBarRootNode;


TabBarRootNode.propTypes = {
  prefixCls: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  tabBarPosition: PropTypes.oneOf(['left', 'right', 'top', 'bottom']),
  children: PropTypes.node,
  extraContent: PropTypes.node,
  onKeyDown: PropTypes.func,
  saveRef: PropTypes.func
};

TabBarRootNode.defaultProps = {
  prefixCls: '',
  className: '',
  style: {},
  tabBarPosition: 'top',
  extraContent: null,
  children: null,
  onKeyDown: function onKeyDown() {},
  saveRef: function saveRef() {}
};