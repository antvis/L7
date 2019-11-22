import * as React from 'react';
import { TooltipPlacement } from '../tooltip';
import { ConfigConsumerProps } from '../config-provider';
export interface SliderMarks {
    [key: number]: React.ReactNode | {
        style: React.CSSProperties;
        label: React.ReactNode;
    };
}
export declare type SliderValue = number | [number, number];
interface HandleGeneratorInfo {
    value: number;
    dragging: boolean;
    index: number;
    rest: any[];
}
export declare type HandleGeneratorFn = (tooltipPrefixCls: string, info: HandleGeneratorInfo) => React.ReactNode;
export interface SliderProps {
    prefixCls?: string;
    tooltipPrefixCls?: string;
    range?: boolean;
    reverse?: boolean;
    min?: number;
    max?: number;
    step?: number | null;
    marks?: SliderMarks;
    dots?: boolean;
    value?: SliderValue;
    defaultValue?: SliderValue;
    included?: boolean;
    disabled?: boolean;
    vertical?: boolean;
    onChange?: (value: SliderValue) => void;
    onAfterChange?: (value: SliderValue) => void;
    tipFormatter?: null | ((value: number) => React.ReactNode);
    className?: string;
    id?: string;
    style?: React.CSSProperties;
    tooltipVisible?: boolean;
    tooltipPlacement?: TooltipPlacement;
    getTooltipPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
}
export interface SliderState {
    visibles: {
        [index: number]: boolean;
    };
}
export default class Slider extends React.Component<SliderProps, SliderState> {
    static defaultProps: {
        tipFormatter(value: number): string;
    };
    rcSlider: any;
    constructor(props: SliderProps);
    toggleTooltipVisible: (index: number, visible: boolean) => void;
    handleWithTooltip: HandleGeneratorFn;
    saveSlider: (node: any) => void;
    focus(): void;
    blur(): void;
    renderSlider: ({ getPrefixCls }: ConfigConsumerProps) => JSX.Element;
    render(): JSX.Element;
}
export {};
