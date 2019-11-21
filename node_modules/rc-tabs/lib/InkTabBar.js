'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

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

var _InkTabBarNode = require('./InkTabBarNode');

var _InkTabBarNode2 = _interopRequireDefault(_InkTabBarNode);

var _TabBarTabsNode = require('./TabBarTabsNode');

var _TabBarTabsNode2 = _interopRequireDefault(_TabBarTabsNode);

var _TabBarRootNode = require('./TabBarRootNode');

var _TabBarRootNode2 = _interopRequireDefault(_TabBarRootNode);

var _SaveRef = require('./SaveRef');

var _SaveRef2 = _interopRequireDefault(_SaveRef);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/* eslint-disable react/prefer-stateless-function */
var InkTabBar = function (_React$Component) {
  (0, _inherits3['default'])(InkTabBar, _React$Component);

  function InkTabBar() {
    (0, _classCallCheck3['default'])(this, InkTabBar);
    return (0, _possibleConstructorReturn3['default'])(this, (InkTabBar.__proto__ || Object.getPrototypeOf(InkTabBar)).apply(this, arguments));
  }

  (0, _createClass3['default'])(InkTabBar, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      return _react2['default'].createElement(
        _SaveRef2['default'],
        null,
        function (saveRef, getRef) {
          return _react2['default'].createElement(
            _TabBarRootNode2['default'],
            (0, _extends3['default'])({ saveRef: saveRef }, _this2.props),
            _react2['default'].createElement(_TabBarTabsNode2['default'], (0, _extends3['default'])({ onTabClick: _this2.props.onTabClick, saveRef: saveRef }, _this2.props)),
            _react2['default'].createElement(_InkTabBarNode2['default'], (0, _extends3['default'])({ saveRef: saveRef, getRef: getRef }, _this2.props))
          );
        }
      );
    }
  }]);
  return InkTabBar;
}(_react2['default'].Component);

exports['default'] = InkTabBar;


InkTabBar.propTypes = {
  onTabClick: _propTypes2['default'].func
};

InkTabBar.defaultProps = {
  onTabClick: function onTabClick() {}
};
module.exports = exports['default'];