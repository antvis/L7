import * as React from 'react';
import { Key, RenderExpandIcon, TableStore, Cell, FixedType, GetRowKey, RenderRows, ExpandedRowRender } from './interface';
import ColumnManager from './ColumnManager';
export declare type RenderTableRows<ValueType> = (renderRows: RenderRows<ValueType>, rows: React.ReactElement[], record: ValueType, index: number, indent: number, fixed: FixedType, parentKey: Key, ancestorKeys: Key[]) => void;
export declare type ExpandChangeEventHandler<ValueType> = (expanded: boolean, record: ValueType, event: React.MouseEvent<HTMLElement>, rowKey: Key, destroy: boolean) => void;
export declare type RenderExpandIndentCell = (rows: Cell[][], fixed: FixedType) => void;
export declare type ExpandEventHandler<ValueType> = (expanded: boolean, record: ValueType) => void;
export interface ExpandableTableProps<ValueType> {
    expandIconAsCell?: boolean;
    expandedRowKeys?: Key[];
    expandedRowClassName?: (record: ValueType, index: number, indent: number) => string;
    defaultExpandAllRows?: boolean;
    defaultExpandedRowKeys?: Key[];
    expandIconColumnIndex?: number;
    expandedRowRender?: ExpandedRowRender<ValueType>;
    expandIcon?: RenderExpandIcon<ValueType>;
    childrenColumnName?: string;
    indentSize?: number;
    onExpand?: ExpandEventHandler<ValueType>;
    onExpandedRowsChange?: (expandedKeys: Key[]) => void;
    columnManager: ColumnManager;
    store: TableStore;
    prefixCls: string;
    data?: ValueType[];
    children: (info: {
        props: ExpandableTableProps<ValueType>;
        needIndentSpaced: boolean;
        renderRows: RenderTableRows<ValueType>;
        handleExpandChange: ExpandChangeEventHandler<ValueType>;
        renderExpandIndentCell: RenderExpandIndentCell;
    }) => React.ReactNode;
    getRowKey: GetRowKey<ValueType>;
}
declare const _default: any;
export default _default;
