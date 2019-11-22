import * as React from 'react';
import { ColumnType, CustomizeComponent } from './interface';
export interface TableCellProps<ValueType> {
    record?: ValueType;
    prefixCls?: string;
    index?: number;
    indent?: number;
    indentSize?: number;
    column?: ColumnType;
    title?: string;
    expandIcon?: React.ReactNode;
    component?: CustomizeComponent;
}
export default class TableCell<ValueType> extends React.Component<TableCellProps<ValueType>> {
    handleClick: React.MouseEventHandler<HTMLElement>;
    render(): JSX.Element;
}
