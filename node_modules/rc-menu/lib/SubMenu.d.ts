import * as React from 'react';
import { noop } from './util';
import { MiniStore, RenderIconType, LegacyFunctionRef, MenuMode, OpenEventHandler, SelectEventHandler, DestroyEventHandler, MenuHoverEventHandler, MenuClickEventHandler, MenuInfo, BuiltinPlacements, TriggerSubMenuAction, HoverEventHandler, MotionType } from './interface';
import { MenuItem } from './MenuItem';
export interface SubMenuProps {
    parentMenu?: React.ReactElement & {
        isRootMenu: boolean;
        subMenuInstance: React.ReactInstance;
    };
    title?: React.ReactNode;
    children?: React.ReactNode;
    selectedKeys?: string[];
    openKeys?: string[];
    onClick?: MenuClickEventHandler;
    onOpenChange?: OpenEventHandler;
    rootPrefixCls?: string;
    eventKey?: string;
    multiple?: boolean;
    active?: boolean;
    onItemHover?: HoverEventHandler;
    onSelect?: SelectEventHandler;
    triggerSubMenuAction?: TriggerSubMenuAction;
    onDeselect?: SelectEventHandler;
    onDestroy?: DestroyEventHandler;
    onMouseEnter?: MenuHoverEventHandler;
    onMouseLeave?: MenuHoverEventHandler;
    onTitleMouseEnter?: MenuHoverEventHandler;
    onTitleMouseLeave?: MenuHoverEventHandler;
    onTitleClick?: (info: {
        key: React.Key;
        domEvent: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>;
    }) => void;
    popupOffset?: number[];
    isOpen?: boolean;
    store?: MiniStore;
    mode?: MenuMode;
    manualRef?: LegacyFunctionRef;
    itemIcon?: RenderIconType;
    expandIcon?: RenderIconType;
    inlineIndent?: number;
    level?: number;
    subMenuOpenDelay?: number;
    subMenuCloseDelay?: number;
    forceSubMenuRender?: boolean;
    builtinPlacements?: BuiltinPlacements;
    disabled?: boolean;
    className?: string;
    popupClassName?: string;
    motion?: MotionType;
}
export declare class SubMenu extends React.Component<SubMenuProps> {
    static defaultProps: {
        onMouseEnter: typeof noop;
        onMouseLeave: typeof noop;
        onTitleMouseEnter: typeof noop;
        onTitleMouseLeave: typeof noop;
        onTitleClick: typeof noop;
        manualRef: typeof noop;
        mode: string;
        title: string;
    };
    constructor(props: SubMenuProps);
    isRootMenu: boolean;
    menuInstance: MenuItem;
    subMenuTitle: HTMLElement;
    internalMenuId: string;
    haveRendered: boolean;
    haveOpened: boolean;
    /**
     * Follow timeout should be `number`.
     * Current is only convert code into TS,
     * we not use `window.setTimeout` instead of `setTimeout`.
     */
    minWidthTimeout: any;
    mouseenterTimeout: any;
    componentDidMount(): void;
    componentDidUpdate(): void;
    componentWillUnmount(): void;
    onDestroy: (key: string) => void;
    /**
     * note:
     *  This legacy code that `onKeyDown` is called by parent instead of dom self.
     *  which need return code to check if this event is handled
     */
    onKeyDown: React.KeyboardEventHandler<HTMLElement>;
    onOpenChange: OpenEventHandler;
    onPopupVisibleChange: (visible: boolean) => void;
    onMouseEnter: React.MouseEventHandler<HTMLElement>;
    onMouseLeave: React.MouseEventHandler<HTMLElement>;
    onTitleMouseEnter: React.MouseEventHandler<HTMLElement>;
    onTitleMouseLeave: React.MouseEventHandler<HTMLElement>;
    onTitleClick: (e: React.KeyboardEvent<HTMLElement> | React.MouseEvent<HTMLElement, MouseEvent>) => void;
    onSubMenuClick: (info: MenuInfo) => void;
    onSelect: SelectEventHandler;
    onDeselect: SelectEventHandler;
    getPrefixCls: () => string;
    getActiveClassName: () => string;
    getDisabledClassName: () => string;
    getSelectedClassName: () => string;
    getOpenClassName: () => string;
    saveMenuInstance: (c: MenuItem) => void;
    addKeyPath: (info: MenuInfo) => {
        keyPath: (string | number)[];
        key: string | number;
        item: React.ReactInstance;
        domEvent: React.MouseEvent<HTMLElement, MouseEvent>;
    };
    triggerOpenChange: (open: boolean, type?: string) => void;
    isChildrenSelected: () => boolean;
    isOpen: () => boolean;
    adjustWidth: () => void;
    saveSubMenuTitle: (subMenuTitle: HTMLElement) => void;
    renderChildren(children: React.ReactNode): JSX.Element;
    render(): JSX.Element;
}
declare const connected: any;
export default connected;
