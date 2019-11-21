import * as React from 'react';
import { MenuClickEventHandler } from './interface';
export interface MenuItemGroupProps {
    disabled?: boolean;
    renderMenuItem?: (item: React.ReactElement, index: number, key: string) => React.ReactElement;
    index?: number;
    className?: string;
    subMenuKey?: string;
    rootPrefixCls?: string;
    title?: string;
    onClick?: MenuClickEventHandler;
}
declare class MenuItemGroup extends React.Component<MenuItemGroupProps> {
    static isMenuItemGroup: boolean;
    static defaultProps: {
        disabled: boolean;
    };
    renderInnerMenuItem: (item: React.ReactElement<any, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)>) | (new (props: any) => React.Component<any, any, any>)>) => React.ReactElement<any, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)>) | (new (props: any) => React.Component<any, any, any>)>;
    render(): JSX.Element;
}
export default MenuItemGroup;
