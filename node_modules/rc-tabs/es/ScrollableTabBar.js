import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import ScrollableTabBarNode from './ScrollableTabBarNode';
import TabBarRootNode from './TabBarRootNode';
import TabBarTabsNode from './TabBarTabsNode';
import SaveRef from './SaveRef';

var ScrollableTabBar = function (_React$Component) {
  _inherits(ScrollableTabBar, _React$Component);

  function ScrollableTabBar() {
    _classCallCheck(this, ScrollableTabBar);

    return _possibleConstructorReturn(this, (ScrollableTabBar.__proto__ || Object.getPrototypeOf(ScrollableTabBar)).apply(this, arguments));
  }

  _createClass(ScrollableTabBar, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      return React.createElement(
        SaveRef,
        null,
        function (saveRef, getRef) {
          return React.createElement(
            TabBarRootNode,
            _extends({ saveRef: saveRef }, _this2.props),
            React.createElement(
              ScrollableTabBarNode,
              _extends({ saveRef: saveRef, getRef: getRef }, _this2.props),
              React.createElement(TabBarTabsNode, _extends({ saveRef: saveRef }, _this2.props))
            )
          );
        }
      );
    }
  }]);

  return ScrollableTabBar;
}(React.Component);

export default ScrollableTabBar;