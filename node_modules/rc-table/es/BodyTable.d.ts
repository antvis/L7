import * as React from 'react';
import * as PropTypes from 'prop-types';
import { FixedType, ColumnType, GetRowKey, Expander } from './interface';
export interface BodyTableProps<ValueType> {
    fixed?: FixedType;
    columns: ColumnType[];
    tableClassName: string;
    handleWheel: React.WheelEventHandler<HTMLDivElement>;
    handleBodyScroll: React.UIEventHandler<HTMLDivElement>;
    getRowKey: GetRowKey<ValueType>;
    expander: Expander;
    isAnyColumnsFixed?: boolean;
}
declare function BodyTable<ValueType>(props: BodyTableProps<ValueType>, { table }: {
    table: any;
}): JSX.Element;
declare namespace BodyTable {
    var contextTypes: {
        table: PropTypes.Requireable<any>;
    };
}
export default BodyTable;
