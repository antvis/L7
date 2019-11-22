import * as React from 'react';
import { ItemGroup } from 'rc-menu';
import SubMenu from './SubMenu';
import Item from './MenuItem';
import { SiderContextProps } from '../layout/Sider';
import { MenuTheme } from './MenuContext';
export interface SelectParam {
    key: string;
    keyPath: Array<string>;
    item: any;
    domEvent: Event;
    selectedKeys: Array<string>;
}
export interface ClickParam {
    key: string;
    keyPath: Array<string>;
    item: any;
    domEvent: Event;
}
export declare type MenuMode = 'vertical' | 'vertical-left' | 'vertical-right' | 'horizontal' | 'inline';
export interface MenuProps {
    id?: string;
    theme?: MenuTheme;
    mode?: MenuMode;
    selectable?: boolean;
    selectedKeys?: Array<string>;
    defaultSelectedKeys?: Array<string>;
    openKeys?: Array<string>;
    defaultOpenKeys?: Array<string>;
    onOpenChange?: (openKeys: string[]) => void;
    onSelect?: (param: SelectParam) => void;
    onDeselect?: (param: SelectParam) => void;
    onClick?: (param: ClickParam) => void;
    style?: React.CSSProperties;
    openAnimation?: string;
    openTransitionName?: string;
    motion?: Object;
    className?: string;
    prefixCls?: string;
    multiple?: boolean;
    inlineIndent?: number;
    inlineCollapsed?: boolean;
    subMenuCloseDelay?: number;
    subMenuOpenDelay?: number;
    focusable?: boolean;
    onMouseEnter?: (e: MouseEvent) => void;
    getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
    overflowedIndicator?: React.ReactNode;
    forceSubMenuRender?: boolean;
}
declare type InternalMenuProps = MenuProps & SiderContextProps;
export interface MenuState {
    openKeys: string[];
    switchingModeFromInline: boolean;
    inlineOpenKeys: string[];
    prevProps: InternalMenuProps;
}
export default class Menu extends React.Component<MenuProps, {}> {
    static Divider: React.FC<import("rc-menu/lib/Divider").DividerProps>;
    static Item: typeof Item;
    static SubMenu: typeof SubMenu;
    static ItemGroup: typeof ItemGroup;
    render(): JSX.Element;
}
export {};
