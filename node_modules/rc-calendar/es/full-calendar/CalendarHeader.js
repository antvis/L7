import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getMonthName } from '../util';

function noop() {}

var CalendarHeader = function (_Component) {
  _inherits(CalendarHeader, _Component);

  function CalendarHeader() {
    _classCallCheck(this, CalendarHeader);

    return _possibleConstructorReturn(this, _Component.apply(this, arguments));
  }

  CalendarHeader.prototype.onYearChange = function onYearChange(year) {
    var newValue = this.props.value.clone();
    newValue.year(parseInt(year, 10));
    this.props.onValueChange(newValue);
  };

  CalendarHeader.prototype.onMonthChange = function onMonthChange(month) {
    var newValue = this.props.value.clone();
    newValue.month(parseInt(month, 10));
    this.props.onValueChange(newValue);
  };

  CalendarHeader.prototype.yearSelectElement = function yearSelectElement(year) {
    var _props = this.props,
        yearSelectOffset = _props.yearSelectOffset,
        yearSelectTotal = _props.yearSelectTotal,
        prefixCls = _props.prefixCls,
        Select = _props.Select;

    var start = year - yearSelectOffset;
    var end = start + yearSelectTotal;

    var options = [];
    for (var index = start; index < end; index++) {
      options.push(React.createElement(
        Select.Option,
        { key: '' + index },
        index
      ));
    }
    return React.createElement(
      Select,
      {
        className: prefixCls + '-header-year-select',
        onChange: this.onYearChange.bind(this),
        dropdownStyle: { zIndex: 2000 },
        dropdownMenuStyle: { maxHeight: 250, overflow: 'auto', fontSize: 12 },
        optionLabelProp: 'children',
        value: String(year),
        showSearch: false
      },
      options
    );
  };

  CalendarHeader.prototype.monthSelectElement = function monthSelectElement(month) {
    var props = this.props;
    var t = props.value.clone();
    var prefixCls = props.prefixCls;

    var options = [];
    var Select = props.Select;

    for (var index = 0; index < 12; index++) {
      t.month(index);
      options.push(React.createElement(
        Select.Option,
        { key: '' + index },
        getMonthName(t)
      ));
    }

    return React.createElement(
      Select,
      {
        className: prefixCls + '-header-month-select',
        dropdownStyle: { zIndex: 2000 },
        dropdownMenuStyle: { maxHeight: 250, overflow: 'auto', overflowX: 'hidden', fontSize: 12 },
        optionLabelProp: 'children',
        value: String(month),
        showSearch: false,
        onChange: this.onMonthChange.bind(this)
      },
      options
    );
  };

  CalendarHeader.prototype.changeTypeToDate = function changeTypeToDate() {
    this.props.onTypeChange('date');
  };

  CalendarHeader.prototype.changeTypeToMonth = function changeTypeToMonth() {
    this.props.onTypeChange('month');
  };

  CalendarHeader.prototype.render = function render() {
    var _props2 = this.props,
        value = _props2.value,
        locale = _props2.locale,
        prefixCls = _props2.prefixCls,
        type = _props2.type,
        showTypeSwitch = _props2.showTypeSwitch,
        headerComponents = _props2.headerComponents;

    var year = value.year();
    var month = value.month();
    var yearSelect = this.yearSelectElement(year);
    var monthSelect = type === 'month' ? null : this.monthSelectElement(month);
    var switchCls = prefixCls + '-header-switcher';
    var typeSwitcher = showTypeSwitch ? React.createElement(
      'span',
      { className: switchCls },
      type === 'date' ? React.createElement(
        'span',
        { className: switchCls + '-focus' },
        locale.month
      ) : React.createElement(
        'span',
        {
          onClick: this.changeTypeToDate.bind(this),
          className: switchCls + '-normal'
        },
        locale.month
      ),
      type === 'month' ? React.createElement(
        'span',
        { className: switchCls + '-focus' },
        locale.year
      ) : React.createElement(
        'span',
        {
          onClick: this.changeTypeToMonth.bind(this),
          className: switchCls + '-normal'
        },
        locale.year
      )
    ) : null;

    return React.createElement(
      'div',
      { className: prefixCls + '-header' },
      typeSwitcher,
      monthSelect,
      yearSelect,
      headerComponents
    );
  };

  return CalendarHeader;
}(Component);

CalendarHeader.propTypes = {
  value: PropTypes.object,
  locale: PropTypes.object,
  yearSelectOffset: PropTypes.number,
  yearSelectTotal: PropTypes.number,
  onValueChange: PropTypes.func,
  onTypeChange: PropTypes.func,
  Select: PropTypes.func,
  prefixCls: PropTypes.string,
  type: PropTypes.string,
  showTypeSwitch: PropTypes.bool,
  headerComponents: PropTypes.array
};
CalendarHeader.defaultProps = {
  yearSelectOffset: 10,
  yearSelectTotal: 20,
  onValueChange: noop,
  onTypeChange: noop
};

export default CalendarHeader;