import * as React from 'react';
import { FixedType, ColumnType } from './interface';
export interface ColGroupProps {
    fixed: FixedType;
    /** FIXME: Not used. Should confirm why this prop here */
    columns?: ColumnType[];
}
declare const ColGroup: React.FC<ColGroupProps>;
export default ColGroup;
