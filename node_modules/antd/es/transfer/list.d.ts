import * as React from 'react';
import { TransferItem, TransferDirection, RenderResult } from './index';
import { TransferListBodyProps } from './renderListBody';
export interface RenderedItem {
    renderedText: string;
    renderedEl: React.ReactNode;
    item: TransferItem;
}
declare type RenderListFunction = (props: TransferListBodyProps) => React.ReactNode;
export interface TransferListProps {
    prefixCls: string;
    titleText: string;
    dataSource: TransferItem[];
    filterOption?: (filterText: string, item: TransferItem) => boolean;
    style?: React.CSSProperties;
    checkedKeys: string[];
    handleFilter: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSelect: (selectedItem: TransferItem, checked: boolean) => void;
    /** [Legacy] Only used when `body` prop used. */
    handleSelectAll: (dataSource: TransferItem[], checkAll: boolean) => void;
    onItemSelect: (key: string, check: boolean) => void;
    onItemSelectAll: (dataSource: string[], checkAll: boolean) => void;
    handleClear: () => void;
    render?: (item: TransferItem) => RenderResult;
    showSearch?: boolean;
    searchPlaceholder: string;
    notFoundContent: React.ReactNode;
    itemUnit: string;
    itemsUnit: string;
    body?: (props: TransferListProps) => React.ReactNode;
    renderList?: RenderListFunction;
    footer?: (props: TransferListProps) => React.ReactNode;
    lazy?: boolean | {};
    onScroll: Function;
    disabled?: boolean;
    direction: TransferDirection;
    showSelectAll?: boolean;
}
interface TransferListState {
    /** Filter input value */
    filterValue: string;
}
export default class TransferList extends React.Component<TransferListProps, TransferListState> {
    static defaultProps: {
        dataSource: never[];
        titleText: string;
        showSearch: boolean;
        lazy: {};
    };
    timer: number;
    triggerScrollTimer: number;
    constructor(props: TransferListProps);
    shouldComponentUpdate(...args: any[]): any;
    componentWillUnmount(): void;
    getCheckStatus(filteredItems: TransferItem[]): "none" | "all" | "part";
    getFilteredItems(dataSource: TransferItem[], filterValue: string): {
        filteredItems: TransferItem[];
        filteredRenderItems: RenderedItem[];
    };
    getListBody(prefixCls: string, searchPlaceholder: string, filterValue: string, filteredItems: TransferItem[], notFoundContent: React.ReactNode, bodyDom: React.ReactNode, filteredRenderItems: RenderedItem[], checkedKeys: string[], renderList?: RenderListFunction, showSearch?: boolean, disabled?: boolean): React.ReactNode;
    getCheckBox(filteredItems: TransferItem[], onItemSelectAll: (dataSource: string[], checkAll: boolean) => void, showSelectAll?: boolean, disabled?: boolean): false | JSX.Element;
    handleFilter: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleClear: () => void;
    matchFilter: (text: string, item: TransferItem) => boolean;
    renderItem: (item: TransferItem) => RenderedItem;
    render(): JSX.Element;
}
export {};
