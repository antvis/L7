import { TableComponents, GetComponentProps, ColumnType, Cell, FixedType } from './interface';
export interface TableHeaderRowProps {
    row: Cell[];
    index: number;
    height: string | number;
    components: TableComponents;
    onHeaderRow: GetComponentProps<ColumnType[]>;
    prefixCls: string;
    columns: ColumnType[];
    rows: Cell[];
    fixed: FixedType;
}
declare const _default: any;
export default _default;
