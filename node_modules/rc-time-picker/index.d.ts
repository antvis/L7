declare module "rc-time-picker" {
  import { Moment } from "moment";
  import * as React from "react";

  type TimePickerProps = {
    prefixCls?: string;
    clearText?: string;
    disabled?: boolean;
    allowEmpty?: boolean;
    open?: boolean;
    defaultValue?: Moment;
    defaultOpenValue?: Moment;
    value?: Moment;
    placeholder?: string;
    className?: string;
    id?: string;
    popupClassName?: string;
    showHour?: boolean;
    showMinute?: boolean;
    showSecond?: boolean;
    format?: string;
    disabledHours?: () => number[];
    disabledMinutes?: (hour: number) => number[];
    disabledSeconds?: (hour: number, minute: number) => number[];
    use12Hours?: boolean;
    hideDisabledOptions?: boolean;
    onChange?: (newValue: Moment) => void;
    addon?: (instance: typeof Panel) => React.ReactNode;
    placement?: string;
    transitionName?: string;
    name?: string;
    onOpen?: (newState: {open: true}) => void;
    onClose?: (newState: {open: false}) => void;
    hourStep?: number;
    minuteStep?: number;
    secondStep?: number;
    focusOnOpen?: boolean;
    inputReadOnly?: boolean;
    inputIcon?: React.ReactNode;
    clearIcon?: React.ReactNode;
  };
  export default class TimePicker extends React.Component<TimePickerProps> {
    focus(): void;
    blur(): void;
  }
  class Panel extends React.Component<unknown> {
    close(): void;
  }
}
