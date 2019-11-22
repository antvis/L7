import * as React from 'react';
import { noop } from './util';
import { SelectEventHandler, OpenEventHandler, DestroyEventHandler, MiniStore, MenuMode, LegacyFunctionRef, RenderIconType, HoverEventHandler, BuiltinPlacements, MenuClickEventHandler, TriggerSubMenuAction, MotionType } from './interface';
import { MenuItem, MenuItemProps } from './MenuItem';
export declare function getActiveKey(props: {
    children?: React.ReactNode;
    eventKey?: React.Key;
    defaultActiveFirst?: boolean;
}, originalActiveKey: string): string | number;
export declare function saveRef(c: React.ReactInstance): void;
export interface SubPopupMenuProps {
    onSelect?: SelectEventHandler;
    onClick?: MenuClickEventHandler;
    onDeselect?: SelectEventHandler;
    onOpenChange?: OpenEventHandler;
    onDestroy?: DestroyEventHandler;
    openKeys?: string[];
    visible?: boolean;
    children?: React.ReactNode;
    parentMenu?: React.ReactInstance;
    eventKey?: React.Key;
    store?: MiniStore;
    prefixCls?: string;
    focusable?: boolean;
    multiple?: boolean;
    style?: React.CSSProperties;
    className?: string;
    defaultActiveFirst?: boolean;
    activeKey?: string;
    selectedKeys?: string[];
    defaultSelectedKeys?: string[];
    defaultOpenKeys?: string[];
    level?: number;
    mode?: MenuMode;
    triggerSubMenuAction?: TriggerSubMenuAction;
    inlineIndent?: number;
    manualRef?: LegacyFunctionRef;
    itemIcon?: RenderIconType;
    expandIcon?: RenderIconType;
    subMenuOpenDelay?: number;
    subMenuCloseDelay?: number;
    forceSubMenuRender?: boolean;
    builtinPlacements?: BuiltinPlacements;
    role?: string;
    id?: string;
    overflowedIndicator?: React.ReactNode;
    theme?: string;
    motion?: MotionType;
}
export declare class SubPopupMenu extends React.Component<SubPopupMenuProps> {
    static defaultProps: {
        prefixCls: string;
        className: string;
        mode: string;
        level: number;
        inlineIndent: number;
        visible: boolean;
        focusable: boolean;
        style: {};
        manualRef: typeof noop;
    };
    constructor(props: SubPopupMenuProps);
    instanceArray: MenuItem[];
    componentDidMount(): void;
    shouldComponentUpdate(nextProps: SubPopupMenuProps): boolean;
    componentDidUpdate(prevProps: SubPopupMenuProps): void;
    /**
     * all keyboard events callbacks run from here at first
     *
     * note:
     *  This legacy code that `onKeyDown` is called by parent instead of dom self.
     *  which need return code to check if this event is handled
     */
    onKeyDown: (e: React.KeyboardEvent<HTMLElement>, callback: (item: MenuItem) => void) => number;
    onItemHover: HoverEventHandler;
    onDeselect: SelectEventHandler;
    onSelect: SelectEventHandler;
    onClick: MenuClickEventHandler;
    onOpenChange: OpenEventHandler;
    onDestroy: DestroyEventHandler;
    getFlatInstanceArray: () => MenuItem[];
    step: (direction: number) => MenuItem;
    renderCommonMenuItem: (child: React.ReactElement<any, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)>) | (new (props: any) => React.Component<any, any, any>)>, i: number, extraProps: MenuItemProps) => React.ReactElement<any, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)>) | (new (props: any) => React.Component<any, any, any>)>;
    renderMenuItem: (c: React.ReactElement<any, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)>) | (new (props: any) => React.Component<any, any, any>)>, i: number, subMenuKey: string | number) => React.ReactElement<any, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)>) | (new (props: any) => React.Component<any, any, any>)>;
    render(): JSX.Element;
}
declare const connected: React.ComponentClass<SubPopupMenuProps, any> & {
    getWrappedInstance: () => SubPopupMenu;
};
export default connected;
