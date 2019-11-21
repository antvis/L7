import * as PropTypes from 'prop-types';
import * as React from 'react';
import DropdownMenu, { IDropdownMenuProps } from './DropdownMenu';
import { renderSelect, valueType } from './PropTypes';
export interface ISelectTriggerProps extends IDropdownMenuProps {
    onPopupFocus: () => void;
    onPopupScroll: React.UIEventHandler<HTMLDivElement>;
    onMouseEnter: React.MouseEventHandler<HTMLDivElement>;
    onMouseLeave: React.MouseEventHandler<HTMLDivElement>;
    dropdownMatchSelectWidth: boolean;
    dropdownStyle: React.CSSProperties;
    dropdownAlign: object;
    visible: boolean;
    combobox: boolean;
    disabled: boolean;
    showSearch: boolean;
    dropdownClassName: string;
    multiple: boolean;
    inputValue: string | string[];
    filterOption: any;
    empty: boolean;
    options: any;
    prefixCls: string;
    popupClassName: string;
    children: any;
    showAction: string[];
    menuItemSelectedIcon: renderSelect;
    dropdownRender: (menu: React.ReactNode, props: Partial<ISelectTriggerProps>) => React.ReactNode;
    onDropdownVisibleChange: (value: boolean) => void;
    getPopupContainer: renderSelect;
    ariaId: string;
    value: valueType;
    transitionName: string;
    animation: string;
}
export interface ISelectTriggerState {
    dropdownWidth: number;
}
export default class SelectTrigger extends React.Component<Partial<ISelectTriggerProps>, ISelectTriggerState> {
    static displayName: string;
    static defaultProps: {
        dropdownRender: (menu: any) => any;
    };
    static propTypes: {
        onPopupFocus: PropTypes.Requireable<(...args: any[]) => any>;
        onPopupScroll: PropTypes.Requireable<(...args: any[]) => any>;
        dropdownMatchSelectWidth: PropTypes.Requireable<boolean>;
        dropdownAlign: PropTypes.Requireable<object>;
        visible: PropTypes.Requireable<boolean>;
        disabled: PropTypes.Requireable<boolean>;
        showSearch: PropTypes.Requireable<boolean>;
        dropdownClassName: PropTypes.Requireable<string>;
        multiple: PropTypes.Requireable<boolean>;
        inputValue: PropTypes.Requireable<string>;
        filterOption: PropTypes.Requireable<any>;
        options: PropTypes.Requireable<any>;
        prefixCls: PropTypes.Requireable<string>;
        popupClassName: PropTypes.Requireable<string>;
        children: PropTypes.Requireable<any>;
        showAction: PropTypes.Requireable<(string | null)[]>;
        menuItemSelectedIcon: PropTypes.Requireable<string | number | boolean | {} | PropTypes.ReactElementLike | PropTypes.ReactNodeArray>;
        dropdownRender: PropTypes.Requireable<(...args: any[]) => any>;
        ariaId: PropTypes.Requireable<string>;
    };
    saveDropdownMenuRef: (ref: any) => void;
    saveTriggerRef: (ref: any) => void;
    dropdownMenuRef: DropdownMenu | null;
    triggerRef: any;
    rafInstance: number | null;
    constructor(props: Partial<ISelectTriggerProps>);
    componentDidMount(): void;
    componentDidUpdate(): void;
    componentWillUnmount(): void;
    setDropdownWidth: () => void;
    cancelRafInstance: () => void;
    getInnerMenu: () => any;
    getPopupDOMNode: () => any;
    getDropdownElement: (newProps: Partial<ISelectTriggerProps>) => {} | null | undefined;
    getDropdownTransitionName: () => string | undefined;
    getDropdownPrefixCls: () => string;
    render(): JSX.Element;
}
