'use strict';

exports.__esModule = true;

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

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

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _reactLifecyclesCompat = require('react-lifecycles-compat');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Checkbox = function (_Component) {
  (0, _inherits3['default'])(Checkbox, _Component);

  function Checkbox(props) {
    (0, _classCallCheck3['default'])(this, Checkbox);

    var _this = (0, _possibleConstructorReturn3['default'])(this, _Component.call(this, props));

    _this.handleChange = function (e) {
      var _this$props = _this.props,
          disabled = _this$props.disabled,
          onChange = _this$props.onChange;

      if (disabled) {
        return;
      }
      if (!('checked' in _this.props)) {
        _this.setState({
          checked: e.target.checked
        });
      }
      if (onChange) {
        onChange({
          target: (0, _extends3['default'])({}, _this.props, {
            checked: e.target.checked
          }),
          stopPropagation: function stopPropagation() {
            e.stopPropagation();
          },
          preventDefault: function preventDefault() {
            e.preventDefault();
          },

          nativeEvent: e.nativeEvent
        });
      }
    };

    _this.saveInput = function (node) {
      _this.input = node;
    };

    var checked = 'checked' in props ? props.checked : props.defaultChecked;

    _this.state = {
      checked: checked
    };
    return _this;
  }

  Checkbox.getDerivedStateFromProps = function getDerivedStateFromProps(props, state) {
    if ('checked' in props) {
      return (0, _extends3['default'])({}, state, {
        checked: props.checked
      });
    }
    return null;
  };

  Checkbox.prototype.focus = function focus() {
    this.input.focus();
  };

  Checkbox.prototype.blur = function blur() {
    this.input.blur();
  };

  Checkbox.prototype.render = function render() {
    var _classNames;

    var _props = this.props,
        prefixCls = _props.prefixCls,
        className = _props.className,
        style = _props.style,
        name = _props.name,
        id = _props.id,
        type = _props.type,
        disabled = _props.disabled,
        readOnly = _props.readOnly,
        tabIndex = _props.tabIndex,
        onClick = _props.onClick,
        onFocus = _props.onFocus,
        onBlur = _props.onBlur,
        autoFocus = _props.autoFocus,
        value = _props.value,
        others = (0, _objectWithoutProperties3['default'])(_props, ['prefixCls', 'className', 'style', 'name', 'id', 'type', 'disabled', 'readOnly', 'tabIndex', 'onClick', 'onFocus', 'onBlur', 'autoFocus', 'value']);


    var globalProps = Object.keys(others).reduce(function (prev, key) {
      if (key.substr(0, 5) === 'aria-' || key.substr(0, 5) === 'data-' || key === 'role') {
        prev[key] = others[key];
      }
      return prev;
    }, {});

    var checked = this.state.checked;

    var classString = (0, _classnames2['default'])(prefixCls, className, (_classNames = {}, _classNames[prefixCls + '-checked'] = checked, _classNames[prefixCls + '-disabled'] = disabled, _classNames));

    return _react2['default'].createElement(
      'span',
      { className: classString, style: style },
      _react2['default'].createElement('input', (0, _extends3['default'])({
        name: name,
        id: id,
        type: type,
        readOnly: readOnly,
        disabled: disabled,
        tabIndex: tabIndex,
        className: prefixCls + '-input',
        checked: !!checked,
        onClick: onClick,
        onFocus: onFocus,
        onBlur: onBlur,
        onChange: this.handleChange,
        autoFocus: autoFocus,
        ref: this.saveInput,
        value: value
      }, globalProps)),
      _react2['default'].createElement('span', { className: prefixCls + '-inner' })
    );
  };

  return Checkbox;
}(_react.Component);

Checkbox.propTypes = {
  prefixCls: _propTypes2['default'].string,
  className: _propTypes2['default'].string,
  style: _propTypes2['default'].object,
  name: _propTypes2['default'].string,
  id: _propTypes2['default'].string,
  type: _propTypes2['default'].string,
  defaultChecked: _propTypes2['default'].oneOfType([_propTypes2['default'].number, _propTypes2['default'].bool]),
  checked: _propTypes2['default'].oneOfType([_propTypes2['default'].number, _propTypes2['default'].bool]),
  disabled: _propTypes2['default'].bool,
  onFocus: _propTypes2['default'].func,
  onBlur: _propTypes2['default'].func,
  onChange: _propTypes2['default'].func,
  onClick: _propTypes2['default'].func,
  tabIndex: _propTypes2['default'].oneOfType([_propTypes2['default'].string, _propTypes2['default'].number]),
  readOnly: _propTypes2['default'].bool,
  autoFocus: _propTypes2['default'].bool,
  value: _propTypes2['default'].any
};
Checkbox.defaultProps = {
  prefixCls: 'rc-checkbox',
  className: '',
  style: {},
  type: 'checkbox',
  defaultChecked: false,
  onFocus: function onFocus() {},
  onBlur: function onBlur() {},
  onChange: function onChange() {}
};


(0, _reactLifecyclesCompat.polyfill)(Checkbox);

exports['default'] = Checkbox;
module.exports = exports['default'];