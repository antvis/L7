'use strict';

exports.__esModule = true;

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _rmcFeedback = require('rmc-feedback');

var _rmcFeedback2 = _interopRequireDefault(_rmcFeedback);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var InputHandler = function (_Component) {
  (0, _inherits3['default'])(InputHandler, _Component);

  function InputHandler() {
    (0, _classCallCheck3['default'])(this, InputHandler);
    return (0, _possibleConstructorReturn3['default'])(this, _Component.apply(this, arguments));
  }

  InputHandler.prototype.render = function render() {
    var _props = this.props,
        prefixCls = _props.prefixCls,
        disabled = _props.disabled,
        otherProps = (0, _objectWithoutProperties3['default'])(_props, ['prefixCls', 'disabled']);

    return _react2['default'].createElement(
      _rmcFeedback2['default'],
      {
        disabled: disabled,
        activeClassName: prefixCls + '-handler-active'
      },
      _react2['default'].createElement('span', otherProps)
    );
  };

  return InputHandler;
}(_react.Component);

InputHandler.propTypes = {
  prefixCls: _propTypes2['default'].string,
  disabled: _propTypes2['default'].bool,
  onTouchStart: _propTypes2['default'].func,
  onTouchEnd: _propTypes2['default'].func,
  onMouseDown: _propTypes2['default'].func,
  onMouseUp: _propTypes2['default'].func,
  onMouseLeave: _propTypes2['default'].func
};

exports['default'] = InputHandler;
module.exports = exports['default'];