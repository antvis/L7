import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import PropTypes from 'prop-types';
import CalendarHeader from '../calendar/CalendarHeader';
import DateTable from '../date/DateTable';
import DateInput from '../date/DateInput';
import { getTimeConfig } from '../util/index';

var CalendarPart = function (_React$Component) {
  _inherits(CalendarPart, _React$Component);

  function CalendarPart() {
    _classCallCheck(this, CalendarPart);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  CalendarPart.prototype.render = function render() {
    var props = this.props;
    var prefixCls = props.prefixCls,
        value = props.value,
        hoverValue = props.hoverValue,
        selectedValue = props.selectedValue,
        mode = props.mode,
        direction = props.direction,
        locale = props.locale,
        format = props.format,
        placeholder = props.placeholder,
        disabledDate = props.disabledDate,
        timePicker = props.timePicker,
        disabledTime = props.disabledTime,
        timePickerDisabledTime = props.timePickerDisabledTime,
        showTimePicker = props.showTimePicker,
        onInputChange = props.onInputChange,
        onInputSelect = props.onInputSelect,
        enablePrev = props.enablePrev,
        enableNext = props.enableNext,
        clearIcon = props.clearIcon,
        showClear = props.showClear,
        inputMode = props.inputMode;

    var shouldShowTimePicker = showTimePicker && timePicker;
    var disabledTimeConfig = shouldShowTimePicker && disabledTime ? getTimeConfig(selectedValue, disabledTime) : null;
    var rangeClassName = prefixCls + '-range';
    var newProps = {
      locale: locale,
      value: value,
      prefixCls: prefixCls,
      showTimePicker: showTimePicker
    };
    var index = direction === 'left' ? 0 : 1;
    var timePickerEle = shouldShowTimePicker && React.cloneElement(timePicker, _extends({
      showHour: true,
      showMinute: true,
      showSecond: true
    }, timePicker.props, disabledTimeConfig, timePickerDisabledTime, {
      onChange: onInputChange,
      defaultOpenValue: value,
      value: selectedValue[index]
    }));

    var dateInputElement = props.showDateInput && React.createElement(DateInput, {
      format: format,
      locale: locale,
      prefixCls: prefixCls,
      timePicker: timePicker,
      disabledDate: disabledDate,
      placeholder: placeholder,
      disabledTime: disabledTime,
      value: value,
      showClear: showClear || false,
      selectedValue: selectedValue[index],
      onChange: onInputChange,
      onSelect: onInputSelect,
      clearIcon: clearIcon,
      inputMode: inputMode
    });

    return React.createElement(
      'div',
      {
        className: rangeClassName + '-part ' + rangeClassName + '-' + direction
      },
      dateInputElement,
      React.createElement(
        'div',
        { style: { outline: 'none' } },
        React.createElement(CalendarHeader, _extends({}, newProps, {
          mode: mode,
          enableNext: enableNext,
          enablePrev: enablePrev,
          onValueChange: props.onValueChange,
          onPanelChange: props.onPanelChange,
          disabledMonth: props.disabledMonth
        })),
        showTimePicker ? React.createElement(
          'div',
          { className: prefixCls + '-time-picker' },
          React.createElement(
            'div',
            { className: prefixCls + '-time-picker-panel' },
            timePickerEle
          )
        ) : null,
        React.createElement(
          'div',
          { className: prefixCls + '-body' },
          React.createElement(DateTable, _extends({}, newProps, {
            hoverValue: hoverValue,
            selectedValue: selectedValue,
            dateRender: props.dateRender,
            onSelect: props.onSelect,
            onDayHover: props.onDayHover,
            disabledDate: disabledDate,
            showWeekNumber: props.showWeekNumber
          }))
        )
      )
    );
  };

  return CalendarPart;
}(React.Component);

CalendarPart.propTypes = {
  prefixCls: PropTypes.string,
  value: PropTypes.any,
  hoverValue: PropTypes.any,
  selectedValue: PropTypes.any,
  direction: PropTypes.any,
  locale: PropTypes.any,
  showDateInput: PropTypes.bool,
  showTimePicker: PropTypes.bool,
  format: PropTypes.any,
  placeholder: PropTypes.any,
  disabledDate: PropTypes.any,
  timePicker: PropTypes.any,
  disabledTime: PropTypes.any,
  onInputChange: PropTypes.func,
  onInputSelect: PropTypes.func,
  timePickerDisabledTime: PropTypes.object,
  enableNext: PropTypes.any,
  enablePrev: PropTypes.any,
  clearIcon: PropTypes.node,
  dateRender: PropTypes.func,
  inputMode: PropTypes.string
};
export default CalendarPart;