import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import KeyCode from 'rc-util/es/KeyCode';
import { polyfill } from 'react-lifecycles-compat';
import moment from 'moment';
import { formatDate } from '../util';

var cachedSelectionStart = void 0;
var cachedSelectionEnd = void 0;
var dateInputInstance = void 0;

var DateInput = function (_React$Component) {
  _inherits(DateInput, _React$Component);

  function DateInput(props) {
    _classCallCheck(this, DateInput);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    _initialiseProps.call(_this);

    var selectedValue = props.selectedValue;

    _this.state = {
      str: formatDate(selectedValue, _this.props.format),
      invalid: false,
      hasFocus: false
    };
    return _this;
  }

  DateInput.prototype.componentDidUpdate = function componentDidUpdate() {
    if (dateInputInstance && this.state.hasFocus && !this.state.invalid && !(cachedSelectionStart === 0 && cachedSelectionEnd === 0)) {
      dateInputInstance.setSelectionRange(cachedSelectionStart, cachedSelectionEnd);
    }
  };

  DateInput.getDerivedStateFromProps = function getDerivedStateFromProps(nextProps, state) {
    var newState = {};

    if (dateInputInstance) {
      cachedSelectionStart = dateInputInstance.selectionStart;
      cachedSelectionEnd = dateInputInstance.selectionEnd;
    }
    // when popup show, click body will call this, bug!
    var selectedValue = nextProps.selectedValue;
    if (!state.hasFocus) {
      newState = {
        str: formatDate(selectedValue, nextProps.format),
        invalid: false
      };
    }

    return newState;
  };

  DateInput.getInstance = function getInstance() {
    return dateInputInstance;
  };

  DateInput.prototype.render = function render() {
    var props = this.props;
    var _state = this.state,
        invalid = _state.invalid,
        str = _state.str;
    var locale = props.locale,
        prefixCls = props.prefixCls,
        placeholder = props.placeholder,
        clearIcon = props.clearIcon,
        inputMode = props.inputMode;

    var invalidClass = invalid ? prefixCls + '-input-invalid' : '';
    return React.createElement(
      'div',
      { className: prefixCls + '-input-wrap' },
      React.createElement(
        'div',
        { className: prefixCls + '-date-input-wrap' },
        React.createElement('input', {
          ref: this.saveDateInput,
          className: prefixCls + '-input ' + invalidClass,
          value: str,
          disabled: props.disabled,
          placeholder: placeholder,
          onChange: this.onInputChange,
          onKeyDown: this.onKeyDown,
          onFocus: this.onFocus,
          onBlur: this.onBlur,
          inputMode: inputMode
        })
      ),
      props.showClear ? React.createElement(
        'a',
        {
          role: 'button',
          title: locale.clear,
          onClick: this.onClear
        },
        clearIcon || React.createElement('span', { className: prefixCls + '-clear-btn' })
      ) : null
    );
  };

  return DateInput;
}(React.Component);

DateInput.propTypes = {
  prefixCls: PropTypes.string,
  timePicker: PropTypes.object,
  value: PropTypes.object,
  disabledTime: PropTypes.any,
  format: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  locale: PropTypes.object,
  disabledDate: PropTypes.func,
  onChange: PropTypes.func,
  onClear: PropTypes.func,
  placeholder: PropTypes.string,
  onSelect: PropTypes.func,
  selectedValue: PropTypes.object,
  clearIcon: PropTypes.node,
  inputMode: PropTypes.string
};

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.onClear = function () {
    _this2.setState({
      str: ''
    });
    _this2.props.onClear(null);
  };

  this.onInputChange = function (event) {
    var str = event.target.value;
    var _props = _this2.props,
        disabledDate = _props.disabledDate,
        format = _props.format,
        onChange = _props.onChange,
        selectedValue = _props.selectedValue;

    // 没有内容，合法并直接退出

    if (!str) {
      onChange(null);
      _this2.setState({
        invalid: false,
        str: str
      });
      return;
    }

    // 不合法直接退出
    var parsed = moment(str, format, true);
    if (!parsed.isValid()) {
      _this2.setState({
        invalid: true,
        str: str
      });
      return;
    }

    var value = _this2.props.value.clone();
    value.year(parsed.year()).month(parsed.month()).date(parsed.date()).hour(parsed.hour()).minute(parsed.minute()).second(parsed.second());

    if (!value || disabledDate && disabledDate(value)) {
      _this2.setState({
        invalid: true,
        str: str
      });
      return;
    }

    if (selectedValue !== value || selectedValue && value && !selectedValue.isSame(value)) {
      _this2.setState({
        invalid: false,
        str: str
      });
      onChange(value);
    }
  };

  this.onFocus = function () {
    _this2.setState({ hasFocus: true });
  };

  this.onBlur = function () {
    _this2.setState(function (prevState, prevProps) {
      return {
        hasFocus: false,
        str: formatDate(prevProps.value, prevProps.format)
      };
    });
  };

  this.onKeyDown = function (event) {
    var keyCode = event.keyCode;
    var _props2 = _this2.props,
        onSelect = _props2.onSelect,
        value = _props2.value,
        disabledDate = _props2.disabledDate;

    if (keyCode === KeyCode.ENTER && onSelect) {
      var validateDate = !disabledDate || !disabledDate(value);
      if (validateDate) {
        onSelect(value.clone());
      }
      event.preventDefault();
    }
  };

  this.getRootDOMNode = function () {
    return ReactDOM.findDOMNode(_this2);
  };

  this.focus = function () {
    if (dateInputInstance) {
      dateInputInstance.focus();
    }
  };

  this.saveDateInput = function (dateInput) {
    dateInputInstance = dateInput;
  };
};

polyfill(DateInput);

export default DateInput;