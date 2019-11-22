import * as React from 'react';
import { ColumnType, Expander, FixedType, GetComponentProps } from './interface';
export interface TableHeaderProps {
    fixed?: FixedType;
    columns: ColumnType[];
    expander: Expander;
    onHeaderRow?: GetComponentProps<ColumnType[]>;
}
declare const TableHeader: React.FC<TableHeaderProps>;
export default TableHeader;
