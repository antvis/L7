import * as React from 'react';
import SubPopupMenu from './SubPopupMenu';
import { noop } from './util';
import { RenderIconType, SelectInfo, SelectEventHandler, DestroyEventHandler, MenuMode, OpenEventHandler, OpenAnimation, MiniStore, BuiltinPlacements, TriggerSubMenuAction, MenuClickEventHandler, MotionType } from './interface';
export interface MenuProps {
    defaultSelectedKeys?: string[];
    defaultActiveFirst?: boolean;
    selectedKeys?: string[];
    defaultOpenKeys?: string[];
    openKeys?: string[];
    mode?: MenuMode;
    getPopupContainer?: (node: HTMLElement) => HTMLElement;
    onClick?: MenuClickEventHandler;
    onSelect?: SelectEventHandler;
    onOpenChange?: OpenEventHandler;
    onDeselect?: SelectEventHandler;
    onDestroy?: DestroyEventHandler;
    subMenuOpenDelay?: number;
    subMenuCloseDelay?: number;
    forceSubMenuRender?: boolean;
    triggerSubMenuAction?: TriggerSubMenuAction;
    level?: number;
    selectable?: boolean;
    multiple?: boolean;
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    activeKey?: string;
    prefixCls?: string;
    builtinPlacements?: BuiltinPlacements;
    itemIcon?: RenderIconType;
    expandIcon?: RenderIconType;
    overflowedIndicator?: React.ReactNode;
    /** Menu motion define */
    motion?: MotionType;
    /** @deprecated Please use `motion` instead */
    openTransitionName?: string;
    /** @deprecated Please use `motion` instead */
    openAnimation?: OpenAnimation;
}
declare class Menu extends React.Component<MenuProps> {
    static defaultProps: {
        selectable: boolean;
        onClick: typeof noop;
        onSelect: typeof noop;
        onOpenChange: typeof noop;
        onDeselect: typeof noop;
        defaultSelectedKeys: any[];
        defaultOpenKeys: any[];
        subMenuOpenDelay: number;
        subMenuCloseDelay: number;
        triggerSubMenuAction: string;
        prefixCls: string;
        className: string;
        mode: string;
        style: {};
        builtinPlacements: {};
        overflowedIndicator: JSX.Element;
    };
    constructor(props: MenuProps);
    isRootMenu: boolean;
    store: MiniStore;
    innerMenu: typeof SubPopupMenu;
    componentDidMount(): void;
    componentDidUpdate(): void;
    onSelect: (selectInfo: SelectInfo) => void;
    onClick: MenuClickEventHandler;
    onKeyDown: (e: React.KeyboardEvent<HTMLElement>, callback: any) => void;
    onOpenChange: (event: any) => void;
    onDeselect: (selectInfo: SelectInfo) => void;
    getOpenTransitionName: () => string;
    setInnerMenu: (node: any) => void;
    updateMiniStore(): void;
    render(): JSX.Element;
}
export default Menu;
