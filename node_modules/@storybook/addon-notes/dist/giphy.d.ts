import { Component } from 'react';
interface Props {
    query: string;
}
interface State {
    src: string | null;
}
export default class Giphy extends Component<Props, State> {
    state: State;
    componentDidMount(): void;
    render(): JSX.Element;
}
export {};
