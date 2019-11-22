import * as React from 'react';
import * as PropTypes from 'prop-types';
import { ColumnType, FixedType, Expander } from './interface';
export interface HeadTableProps {
    columns: ColumnType[];
    fixed?: FixedType;
    tableClassName: string;
    handleBodyScrollLeft: React.UIEventHandler<HTMLDivElement>;
    expander: Expander;
}
declare function HeadTable(props: HeadTableProps, { table }: {
    table: any;
}): JSX.Element;
declare namespace HeadTable {
    var contextTypes: {
        table: PropTypes.Requireable<any>;
    };
}
export default HeadTable;
