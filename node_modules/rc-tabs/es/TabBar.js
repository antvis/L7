import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import TabBarRootNode from './TabBarRootNode';
import TabBarTabsNode from './TabBarTabsNode';
import SaveRef from './SaveRef';

var TabBar = function (_React$Component) {
  _inherits(TabBar, _React$Component);

  function TabBar() {
    _classCallCheck(this, TabBar);

    return _possibleConstructorReturn(this, (TabBar.__proto__ || Object.getPrototypeOf(TabBar)).apply(this, arguments));
  }

  _createClass(TabBar, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      return React.createElement(
        SaveRef,
        null,
        function (saveRef) {
          return React.createElement(
            TabBarRootNode,
            _extends({ saveRef: saveRef }, _this2.props),
            React.createElement(TabBarTabsNode, _extends({ saveRef: saveRef }, _this2.props))
          );
        }
      );
    }
  }]);

  return TabBar;
}(React.Component);

export default TabBar;