'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SentinelConsumer = exports.SentinelProvider = undefined;

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

var _KeyCode = require('rc-util/lib/KeyCode');

var _KeyCode2 = _interopRequireDefault(_KeyCode);

var _createReactContext = require('@ant-design/create-react-context');

var _createReactContext2 = _interopRequireDefault(_createReactContext);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
var SentinelContext = (0, _createReactContext2['default'])({});
var SentinelProvider = exports.SentinelProvider = SentinelContext.Provider;
var SentinelConsumer = exports.SentinelConsumer = SentinelContext.Consumer;

var sentinelStyle = { width: 0, height: 0, overflow: 'hidden', position: 'absolute' };

var Sentinel = function (_React$Component) {
  (0, _inherits3['default'])(Sentinel, _React$Component);

  function Sentinel() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3['default'])(this, Sentinel);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = Sentinel.__proto__ || Object.getPrototypeOf(Sentinel)).call.apply(_ref, [this].concat(args))), _this), _this.onKeyDown = function (_ref2) {
      var target = _ref2.target,
          which = _ref2.which,
          shiftKey = _ref2.shiftKey;
      var _this$props = _this.props,
          nextElement = _this$props.nextElement,
          prevElement = _this$props.prevElement;

      if (which !== _KeyCode2['default'].TAB || document.activeElement !== target) return;

      // Tab next
      if (!shiftKey && nextElement) {
        nextElement.focus();
      }

      // Tab prev
      if (shiftKey && prevElement) {
        prevElement.focus();
      }
    }, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
  }

  (0, _createClass3['default'])(Sentinel, [{
    key: 'render',
    value: function render() {
      var setRef = this.props.setRef;


      return _react2['default'].createElement('div', {
        tabIndex: 0,
        ref: setRef,
        style: sentinelStyle,
        onKeyDown: this.onKeyDown,
        role: 'presentation'
      });
    }
  }]);
  return Sentinel;
}(_react2['default'].Component);

Sentinel.propTypes = {
  setRef: _propTypes2['default'].func,
  prevElement: _propTypes2['default'].object,
  nextElement: _propTypes2['default'].object
};
exports['default'] = Sentinel;