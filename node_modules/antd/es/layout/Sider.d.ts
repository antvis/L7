import { Context } from '@ant-design/create-react-context';
import * as React from 'react';
export interface SiderContextProps {
    siderCollapsed?: boolean;
    collapsedWidth?: string | number;
}
export declare const SiderContext: Context<SiderContextProps>;
export declare type CollapseType = 'clickTrigger' | 'responsive';
export declare type SiderTheme = 'light' | 'dark';
export interface SiderProps extends React.HTMLAttributes<HTMLDivElement> {
    prefixCls?: string;
    collapsible?: boolean;
    collapsed?: boolean;
    defaultCollapsed?: boolean;
    reverseArrow?: boolean;
    onCollapse?: (collapsed: boolean, type: CollapseType) => void;
    zeroWidthTriggerStyle?: React.CSSProperties;
    trigger?: React.ReactNode;
    width?: number | string;
    collapsedWidth?: number | string;
    breakpoint?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
    theme?: SiderTheme;
    onBreakpoint?: (broken: boolean) => void;
}
export interface SiderState {
    collapsed?: boolean;
    below: boolean;
    belowShow?: boolean;
}
export default class Sider extends React.Component {
    render(): JSX.Element;
}
