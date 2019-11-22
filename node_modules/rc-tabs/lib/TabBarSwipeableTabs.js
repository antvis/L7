'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames2 = require('classnames');

var _classnames3 = _interopRequireDefault(_classnames2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var TabBarSwipeableTabs = function (_React$Component) {
  (0, _inherits3['default'])(TabBarSwipeableTabs, _React$Component);

  function TabBarSwipeableTabs() {
    (0, _classCallCheck3['default'])(this, TabBarSwipeableTabs);
    return (0, _possibleConstructorReturn3['default'])(this, (TabBarSwipeableTabs.__proto__ || Object.getPrototypeOf(TabBarSwipeableTabs)).apply(this, arguments));
  }

  (0, _createClass3['default'])(TabBarSwipeableTabs, [{
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

      _react2['default'].Children.forEach(children, function (child) {
        var _classnames;

        if (!child) {
          return;
        }
        var key = child.key;
        var cls = (0, _classnames3['default'])(prefixCls + '-tab', (_classnames = {}, (0, _defineProperty3['default'])(_classnames, prefixCls + '-tab-active', activeKey === key), (0, _defineProperty3['default'])(_classnames, prefixCls + '-tab-disabled', child.props.disabled), _classnames));
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
        rst.push(_react2['default'].createElement(
          'div',
          (0, _extends3['default'])({
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
}(_react2['default'].Component);

exports['default'] = TabBarSwipeableTabs;


TabBarSwipeableTabs.propTypes = {
  pageSize: _propTypes2['default'].number,
  onTabClick: _propTypes2['default'].func,
  saveRef: _propTypes2['default'].func,
  destroyInactiveTabPane: _propTypes2['default'].bool,
  prefixCls: _propTypes2['default'].string,
  activeKey: _propTypes2['default'].string,
  panels: _propTypes2['default'].node
};

TabBarSwipeableTabs.defaultProps = {
  pageSize: 5,
  onTabClick: function onTabClick() {},
  saveRef: function saveRef() {}
};
module.exports = exports['default'];