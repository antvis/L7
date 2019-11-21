import _extends from 'babel-runtime/helpers/extends';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import warning from 'warning';
import PropTypes from 'prop-types';
import { isVertical } from './utils';

var TabBarTabsNode = function (_React$Component) {
  _inherits(TabBarTabsNode, _React$Component);

  function TabBarTabsNode() {
    _classCallCheck(this, TabBarTabsNode);

    return _possibleConstructorReturn(this, (TabBarTabsNode.__proto__ || Object.getPrototypeOf(TabBarTabsNode)).apply(this, arguments));
  }

  _createClass(TabBarTabsNode, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          children = _props.panels,
          activeKey = _props.activeKey,
          prefixCls = _props.prefixCls,
          tabBarGutter = _props.tabBarGutter,
          saveRef = _props.saveRef,
          tabBarPosition = _props.tabBarPosition,
          renderTabBarNode = _props.renderTabBarNode;

      var rst = [];

      React.Children.forEach(children, function (child, index) {
        if (!child) {
          return;
        }
        var key = child.key;
        var cls = activeKey === key ? prefixCls + '-tab-active' : '';
        cls += ' ' + prefixCls + '-tab';
        var events = {};
        if (child.props.disabled) {
          cls += ' ' + prefixCls + '-tab-disabled';
        } else {
          events = {
            onClick: _this2.props.onTabClick.bind(_this2, key)
          };
        }
        var ref = {};
        if (activeKey === key) {
          ref.ref = saveRef('activeTab');
        }

        var gutter = tabBarGutter && index === children.length - 1 ? 0 : tabBarGutter;
        var style = _defineProperty({}, isVertical(tabBarPosition) ? 'marginBottom' : 'marginRight', gutter);
        warning('tab' in child.props, 'There must be `tab` property on children of Tabs.');

        var node = React.createElement(
          'div',
          _extends({
            role: 'tab',
            'aria-disabled': child.props.disabled ? 'true' : 'false',
            'aria-selected': activeKey === key ? 'true' : 'false'
          }, events, {
            className: cls,
            key: key,
            style: style
          }, ref),
          child.props.tab
        );

        if (renderTabBarNode) {
          node = renderTabBarNode(node);
        }

        rst.push(node);
      });

      return React.createElement(
        'div',
        { ref: saveRef('navTabsContainer') },
        rst
      );
    }
  }]);

  return TabBarTabsNode;
}(React.Component);

export default TabBarTabsNode;


TabBarTabsNode.propTypes = {
  activeKey: PropTypes.string,
  panels: PropTypes.node,
  prefixCls: PropTypes.string,
  tabBarGutter: PropTypes.number,
  onTabClick: PropTypes.func,
  saveRef: PropTypes.func,
  renderTabBarNode: PropTypes.func,
  tabBarPosition: PropTypes.string
};

TabBarTabsNode.defaultProps = {
  panels: [],
  prefixCls: [],
  tabBarGutter: null,
  onTabClick: function onTabClick() {},
  saveRef: function saveRef() {}
};