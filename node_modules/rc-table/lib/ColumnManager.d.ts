import * as React from 'react';
import { ColumnType } from './interface';
export default class ColumnManager {
    _cached: {};
    columns: ColumnType[];
    constructor(columns: ColumnType[], elements: React.ReactNode);
    isAnyColumnsFixed(): any;
    isAnyColumnsLeftFixed(): any;
    isAnyColumnsRightFixed(): any;
    leftColumns(): any;
    rightColumns(): any;
    leafColumns(): any;
    leftLeafColumns(): any;
    rightLeafColumns(): any;
    groupedColumns(): ColumnType[];
    normalize(elements: React.ReactNode): any[];
    reset(columns: ColumnType[], elements?: React.ReactNode): void;
    _cache(name: string, fn: Function): any;
    _leafColumns(columns: ColumnType[]): any[];
}
