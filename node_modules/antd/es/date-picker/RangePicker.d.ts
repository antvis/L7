import * as React from 'react';
import * as moment from 'moment';
import { ConfigConsumerProps } from '../config-provider';
import { RangePickerValue, RangePickerPresetRange, RangePickerProps } from './interface';
export interface RangePickerState {
    value?: RangePickerValue;
    showDate?: RangePickerValue;
    open?: boolean;
    hoverValue?: RangePickerValue;
}
declare class RangePicker extends React.Component<RangePickerProps, RangePickerState> {
    static defaultProps: {
        allowClear: boolean;
        showToday: boolean;
        separator: string;
    };
    static getDerivedStateFromProps(nextProps: RangePickerProps, prevState: RangePickerState): {
        value: RangePickerValue;
    } | {
        showDate: undefined[] | [moment.Moment] | [undefined, moment.Moment] | [moment.Moment, undefined] | [moment.Moment, moment.Moment] | undefined;
        value: RangePickerValue;
    } | {
        open: boolean | undefined;
        value?: undefined;
    } | {
        open: boolean | undefined;
        value: RangePickerValue;
    } | {
        open: boolean | undefined;
        showDate: undefined[] | [moment.Moment] | [undefined, moment.Moment] | [moment.Moment, undefined] | [moment.Moment, moment.Moment] | undefined;
        value: RangePickerValue;
    } | null;
    private picker;
    private prefixCls?;
    private tagPrefixCls?;
    constructor(props: any);
    componentDidUpdate(_: any, prevState: RangePickerState): void;
    setValue(value: RangePickerValue, hidePanel?: boolean): void;
    savePicker: (node: HTMLSpanElement) => void;
    clearSelection: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
    clearHoverValue: () => void;
    handleChange: (value: RangePickerValue) => void;
    handleOpenChange: (open: boolean) => void;
    handleShowDateChange: (showDate: RangePickerValue) => void;
    handleHoverChange: (hoverValue: any) => void;
    handleRangeMouseLeave: () => void;
    handleCalendarInputSelect: (value: RangePickerValue) => void;
    handleRangeClick: (value: RangePickerPresetRange) => void;
    focus(): void;
    blur(): void;
    renderFooter: () => (JSX.Element | null)[] | null;
    renderRangePicker: ({ getPrefixCls }: ConfigConsumerProps) => JSX.Element;
    render(): JSX.Element;
}
export default RangePicker;
