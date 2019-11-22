import * as React from 'react';
import { Key, FixedType, ExpandedRowRender, RenderExpandIcon, LegacyFunction } from './interface';
export interface ExpandableRowProps<ValueType> {
    prefixCls: string;
    rowKey: Key;
    fixed?: FixedType;
    record: ValueType;
    indentSize?: number;
    needIndentSpaced: boolean;
    expandRowByClick?: boolean;
    expanded: boolean;
    expandIconAsCell?: boolean;
    expandIconColumnIndex?: number;
    childrenColumnName?: string;
    expandedRowRender?: ExpandedRowRender<ValueType>;
    expandIcon?: RenderExpandIcon<ValueType>;
    onExpandedChange: (expanded: boolean, record: ValueType, event: React.MouseEvent<HTMLElement>, rowKey: Key, destroy?: boolean) => void;
    onRowClick?: LegacyFunction<ValueType>;
    children: (info: {
        indentSize: number;
        expanded: boolean;
        onRowClick: LegacyFunction<ValueType>;
        hasExpandIcon: (index: number) => boolean;
        renderExpandIcon: () => React.ReactNode;
        renderExpandIconCell: (cells: React.ReactElement[]) => void;
    }) => React.ReactNode;
}
declare const _default: any;
export default _default;
