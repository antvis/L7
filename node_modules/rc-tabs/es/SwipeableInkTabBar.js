import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import SwipeableTabBarNode from './SwipeableTabBarNode';
import TabBarSwipeableTabs from './TabBarSwipeableTabs';
import TabBarRootNode from './TabBarRootNode';
import InkTabBarNode from './InkTabBarNode';
import SaveRef from './SaveRef';

var SwipeableInkTabBar = function (_React$Component) {
  _inherits(SwipeableInkTabBar, _React$Component);

  function SwipeableInkTabBar() {
    _classCallCheck(this, SwipeableInkTabBar);

    return _possibleConstructorReturn(this, (SwipeableInkTabBar.__proto__ || Object.getPrototypeOf(SwipeableInkTabBar)).apply(this, arguments));
  }

  _createClass(SwipeableInkTabBar, [{
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
              SwipeableTabBarNode,
              _extends({ saveRef: saveRef, getRef: getRef }, _this2.props),
              React.createElement(TabBarSwipeableTabs, _extends({ saveRef: saveRef }, _this2.props)),
              React.createElement(InkTabBarNode, _extends({ saveRef: saveRef, getRef: getRef }, _this2.props))
            )
          );
        }
      );
    }
  }]);

  return SwipeableInkTabBar;
}(React.Component);

export default SwipeableInkTabBar;