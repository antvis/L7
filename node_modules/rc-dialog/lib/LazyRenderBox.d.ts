import * as React from 'react';
export interface ILazyRenderBoxPropTypes {
    className?: string;
    visible?: boolean;
    hiddenClassName?: string;
    role?: string;
    style?: {};
    forceRender?: boolean;
    onMouseDown?: React.MouseEventHandler<HTMLDivElement>;
}
export default class LazyRenderBox extends React.Component<ILazyRenderBoxPropTypes, any> {
    shouldComponentUpdate(nextProps: ILazyRenderBoxPropTypes): boolean;
    render(): JSX.Element;
}
