import * as React from 'react';
import { CheckboxChangeEvent } from '../checkbox';
import { SelectionCheckboxAllProps, SelectionCheckboxAllState, SelectionItem } from './interface';
declare class SelectionCheckboxAll<T> extends React.Component<SelectionCheckboxAllProps<T>, SelectionCheckboxAllState> {
    state: {
        checked: boolean;
        indeterminate: boolean;
    };
    unsubscribe: () => void;
    defaultSelections: SelectionItem[];
    constructor(props: SelectionCheckboxAllProps<T>);
    static getDerivedStateFromProps<T>(props: SelectionCheckboxAllProps<T>, state: SelectionCheckboxAllState): SelectionCheckboxAllState;
    componentDidMount(): void;
    componentWillUnmount(): void;
    setCheckState(props: SelectionCheckboxAllProps<T>): void;
    handleSelectAllChange: (e: CheckboxChangeEvent) => void;
    subscribe(): void;
    renderMenus(selections: SelectionItem[]): JSX.Element[];
    render(): JSX.Element;
}
export default SelectionCheckboxAll;
