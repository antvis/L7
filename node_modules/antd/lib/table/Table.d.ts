import * as React from 'react';
import { Store } from './createStore';
import Column from './Column';
import ColumnGroup from './ColumnGroup';
import { TableProps, CheckboxPropsCache } from './interface';
declare class StoreTable<T> extends React.Component<TableProps<T>> {
    static displayName: string;
    static Column: typeof Column;
    static ColumnGroup: typeof ColumnGroup;
    store: Store;
    CheckboxPropsCache: CheckboxPropsCache;
    constructor(props: TableProps<T>);
    setCheckboxPropsCache: (cache: CheckboxPropsCache) => CheckboxPropsCache;
    render(): JSX.Element;
}
export default StoreTable;
