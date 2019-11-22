import * as React from 'react';
import * as PropTypes from 'prop-types';
import { ConfigConsumerProps } from '../config-provider';
export declare type SwitchSize = 'small' | 'default';
export declare type SwitchChangeEventHandler = (checked: boolean, event: MouseEvent) => void;
export declare type SwitchClickEventHandler = SwitchChangeEventHandler;
export interface SwitchProps {
    prefixCls?: string;
    size?: SwitchSize;
    className?: string;
    checked?: boolean;
    defaultChecked?: boolean;
    onChange?: SwitchChangeEventHandler;
    onClick?: SwitchClickEventHandler;
    checkedChildren?: React.ReactNode;
    unCheckedChildren?: React.ReactNode;
    disabled?: boolean;
    loading?: boolean;
    autoFocus?: boolean;
    style?: React.CSSProperties;
    title?: string;
}
export default class Switch extends React.Component<SwitchProps, {}> {
    static __ANT_SWITCH: boolean;
    static propTypes: {
        prefixCls: PropTypes.Requireable<string>;
        size: PropTypes.Requireable<"small" | "default" | undefined>;
        className: PropTypes.Requireable<string>;
    };
    private rcSwitch;
    constructor(props: SwitchProps);
    saveSwitch: (node: any) => void;
    focus(): void;
    blur(): void;
    renderSwitch: ({ getPrefixCls }: ConfigConsumerProps) => JSX.Element;
    render(): JSX.Element;
}
