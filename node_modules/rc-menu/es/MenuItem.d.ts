import * as React from 'react';
import { noop } from './util';
import { SelectEventHandler, HoverEventHandler, DestroyEventHandler, RenderIconType, MenuHoverEventHandler, MenuClickEventHandler, MenuMode, LegacyFunctionRef } from './interface';
export interface MenuItemProps {
    /** @deprecated No place to use this. Should remove */
    attribute?: Record<string, string>;
    rootPrefixCls?: string;
    eventKey?: React.Key;
    className?: string;
    style?: React.CSSProperties;
    active?: boolean;
    children?: React.ReactNode;
    selectedKeys?: string[];
    disabled?: boolean;
    title?: string;
    onItemHover?: HoverEventHandler;
    onSelect?: SelectEventHandler;
    onClick?: MenuClickEventHandler;
    onDeselect?: SelectEventHandler;
    parentMenu?: React.ReactInstance;
    onDestroy?: DestroyEventHandler;
    onMouseEnter?: MenuHoverEventHandler;
    onMouseLeave?: MenuHoverEventHandler;
    multiple?: boolean;
    isSelected?: boolean;
    manualRef?: LegacyFunctionRef;
    itemIcon?: RenderIconType;
    role?: string;
    mode?: MenuMode;
    inlineIndent?: number;
    level?: number;
}
export declare class MenuItem extends React.Component<MenuItemProps> {
    static isMenuItem: boolean;
    static defaultProps: {
        onSelect: typeof noop;
        onMouseEnter: typeof noop;
        onMouseLeave: typeof noop;
        manualRef: typeof noop;
    };
    node: HTMLLIElement;
    componentDidMount(): void;
    componentDidUpdate(prevProps: MenuItemProps): void;
    componentWillUnmount(): void;
    onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => boolean;
    onMouseLeave: React.MouseEventHandler<HTMLElement>;
    onMouseEnter: React.MouseEventHandler<HTMLElement>;
    onClick: React.MouseEventHandler<HTMLElement>;
    getPrefixCls(): string;
    getActiveClassName(): string;
    getSelectedClassName(): string;
    getDisabledClassName(): string;
    saveNode: (node: HTMLLIElement) => void;
    callRef(): void;
    render(): JSX.Element;
}
declare const connected: any;
export default connected;
