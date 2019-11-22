import * as React from 'react';
import * as moment from 'moment';
export declare function generateShowHourMinuteSecond(format: string): {
    showHour: boolean;
    showMinute: boolean;
    showSecond: boolean;
};
export interface TimePickerProps {
    className?: string;
    size?: 'large' | 'default' | 'small';
    value?: moment.Moment;
    defaultValue?: moment.Moment | moment.Moment[];
    open?: boolean;
    format?: string;
    onChange?: (time: moment.Moment, timeString: string) => void;
    onOpenChange?: (open: boolean) => void;
    onAmPmChange?: (ampm: 'AM' | 'PM') => void;
    disabled?: boolean;
    placeholder?: string;
    prefixCls?: string;
    hideDisabledOptions?: boolean;
    disabledHours?: () => number[];
    disabledMinutes?: (selectedHour: number) => number[];
    disabledSeconds?: (selectedHour: number, selectedMinute: number) => number[];
    style?: React.CSSProperties;
    getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
    addon?: Function;
    use12Hours?: boolean;
    focusOnOpen?: boolean;
    hourStep?: number;
    minuteStep?: number;
    secondStep?: number;
    allowEmpty?: boolean;
    allowClear?: boolean;
    inputReadOnly?: boolean;
    clearText?: string;
    defaultOpenValue?: moment.Moment;
    popupClassName?: string;
    popupStyle?: React.CSSProperties;
    suffixIcon?: React.ReactNode;
    clearIcon?: React.ReactNode;
    locale?: TimePickerLocale;
}
export interface TimePickerLocale {
    placeholder: string;
}
declare class TimePicker extends React.Component<TimePickerProps, any> {
    static defaultProps: {
        align: {
            offset: number[];
        };
        disabledHours: undefined;
        disabledMinutes: undefined;
        disabledSeconds: undefined;
        hideDisabledOptions: boolean;
        placement: string;
        transitionName: string;
        focusOnOpen: boolean;
    };
    static getDerivedStateFromProps(nextProps: TimePickerProps): {
        value: moment.Moment | undefined;
    } | null;
    private timePickerRef;
    constructor(props: TimePickerProps);
    getDefaultFormat(): string;
    getAllowClear(): boolean | undefined;
    getDefaultLocale: () => {
        placeholder: string;
    } | {
        placeholder: string;
    };
    handleOpenClose: ({ open }: {
        open: boolean;
    }) => void;
    saveTimePicker: (timePickerRef: any) => void;
    handleChange: (value: moment.Moment) => void;
    focus(): void;
    blur(): void;
    renderInputIcon(prefixCls: string): JSX.Element;
    renderClearIcon(prefixCls: string): JSX.Element;
    renderTimePicker: (locale: TimePickerLocale) => JSX.Element;
    render(): JSX.Element;
}
export default TimePicker;
