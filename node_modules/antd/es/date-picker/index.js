function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import RcCalendar from 'rc-calendar';
import MonthCalendar from "rc-calendar/es/MonthCalendar";
import createPicker from './createPicker';
import wrapPicker from './wrapPicker';
import RangePicker from './RangePicker';
import WeekPicker from './WeekPicker';
var DatePicker = wrapPicker(createPicker(RcCalendar), 'date');
var MonthPicker = wrapPicker(createPicker(MonthCalendar), 'month');

_extends(DatePicker, {
  RangePicker: wrapPicker(RangePicker, 'date'),
  MonthPicker: MonthPicker,
  WeekPicker: wrapPicker(WeekPicker, 'week')
});

export default DatePicker;
//# sourceMappingURL=index.js.map
