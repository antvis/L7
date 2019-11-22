import * as React from 'react';
export declare type IPlacement = 'left' | 'top' | 'right' | 'bottom';
declare type ILevelMove = number | [number, number];
declare type IStringOrHtmlElement = string | HTMLElement;
declare type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
interface IProps extends Omit<React.HTMLAttributes<any>, 'onChange'> {
    prefixCls?: string;
    width?: string | number;
    height?: string | number;
    open?: boolean;
    defaultOpen?: boolean;
    handler?: React.ReactElement | null | false;
    placement?: IPlacement;
    level?: null | string | string[];
    levelMove?: ILevelMove | ((e: {
        target: HTMLElement;
        open: boolean;
    }) => ILevelMove);
    duration?: string;
    ease?: string;
    showMask?: boolean;
    maskClosable?: boolean;
    maskStyle?: React.CSSProperties;
    onChange?: ((open?: boolean) => void);
    afterVisibleChange?: ((open: boolean) => void);
    onHandleClick?: ((e: React.MouseEvent | React.KeyboardEvent) => void);
    onClose?: ((e: React.MouseEvent | React.KeyboardEvent) => void);
    keyboard?: boolean;
}
export interface IDrawerProps extends IProps {
    wrapperClassName?: string;
    forceRender?: boolean;
    getContainer?: IStringOrHtmlElement | (() => IStringOrHtmlElement) | null | false;
}
export interface IDrawerChildProps extends IProps {
    getContainer?: () => HTMLElement;
    getOpenCount?: () => number;
}
export {};
