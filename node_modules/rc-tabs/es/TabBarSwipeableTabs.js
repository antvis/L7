import _extends from 'babel-runtime/helpers/extends';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

var TabBarSwipeableTabs = function (_React$Component) {
  _inherits(TabBarSwipeableTabs, _React$Component);

  function TabBarSwipeableTabs() {
    _classCallCheck(this, TabBarSwipeableTabs);

    return _possibleConstructorReturn(this, (TabBarSwipeableTabs.__proto__ || Object.getPrototypeOf(TabBarSwipeableTabs)).apply(this, arguments));
  }

  _createClass(TabBarSwipeableTabs, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var props = this.props;
      var children = props.panels;
      var activeKey = props.activeKey;
      var rst = [];
      var prefixCls = props.prefixCls;

      var _flexWidth = 1 / props.pageSize * 100 + '%';
      var tabStyle = {
        WebkitFlexBasis: _flexWidth,
        flexBasis: _flexWidth
      };

      React.Children.forEach(children, function (child) {
        var _classnames;

        if (!child) {
          return;
        }
        var key = child.key;
        var cls = classnames(prefixCls + '-tab', (_classnames = {}, _defineProperty(_classnames, prefixCls + '-tab-active', activeKey === key), _defineProperty(_classnames, prefixCls + '-tab-disabled', child.props.disabled), _classnames));
        var events = {};
        if (!child.props.disabled) {
          events = {
            onClick: _this2.props.onTabClick.bind(_this2, key)
          };
        }
        var refProps = {};
        if (activeKey === key) {
          refProps.ref = _this2.props.saveRef('activeTab');
        }
        rst.push(React.createElement(
          'div',
          _extends({
            role: 'tab',
            style: tabStyle,
            'aria-disabled': child.props.disabled ? 'true' : 'false',
            'aria-selected': activeKey === key ? 'true' : 'false'
          }, events, {
            className: cls,
            key: key
          }, refProps),
          child.props.tab
        ));
      });

      return rst;
    }
  }]);

  return TabBarSwipeableTabs;
}(React.Component);

export default TabBarSwipeableTabs;


TabBarSwipeableTabs.propTypes = {
  pageSize: PropTypes.number,
  onTabClick: PropTypes.func,
  saveRef: PropTypes.func,
  destroyInactiveTabPane: PropTypes.bool,
  prefixCls: PropTypes.string,
  activeKey: PropTypes.string,
  panels: PropTypes.node
};

TabBarSwipeableTabs.defaultProps = {
  pageSize: 5,
  onTabClick: function onTabClick() {},
  saveRef: function saveRef() {}
};