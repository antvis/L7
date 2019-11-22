// Type definitions for rc-calendar 9.6
// Project: http://github.com/react-component/calendar
// Definitions by: 9renpoto <https://github.com/9renpoto>
// Definitions: https://github.com/react-component/calendar

import * as React from 'react';
import { Moment } from 'moment';

export type Mode = 'time' | 'date' | 'month' | 'year' | 'decade';

export interface Props {
  prefixCls?: string;
  className?: string;
  style?: React.CSSProperties;
  defaultValue?: Moment;
  value?: Moment;
  selectedValue?: Moment;
  mode?: Mode;
  locale?: object;
  format?: string | string[];
  showDateInput?: boolean;
  showWeekNumber?: boolean;
  showToday?: boolean;
  showOk?: boolean;
  onSelect?: (date: Moment) => void;
  onOk?: () => void;
  onKeyDown?: () => void;
  timePicker?: React.ReactNode;
  dateInputPlaceholder?: string;
  onClear?: () => void;
  onChange?: (date: Moment | null) => void;
  onPanelChange?: (date: Moment | null, mode: Mode) => void;
  disabledDate?: (current: Moment | undefined) => boolean;
  disabledTime?: (current: Moment | undefined) => object;
  dateRender?: (current: Moment, value: Moment) => React.ReactNode;
  renderFooter?: () => React.ReactNode;
  renderSidebar?: () => React.ReactNode;
  inputMode?: String;
  monthCellRender?: (current: Moment, locale: Object) => string;
  monthCellContentRender?: (current: Moment, locale: Object) => React.ReactNode;
}

export default class ReactCalendar extends React.Component<Props> {}
