import * as React from 'react';
import * as PropTypes from 'prop-types';
import { SpinProps } from '../spin';
import { ConfigConsumerProps } from '../config-provider';
import { PaginationConfig } from '../pagination';
import Item from './Item';
export { ListItemProps, ListItemMetaProps } from './Item';
export declare type ColumnCount = 1 | 2 | 3 | 4 | 6 | 8 | 12 | 24;
export declare type ColumnType = 'gutter' | 'column' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
export interface ListGridType {
    gutter?: number;
    column?: ColumnCount;
    xs?: ColumnCount;
    sm?: ColumnCount;
    md?: ColumnCount;
    lg?: ColumnCount;
    xl?: ColumnCount;
    xxl?: ColumnCount;
}
export declare type ListSize = 'small' | 'default' | 'large';
export declare type ListItemLayout = 'horizontal' | 'vertical';
export interface ListProps<T> {
    bordered?: boolean;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    dataSource?: T[];
    extra?: React.ReactNode;
    grid?: ListGridType;
    id?: string;
    itemLayout?: ListItemLayout;
    loading?: boolean | SpinProps;
    loadMore?: React.ReactNode;
    pagination?: PaginationConfig | false;
    prefixCls?: string;
    rowKey?: ((item: T) => string) | string;
    renderItem?: (item: T, index: number) => React.ReactNode;
    size?: ListSize;
    split?: boolean;
    header?: React.ReactNode;
    footer?: React.ReactNode;
    locale?: ListLocale;
}
export interface ListLocale {
    emptyText: React.ReactNode | (() => React.ReactNode);
}
interface ListState {
    paginationCurrent: number;
    paginationSize: number;
}
export default class List<T> extends React.Component<ListProps<T>, ListState> {
    static Item: typeof Item;
    static childContextTypes: {
        grid: PropTypes.Requireable<any>;
        itemLayout: PropTypes.Requireable<string>;
    };
    static defaultProps: {
        dataSource: never[];
        bordered: boolean;
        split: boolean;
        loading: boolean;
        pagination: false | PaginationConfig | undefined;
    };
    defaultPaginationProps: {
        current: number;
        total: number;
    };
    private keys;
    private onPaginationChange;
    private onPaginationShowSizeChange;
    constructor(props: ListProps<T>);
    getChildContext(): {
        grid: ListGridType | undefined;
        itemLayout: "horizontal" | "vertical" | undefined;
    };
    triggerPaginationEvent(eventName: string): (page: number, pageSize: number) => void;
    renderItem: (item: any, index: number) => {} | null | undefined;
    isSomethingAfterLastItem(): boolean;
    renderEmpty: (prefixCls: string, renderEmpty: (componentName?: string | undefined) => React.ReactNode) => JSX.Element;
    renderList: ({ getPrefixCls, renderEmpty }: ConfigConsumerProps) => JSX.Element;
    render(): JSX.Element;
}
