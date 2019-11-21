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

var _TabBarRootNode = require('./TabBarRootNode');

var _TabBarRootNode2 = _interopRequireDefault(_TabBarRootNode);

var _TabBarTabsNode = require('./TabBarTabsNode');

var _TabBarTabsNode2 = _interopRequireDefault(_TabBarTabsNode);

var _SaveRef = require('./SaveRef');

var _SaveRef2 = _interopRequireDefault(_SaveRef);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/* eslint-disable react/prefer-stateless-function */
var TabBar = function (_React$Component) {
  (0, _inherits3['default'])(TabBar, _React$Component);

  function TabBar() {
    (0, _classCallCheck3['default'])(this, TabBar);
    return (0, _possibleConstructorReturn3['default'])(this, (TabBar.__proto__ || Object.getPrototypeOf(TabBar)).apply(this, arguments));
  }

  (0, _createClass3['default'])(TabBar, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      return _react2['default'].createElement(
        _SaveRef2['default'],
        null,
        function (saveRef) {
          return _react2['default'].createElement(
            _TabBarRootNode2['default'],
            (0, _extends3['default'])({ saveRef: saveRef }, _this2.props),
            _react2['default'].createElement(_TabBarTabsNode2['default'], (0, _extends3['default'])({ saveRef: saveRef }, _this2.props))
          );
        }
      );
    }
  }]);
  return TabBar;
}(_react2['default'].Component);

exports['default'] = TabBar;
module.exports = exports['default'];