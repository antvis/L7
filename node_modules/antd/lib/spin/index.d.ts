import * as React from 'react';
import * as PropTypes from 'prop-types';
import { ConfigConsumerProps } from '../config-provider';
declare const SpinSizes: ["small", "default", "large"];
export declare type SpinSize = (typeof SpinSizes)[number];
export declare type SpinIndicator = React.ReactElement<HTMLElement>;
export interface SpinProps {
    prefixCls?: string;
    className?: string;
    spinning?: boolean;
    style?: React.CSSProperties;
    size?: SpinSize;
    tip?: string;
    delay?: number;
    wrapperClassName?: string;
    indicator?: SpinIndicator;
}
export interface SpinState {
    spinning?: boolean;
    notCssAnimationSupported?: boolean;
}
declare class Spin extends React.Component<SpinProps, SpinState> {
    static defaultProps: {
        spinning: boolean;
        size: "small" | "default" | "large";
        wrapperClassName: string;
    };
    static propTypes: {
        prefixCls: PropTypes.Requireable<string>;
        className: PropTypes.Requireable<string>;
        spinning: PropTypes.Requireable<boolean>;
        size: PropTypes.Requireable<"small" | "default" | "large">;
        wrapperClassName: PropTypes.Requireable<string>;
        indicator: PropTypes.Requireable<PropTypes.ReactElementLike>;
    };
    static setDefaultIndicator(indicator: React.ReactNode): void;
    originalUpdateSpinning: () => void;
    constructor(props: SpinProps);
    componentDidMount(): void;
    componentDidUpdate(): void;
    componentWillUnmount(): void;
    debouncifyUpdateSpinning: (props?: SpinProps | undefined) => void;
    updateSpinning: () => void;
    cancelExistingSpin(): void;
    isNestedPattern(): boolean;
    renderSpin: ({ getPrefixCls }: ConfigConsumerProps) => JSX.Element;
    render(): JSX.Element;
}
export default Spin;
