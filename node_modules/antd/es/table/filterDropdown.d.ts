import * as React from 'react';
import { FilterMenuProps, FilterMenuState, ColumnProps, ColumnFilterItem } from './interface';
declare class FilterMenu<T> extends React.Component<FilterMenuProps<T>, FilterMenuState<T>> {
    static defaultProps: {
        column: {};
    };
    static getDerivedStateFromProps<T>(nextProps: FilterMenuProps<T>, prevState: FilterMenuState<T>): Partial<FilterMenuState<T>>;
    neverShown: boolean;
    constructor(props: FilterMenuProps<T>);
    componentDidMount(): void;
    componentDidUpdate(): void;
    getDropdownVisible(): boolean | undefined;
    setNeverShown: (column: ColumnProps<T>) => void;
    setSelectedKeys: ({ selectedKeys }: {
        selectedKeys?: React.ReactText[] | undefined;
    }) => void;
    setVisible(visible: boolean): void;
    handleClearFilters: () => void;
    handleConfirm: () => void;
    onVisibleChange: (visible: boolean) => void;
    handleMenuItemClick: (info: {
        keyPath: React.ReactText[];
        key: React.ReactText;
    }) => void;
    hasSubMenu(): boolean;
    confirmFilter(): void;
    renderMenus(items: ColumnFilterItem[]): React.ReactElement<any>[];
    renderFilterIcon: () => JSX.Element;
    renderMenuItem(item: ColumnFilterItem): JSX.Element;
    render(): JSX.Element;
}
export default FilterMenu;
