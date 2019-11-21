'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

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

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Notice = function (_Component) {
  (0, _inherits3['default'])(Notice, _Component);

  function Notice() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3['default'])(this, Notice);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = Notice.__proto__ || Object.getPrototypeOf(Notice)).call.apply(_ref, [this].concat(args))), _this), _this.close = function (e) {
      if (e) {
        e.stopPropagation();
      }
      _this.clearCloseTimer();
      _this.props.onClose();
    }, _this.startCloseTimer = function () {
      if (_this.props.duration) {
        _this.closeTimer = setTimeout(function () {
          _this.close();
        }, _this.props.duration * 1000);
      }
    }, _this.clearCloseTimer = function () {
      if (_this.closeTimer) {
        clearTimeout(_this.closeTimer);
        _this.closeTimer = null;
      }
    }, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
  }

  (0, _createClass3['default'])(Notice, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.startCloseTimer();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      if (this.props.duration !== prevProps.duration || this.props.update) {
        this.restartCloseTimer();
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.clearCloseTimer();
    }
  }, {
    key: 'restartCloseTimer',
    value: function restartCloseTimer() {
      this.clearCloseTimer();
      this.startCloseTimer();
    }
  }, {
    key: 'render',
    value: function render() {
      var _className;

      var props = this.props;
      var componentClass = props.prefixCls + '-notice';
      var className = (_className = {}, (0, _defineProperty3['default'])(_className, '' + componentClass, 1), (0, _defineProperty3['default'])(_className, componentClass + '-closable', props.closable), (0, _defineProperty3['default'])(_className, props.className, !!props.className), _className);
      return _react2['default'].createElement(
        'div',
        {
          className: (0, _classnames2['default'])(className),
          style: props.style,
          onMouseEnter: this.clearCloseTimer,
          onMouseLeave: this.startCloseTimer,
          onClick: props.onClick
        },
        _react2['default'].createElement(
          'div',
          { className: componentClass + '-content' },
          props.children
        ),
        props.closable ? _react2['default'].createElement(
          'a',
          { tabIndex: '0', onClick: this.close, className: componentClass + '-close' },
          props.closeIcon || _react2['default'].createElement('span', { className: componentClass + '-close-x' })
        ) : null
      );
    }
  }]);
  return Notice;
}(_react.Component);

Notice.propTypes = {
  duration: _propTypes2['default'].number,
  onClose: _propTypes2['default'].func,
  children: _propTypes2['default'].any,
  update: _propTypes2['default'].bool,
  closeIcon: _propTypes2['default'].node
};
Notice.defaultProps = {
  onEnd: function onEnd() {},
  onClose: function onClose() {},

  duration: 1.5,
  style: {
    right: '50%'
  }
};
exports['default'] = Notice;
module.exports = exports['default'];