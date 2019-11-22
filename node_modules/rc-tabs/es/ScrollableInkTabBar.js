import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import PropTypes from 'prop-types';
import InkTabBarNode from './InkTabBarNode';
import TabBarTabsNode from './TabBarTabsNode';
import TabBarRootNode from './TabBarRootNode';
import ScrollableTabBarNode from './ScrollableTabBarNode';
import SaveRef from './SaveRef';

var ScrollableInkTabBar = function (_React$Component) {
  _inherits(ScrollableInkTabBar, _React$Component);

  function ScrollableInkTabBar() {
    _classCallCheck(this, ScrollableInkTabBar);

    return _possibleConstructorReturn(this, (ScrollableInkTabBar.__proto__ || Object.getPrototypeOf(ScrollableInkTabBar)).apply(this, arguments));
  }

  _createClass(ScrollableInkTabBar, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          renderTabBarNode = _props.children,
          restProps = _objectWithoutProperties(_props, ['children']);

      return React.createElement(
        SaveRef,
        null,
        function (saveRef, getRef) {
          return React.createElement(
            TabBarRootNode,
            _extends({ saveRef: saveRef }, restProps),
            React.createElement(
              ScrollableTabBarNode,
              _extends({ saveRef: saveRef, getRef: getRef }, restProps),
              React.createElement(TabBarTabsNode, _extends({ saveRef: saveRef, renderTabBarNode: renderTabBarNode }, restProps)),
              React.createElement(InkTabBarNode, _extends({ saveRef: saveRef, getRef: getRef }, restProps))
            )
          );
        }
      );
    }
  }]);

  return ScrollableInkTabBar;
}(React.Component);

export default ScrollableInkTabBar;


ScrollableInkTabBar.propTypes = {
  children: PropTypes.func
};