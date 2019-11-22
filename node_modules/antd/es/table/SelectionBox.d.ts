import * as React from 'react';
import { SelectionBoxProps, SelectionBoxState } from './interface';
export default class SelectionBox extends React.Component<SelectionBoxProps, SelectionBoxState> {
    unsubscribe: () => void;
    constructor(props: SelectionBoxProps);
    componentDidMount(): void;
    componentWillUnmount(): void;
    getCheckState(props: SelectionBoxProps): boolean;
    subscribe(): void;
    render(): JSX.Element;
}
