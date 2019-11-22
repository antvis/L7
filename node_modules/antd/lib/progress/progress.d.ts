import * as PropTypes from 'prop-types';
import * as React from 'react';
import { ConfigConsumerProps } from '../config-provider';
declare const ProgressTypes: ["line", "circle", "dashboard"];
export declare type ProgressType = (typeof ProgressTypes)[number];
declare const ProgressStatuses: ["normal", "exception", "active", "success"];
export declare type ProgressSize = 'default' | 'small';
export declare type StringGradients = {
    [percentage: string]: string;
};
declare type FromToGradients = {
    from: string;
    to: string;
};
export declare type ProgressGradient = {
    direction?: string;
} & (StringGradients | FromToGradients);
export interface ProgressProps {
    prefixCls?: string;
    className?: string;
    type?: ProgressType;
    percent?: number;
    successPercent?: number;
    format?: (percent?: number, successPercent?: number) => React.ReactNode;
    status?: (typeof ProgressStatuses)[number];
    showInfo?: boolean;
    strokeWidth?: number;
    strokeLinecap?: 'butt' | 'square' | 'round';
    strokeColor?: string | ProgressGradient;
    trailColor?: string;
    width?: number;
    style?: React.CSSProperties;
    gapDegree?: number;
    gapPosition?: 'top' | 'bottom' | 'left' | 'right';
    size?: ProgressSize;
}
export default class Progress extends React.Component<ProgressProps> {
    static defaultProps: {
        type: string;
        percent: number;
        showInfo: boolean;
        trailColor: string;
        size: string;
        gapDegree: number;
        strokeLinecap: string;
    };
    static propTypes: {
        status: PropTypes.Requireable<"normal" | "active" | "success" | "exception">;
        type: PropTypes.Requireable<"circle" | "line" | "dashboard">;
        showInfo: PropTypes.Requireable<boolean>;
        percent: PropTypes.Requireable<number>;
        width: PropTypes.Requireable<number>;
        strokeWidth: PropTypes.Requireable<number>;
        strokeLinecap: PropTypes.Requireable<string>;
        strokeColor: PropTypes.Requireable<string | object>;
        trailColor: PropTypes.Requireable<string>;
        format: PropTypes.Requireable<(...args: any[]) => any>;
        gapDegree: PropTypes.Requireable<number>;
    };
    getPercentNumber(): number;
    getProgressStatus(): "normal" | "active" | "success" | "exception";
    renderProcessInfo(prefixCls: string, progressStatus: (typeof ProgressStatuses)[number]): JSX.Element | null;
    renderProgress: ({ getPrefixCls }: ConfigConsumerProps) => JSX.Element;
    render(): JSX.Element;
}
export {};
