import _extends from 'babel-runtime/helpers/extends';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { getDataAttr } from './utils';
import Sentinel, { SentinelConsumer } from './Sentinel';

var TabPane = function (_React$Component) {
  _inherits(TabPane, _React$Component);

  function TabPane() {
    _classCallCheck(this, TabPane);

    return _possibleConstructorReturn(this, (TabPane.__proto__ || Object.getPrototypeOf(TabPane)).apply(this, arguments));
  }

  _createClass(TabPane, [{
    key: 'render',
    value: function render() {
      var _classnames;

      var _props = this.props,
          id = _props.id,
          className = _props.className,
          destroyInactiveTabPane = _props.destroyInactiveTabPane,
          active = _props.active,
          forceRender = _props.forceRender,
          rootPrefixCls = _props.rootPrefixCls,
          style = _props.style,
          children = _props.children,
          placeholder = _props.placeholder,
          restProps = _objectWithoutProperties(_props, ['id', 'className', 'destroyInactiveTabPane', 'active', 'forceRender', 'rootPrefixCls', 'style', 'children', 'placeholder']);

      this._isActived = this._isActived || active;
      var prefixCls = rootPrefixCls + '-tabpane';
      var cls = classnames((_classnames = {}, _defineProperty(_classnames, prefixCls, 1), _defineProperty(_classnames, prefixCls + '-inactive', !active), _defineProperty(_classnames, prefixCls + '-active', active), _defineProperty(_classnames, className, className), _classnames));
      var isRender = destroyInactiveTabPane ? active : this._isActived;
      var shouldRender = isRender || forceRender;

      return React.createElement(
        SentinelConsumer,
        null,
        function (_ref) {
          var sentinelStart = _ref.sentinelStart,
              sentinelEnd = _ref.sentinelEnd,
              setPanelSentinelStart = _ref.setPanelSentinelStart,
              setPanelSentinelEnd = _ref.setPanelSentinelEnd;

          // Create sentinel
          var panelSentinelStart = void 0;
          var panelSentinelEnd = void 0;
          if (active && shouldRender) {
            panelSentinelStart = React.createElement(Sentinel, {
              setRef: setPanelSentinelStart,
              prevElement: sentinelStart
            });
            panelSentinelEnd = React.createElement(Sentinel, {
              setRef: setPanelSentinelEnd,
              nextElement: sentinelEnd
            });
          }

          return React.createElement(
            'div',
            _extends({
              style: style,
              role: 'tabpanel',
              'aria-hidden': active ? 'false' : 'true',
              className: cls,
              id: id
            }, getDataAttr(restProps)),
            panelSentinelStart,
            shouldRender ? children : placeholder,
            panelSentinelEnd
          );
        }
      );
    }
  }]);

  return TabPane;
}(React.Component);

export default TabPane;


TabPane.propTypes = {
  className: PropTypes.string,
  active: PropTypes.bool,
  style: PropTypes.any,
  destroyInactiveTabPane: PropTypes.bool,
  forceRender: PropTypes.bool,
  placeholder: PropTypes.node,
  rootPrefixCls: PropTypes.string,
  children: PropTypes.node,
  id: PropTypes.string
};

TabPane.defaultProps = {
  placeholder: null
};