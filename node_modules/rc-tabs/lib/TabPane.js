'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

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

var _utils = require('./utils');

var _Sentinel = require('./Sentinel');

var _Sentinel2 = _interopRequireDefault(_Sentinel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var TabPane = function (_React$Component) {
  (0, _inherits3['default'])(TabPane, _React$Component);

  function TabPane() {
    (0, _classCallCheck3['default'])(this, TabPane);
    return (0, _possibleConstructorReturn3['default'])(this, (TabPane.__proto__ || Object.getPrototypeOf(TabPane)).apply(this, arguments));
  }

  (0, _createClass3['default'])(TabPane, [{
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
          restProps = (0, _objectWithoutProperties3['default'])(_props, ['id', 'className', 'destroyInactiveTabPane', 'active', 'forceRender', 'rootPrefixCls', 'style', 'children', 'placeholder']);

      this._isActived = this._isActived || active;
      var prefixCls = rootPrefixCls + '-tabpane';
      var cls = (0, _classnames3['default'])((_classnames = {}, (0, _defineProperty3['default'])(_classnames, prefixCls, 1), (0, _defineProperty3['default'])(_classnames, prefixCls + '-inactive', !active), (0, _defineProperty3['default'])(_classnames, prefixCls + '-active', active), (0, _defineProperty3['default'])(_classnames, className, className), _classnames));
      var isRender = destroyInactiveTabPane ? active : this._isActived;
      var shouldRender = isRender || forceRender;

      return _react2['default'].createElement(
        _Sentinel.SentinelConsumer,
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
            panelSentinelStart = _react2['default'].createElement(_Sentinel2['default'], {
              setRef: setPanelSentinelStart,
              prevElement: sentinelStart
            });
            panelSentinelEnd = _react2['default'].createElement(_Sentinel2['default'], {
              setRef: setPanelSentinelEnd,
              nextElement: sentinelEnd
            });
          }

          return _react2['default'].createElement(
            'div',
            (0, _extends3['default'])({
              style: style,
              role: 'tabpanel',
              'aria-hidden': active ? 'false' : 'true',
              className: cls,
              id: id
            }, (0, _utils.getDataAttr)(restProps)),
            panelSentinelStart,
            shouldRender ? children : placeholder,
            panelSentinelEnd
          );
        }
      );
    }
  }]);
  return TabPane;
}(_react2['default'].Component);

exports['default'] = TabPane;


TabPane.propTypes = {
  className: _propTypes2['default'].string,
  active: _propTypes2['default'].bool,
  style: _propTypes2['default'].any,
  destroyInactiveTabPane: _propTypes2['default'].bool,
  forceRender: _propTypes2['default'].bool,
  placeholder: _propTypes2['default'].node,
  rootPrefixCls: _propTypes2['default'].string,
  children: _propTypes2['default'].node,
  id: _propTypes2['default'].string
};

TabPane.defaultProps = {
  placeholder: null
};
module.exports = exports['default'];