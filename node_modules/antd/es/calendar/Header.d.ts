import * as React from 'react';
import * as moment from 'moment';
import { RadioChangeEvent } from '../radio';
import { ConfigConsumerProps } from '../config-provider';
export interface RenderHeader {
    value: moment.Moment;
    onChange?: (value: moment.Moment) => void;
    type: string;
    onTypeChange: (type: string) => void;
}
export declare type HeaderRender = (headerRender: RenderHeader) => React.ReactNode;
export interface HeaderProps {
    prefixCls?: string;
    locale?: any;
    fullscreen?: boolean;
    yearSelectOffset?: number;
    yearSelectTotal?: number;
    type?: string;
    onValueChange?: (value: moment.Moment) => void;
    onTypeChange?: (type: string) => void;
    value: moment.Moment;
    validRange?: [moment.Moment, moment.Moment];
    headerRender?: HeaderRender;
}
export default class Header extends React.Component<HeaderProps, any> {
    static defaultProps: {
        yearSelectOffset: number;
        yearSelectTotal: number;
    };
    private calenderHeaderNode;
    getYearSelectElement(prefixCls: string, year: number): JSX.Element;
    getMonthSelectElement(prefixCls: string, month: number, months: number[]): JSX.Element;
    onYearChange: (year: string) => void;
    onMonthChange: (month: string) => void;
    onInternalTypeChange: (e: RadioChangeEvent) => void;
    onTypeChange: (type: string) => void;
    getCalenderHeaderNode: (node: HTMLDivElement) => void;
    getMonthYearSelections: (getPrefixCls: (suffixCls: string, customizePrefixCls?: string | undefined) => string) => {
        yearReactNode: JSX.Element;
        monthReactNode: JSX.Element | null;
    };
    getTypeSwitch: () => JSX.Element;
    headerRenderCustom: (headerRender: HeaderRender) => React.ReactNode;
    renderHeader: ({ getPrefixCls }: ConfigConsumerProps) => {} | null | undefined;
    render(): JSX.Element;
}
