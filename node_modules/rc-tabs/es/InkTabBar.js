import _extends from 'babel-runtime/helpers/extends';
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
import SaveRef from './SaveRef';

var InkTabBar = function (_React$Component) {
  _inherits(InkTabBar, _React$Component);

  function InkTabBar() {
    _classCallCheck(this, InkTabBar);

    return _possibleConstructorReturn(this, (InkTabBar.__proto__ || Object.getPrototypeOf(InkTabBar)).apply(this, arguments));
  }

  _createClass(InkTabBar, [{
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
            React.createElement(TabBarTabsNode, _extends({ onTabClick: _this2.props.onTabClick, saveRef: saveRef }, _this2.props)),
            React.createElement(InkTabBarNode, _extends({ saveRef: saveRef, getRef: getRef }, _this2.props))
          );
        }
      );
    }
  }]);

  return InkTabBar;
}(React.Component);

export default InkTabBar;


InkTabBar.propTypes = {
  onTabClick: PropTypes.func
};

InkTabBar.defaultProps = {
  onTabClick: function onTabClick() {}
};