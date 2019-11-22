import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import React from 'react';
import PropTypes from 'prop-types';
import KeyCode from 'rc-util/es/KeyCode';
import createReactContext from '@ant-design/create-react-context';

var SentinelContext = createReactContext({});
export var SentinelProvider = SentinelContext.Provider;
export var SentinelConsumer = SentinelContext.Consumer;

var sentinelStyle = { width: 0, height: 0, overflow: 'hidden', position: 'absolute' };

var Sentinel = function (_React$Component) {
  _inherits(Sentinel, _React$Component);

  function Sentinel() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Sentinel);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Sentinel.__proto__ || Object.getPrototypeOf(Sentinel)).call.apply(_ref, [this].concat(args))), _this), _this.onKeyDown = function (_ref2) {
      var target = _ref2.target,
          which = _ref2.which,
          shiftKey = _ref2.shiftKey;
      var _this$props = _this.props,
          nextElement = _this$props.nextElement,
          prevElement = _this$props.prevElement;

      if (which !== KeyCode.TAB || document.activeElement !== target) return;

      // Tab next
      if (!shiftKey && nextElement) {
        nextElement.focus();
      }

      // Tab prev
      if (shiftKey && prevElement) {
        prevElement.focus();
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Sentinel, [{
    key: 'render',
    value: function render() {
      var setRef = this.props.setRef;


      return React.createElement('div', {
        tabIndex: 0,
        ref: setRef,
        style: sentinelStyle,
        onKeyDown: this.onKeyDown,
        role: 'presentation'
      });
    }
  }]);

  return Sentinel;
}(React.Component);

Sentinel.propTypes = {
  setRef: PropTypes.func,
  prevElement: PropTypes.object,
  nextElement: PropTypes.object
};
export default Sentinel;