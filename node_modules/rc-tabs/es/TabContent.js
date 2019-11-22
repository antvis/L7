import _extends from 'babel-runtime/helpers/extends';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { getTransformByIndex, getActiveIndex, getTransformPropValue, getMarginStyle } from './utils';

var TabContent = function (_React$Component) {
  _inherits(TabContent, _React$Component);

  function TabContent() {
    _classCallCheck(this, TabContent);

    return _possibleConstructorReturn(this, (TabContent.__proto__ || Object.getPrototypeOf(TabContent)).apply(this, arguments));
  }

  _createClass(TabContent, [{
    key: 'getTabPanes',
    value: function getTabPanes() {
      var props = this.props;
      var activeKey = props.activeKey;
      var children = props.children;
      var newChildren = [];

      React.Children.forEach(children, function (child) {
        if (!child) {
          return;
        }
        var key = child.key;
        var active = activeKey === key;
        newChildren.push(React.cloneElement(child, {
          active: active,
          destroyInactiveTabPane: props.destroyInactiveTabPane,
          rootPrefixCls: props.prefixCls
        }));
      });

      return newChildren;
    }
  }, {
    key: 'render',
    value: function render() {
      var _classnames;

      var props = this.props;
      var prefixCls = props.prefixCls,
          children = props.children,
          activeKey = props.activeKey,
          className = props.className,
          tabBarPosition = props.tabBarPosition,
          animated = props.animated,
          animatedWithMargin = props.animatedWithMargin;
      var style = props.style;

      var classes = classnames((_classnames = {}, _defineProperty(_classnames, prefixCls + '-content', true), _defineProperty(_classnames, animated ? prefixCls + '-content-animated' : prefixCls + '-content-no-animated', true), _classnames), className);
      if (animated) {
        var activeIndex = getActiveIndex(children, activeKey);
        if (activeIndex !== -1) {
          var animatedStyle = animatedWithMargin ? getMarginStyle(activeIndex, tabBarPosition) : getTransformPropValue(getTransformByIndex(activeIndex, tabBarPosition));
          style = _extends({}, style, animatedStyle);
        } else {
          style = _extends({}, style, {
            display: 'none'
          });
        }
      }
      return React.createElement(
        'div',
        {
          className: classes,
          style: style
        },
        this.getTabPanes()
      );
    }
  }]);

  return TabContent;
}(React.Component);

export default TabContent;


TabContent.propTypes = {
  animated: PropTypes.bool,
  animatedWithMargin: PropTypes.bool,
  prefixCls: PropTypes.string,
  children: PropTypes.node,
  activeKey: PropTypes.string,
  style: PropTypes.any,
  tabBarPosition: PropTypes.string,
  className: PropTypes.string,
  destroyInactiveTabPane: PropTypes.bool
};

TabContent.defaultProps = {
  animated: true
};