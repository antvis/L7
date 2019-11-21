import * as PropTypes from 'prop-types';
import * as React from 'react';
import { renderSelect, valueType } from './PropTypes';
export interface IMenuEvent {
    key: string;
    item: React.ReactNode;
    domEvent: Event;
    selectedKeys: string[];
}
export interface IDropdownMenuProps {
    ariaId: string;
    defaultActiveFirstOption: boolean;
    value: valueType;
    dropdownMenuStyle: React.CSSProperties;
    multiple: boolean;
    onPopupFocus: React.FocusEventHandler<HTMLDivElement>;
    onPopupScroll: React.UIEventHandler<HTMLDivElement>;
    onMenuDeselect: (e: {
        item: any;
        domEvent: KeyboardEvent;
    }) => void;
    onMenuSelect: (e: {
        item: any;
        domEvent: KeyboardEvent;
    }) => void;
    prefixCls: string;
    menuItems: JSX.Element[];
    inputValue: string | string[];
    visible: boolean;
    firstActiveValue: valueType;
    menuItemSelectedIcon: renderSelect;
    backfillValue: string;
}
export default class DropdownMenu extends React.Component<Partial<IDropdownMenuProps>> {
    static displayName: string;
    static propTypes: {
        ariaId: PropTypes.Requireable<string>;
        defaultActiveFirstOption: PropTypes.Requireable<boolean>;
        value: PropTypes.Requireable<any>;
        dropdownMenuStyle: PropTypes.Requireable<object>;
        multiple: PropTypes.Requireable<boolean>;
        onPopupFocus: PropTypes.Requireable<(...args: any[]) => any>;
        onPopupScroll: PropTypes.Requireable<(...args: any[]) => any>;
        onMenuDeSelect: PropTypes.Requireable<(...args: any[]) => any>;
        onMenuSelect: PropTypes.Requireable<(...args: any[]) => any>;
        prefixCls: PropTypes.Requireable<string>;
        menuItems: PropTypes.Requireable<any>;
        inputValue: PropTypes.Requireable<string>;
        visible: PropTypes.Requireable<boolean>;
        firstActiveValue: PropTypes.Requireable<string>;
        menuItemSelectedIcon: PropTypes.Requireable<string | number | boolean | {} | PropTypes.ReactElementLike | PropTypes.ReactNodeArray>;
    };
    rafInstance: number | null;
    lastInputValue: string | string[] | undefined;
    saveMenuRef: any;
    menuRef: any;
    lastVisible: boolean;
    firstActiveItem: any;
    constructor(props: Partial<IDropdownMenuProps>);
    componentDidMount(): void;
    shouldComponentUpdate(nextProps: Partial<IDropdownMenuProps>): boolean;
    componentDidUpdate(prevProps: Partial<IDropdownMenuProps>): void;
    componentWillUnmount(): void;
    scrollActiveItemToView: () => void;
    renderMenu: () => JSX.Element | null;
    render(): JSX.Element | null;
}
