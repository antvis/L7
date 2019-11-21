import * as React from 'react';
import * as PropTypes from 'prop-types';
import Group from './button-group';
import { ConfigConsumerProps } from '../config-provider';
import { Omit } from '../_util/type';
declare const ButtonTypes: ["default", "primary", "ghost", "dashed", "danger", "link"];
export declare type ButtonType = (typeof ButtonTypes)[number];
declare const ButtonShapes: ["circle", "circle-outline", "round"];
export declare type ButtonShape = (typeof ButtonShapes)[number];
declare const ButtonSizes: ["large", "default", "small"];
export declare type ButtonSize = (typeof ButtonSizes)[number];
declare const ButtonHTMLTypes: ["submit", "button", "reset"];
export declare type ButtonHTMLType = (typeof ButtonHTMLTypes)[number];
export interface BaseButtonProps {
    type?: ButtonType;
    icon?: string;
    shape?: ButtonShape;
    size?: ButtonSize;
    loading?: boolean | {
        delay?: number;
    };
    prefixCls?: string;
    className?: string;
    ghost?: boolean;
    block?: boolean;
    children?: React.ReactNode;
}
export declare type AnchorButtonProps = {
    href: string;
    target?: string;
    onClick?: React.MouseEventHandler<HTMLElement>;
} & BaseButtonProps & Omit<React.AnchorHTMLAttributes<any>, 'type' | 'onClick'>;
export declare type NativeButtonProps = {
    htmlType?: ButtonHTMLType;
    onClick?: React.MouseEventHandler<HTMLElement>;
} & BaseButtonProps & Omit<React.ButtonHTMLAttributes<any>, 'type' | 'onClick'>;
export declare type ButtonProps = Partial<AnchorButtonProps & NativeButtonProps>;
interface ButtonState {
    loading?: boolean | {
        delay?: number;
    };
    hasTwoCNChar: boolean;
}
declare class Button extends React.Component<ButtonProps, ButtonState> {
    static Group: typeof Group;
    static __ANT_BUTTON: boolean;
    static defaultProps: {
        loading: boolean;
        ghost: boolean;
        block: boolean;
        htmlType: string;
    };
    static propTypes: {
        type: PropTypes.Requireable<string>;
        shape: PropTypes.Requireable<"circle" | "round" | "circle-outline">;
        size: PropTypes.Requireable<"small" | "default" | "large">;
        htmlType: PropTypes.Requireable<"button" | "reset" | "submit">;
        onClick: PropTypes.Requireable<(...args: any[]) => any>;
        loading: PropTypes.Requireable<boolean | object>;
        className: PropTypes.Requireable<string>;
        icon: PropTypes.Requireable<string>;
        block: PropTypes.Requireable<boolean>;
        title: PropTypes.Requireable<string>;
    };
    private delayTimeout;
    private buttonNode;
    constructor(props: ButtonProps);
    componentDidMount(): void;
    componentDidUpdate(prevProps: ButtonProps): void;
    componentWillUnmount(): void;
    saveButtonRef: (node: HTMLElement | null) => void;
    handleClick: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
    fixTwoCNChar(): void;
    isNeedInserted(): boolean;
    renderButton: ({ getPrefixCls, autoInsertSpaceInButton }: ConfigConsumerProps) => JSX.Element;
    render(): JSX.Element;
}
export default Button;
