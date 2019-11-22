import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import PropTypes from 'prop-types';
import KeyCode from 'rc-util/es/KeyCode';
import { polyfill } from 'react-lifecycles-compat';
import CalendarHeader from './calendar/CalendarHeader';
import CalendarFooter from './calendar/CalendarFooter';
import { calendarMixinWrapper, calendarMixinPropTypes, calendarMixinDefaultProps } from './mixin/CalendarMixin';
import { commonMixinWrapper, propType, defaultProp } from './mixin/CommonMixin';
import moment from 'moment';

var MonthCalendar = function (_React$Component) {
  _inherits(MonthCalendar, _React$Component);

  function MonthCalendar(props) {
    _classCallCheck(this, MonthCalendar);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    _this.onKeyDown = function (event) {
      var keyCode = event.keyCode;
      var ctrlKey = event.ctrlKey || event.metaKey;
      var stateValue = _this.state.value;
      var disabledDate = _this.props.disabledDate;

      var value = stateValue;
      switch (keyCode) {
        case KeyCode.DOWN:
          value = stateValue.clone();
          value.add(3, 'months');
          break;
        case KeyCode.UP:
          value = stateValue.clone();
          value.add(-3, 'months');
          break;
        case KeyCode.LEFT:
          value = stateValue.clone();
          if (ctrlKey) {
            value.add(-1, 'years');
          } else {
            value.add(-1, 'months');
          }
          break;
        case KeyCode.RIGHT:
          value = stateValue.clone();
          if (ctrlKey) {
            value.add(1, 'years');
          } else {
            value.add(1, 'months');
          }
          break;
        case KeyCode.ENTER:
          if (!disabledDate || !disabledDate(stateValue)) {
            _this.onSelect(stateValue);
          }
          event.preventDefault();
          return 1;
        default:
          return undefined;
      }
      if (value !== stateValue) {
        _this.setValue(value);
        event.preventDefault();
        return 1;
      }
    };

    _this.handlePanelChange = function (_, mode) {
      if (mode !== 'date') {
        _this.setState({ mode: mode });
      }
    };

    _this.state = {
      mode: 'month',
      value: props.value || props.defaultValue || moment(),
      selectedValue: props.selectedValue || props.defaultSelectedValue
    };
    return _this;
  }

  MonthCalendar.prototype.render = function render() {
    var props = this.props,
        state = this.state;
    var mode = state.mode,
        value = state.value;

    var children = React.createElement(
      'div',
      { className: props.prefixCls + '-month-calendar-content' },
      React.createElement(
        'div',
        { className: props.prefixCls + '-month-header-wrap' },
        React.createElement(CalendarHeader, {
          prefixCls: props.prefixCls,
          mode: mode,
          value: value,
          locale: props.locale,
          disabledMonth: props.disabledDate,
          monthCellRender: props.monthCellRender,
          monthCellContentRender: props.monthCellContentRender,
          onMonthSelect: this.onSelect,
          onValueChange: this.setValue,
          onPanelChange: this.handlePanelChange
        })
      ),
      React.createElement(CalendarFooter, {
        prefixCls: props.prefixCls,
        renderFooter: props.renderFooter
      })
    );
    return this.renderRoot({
      className: props.prefixCls + '-month-calendar',
      children: children
    });
  };

  return MonthCalendar;
}(React.Component);

MonthCalendar.propTypes = _extends({}, calendarMixinPropTypes, propType, {
  monthCellRender: PropTypes.func,
  value: PropTypes.object,
  defaultValue: PropTypes.object,
  selectedValue: PropTypes.object,
  defaultSelectedValue: PropTypes.object,
  disabledDate: PropTypes.func
});
MonthCalendar.defaultProps = _extends({}, defaultProp, calendarMixinDefaultProps);


export default polyfill(calendarMixinWrapper(commonMixinWrapper(MonthCalendar)));