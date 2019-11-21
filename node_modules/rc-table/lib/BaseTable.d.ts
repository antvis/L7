import { ColumnType, TableStore, Expander, GetRowKey, FixedType } from './interface';
export interface BaseTableProps<ValueType> {
    fixed?: FixedType;
    columns: ColumnType[];
    tableClassName: string;
    hasHead: boolean;
    hasBody: boolean;
    store: TableStore;
    expander: Expander<ValueType>;
    getRowKey?: GetRowKey<ValueType>;
    isAnyColumnsFixed?: boolean;
}
declare const _default: any;
export default _default;
