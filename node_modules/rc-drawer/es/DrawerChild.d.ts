import * as React from 'react';
import { IDrawerChildProps } from './IDrawerPropTypes';
interface IState {
    _self: DrawerChild;
    prevProps?: IDrawerChildProps;
}
declare class DrawerChild extends React.Component<IDrawerChildProps, IState> {
    static getDerivedStateFromProps(props: IDrawerChildProps, { prevProps, _self }: {
        prevProps: IDrawerChildProps;
        _self: DrawerChild;
    }): {
        prevProps: IDrawerChildProps;
    };
    private levelDom;
    private dom;
    private contentWrapper;
    private contentDom;
    private maskDom;
    private handlerDom;
    private drawerId;
    private timeout;
    private passive;
    private startPos;
    constructor(props: IDrawerChildProps);
    componentDidMount(): void;
    componentDidUpdate(prevProps: IDrawerChildProps): void;
    componentWillUnmount(): void;
    private domFocus;
    private removeStartHandler;
    private removeMoveHandler;
    private transitionEnd;
    private onKeyDown;
    private onWrapperTransitionEnd;
    private openLevelTransition;
    private setLevelTransform;
    private setLevelAndScrolling;
    private toggleScrollingToDrawerAndBody;
    private addScrollingEffect;
    private remScrollingEffect;
    private getCurrentDrawerSome;
    private getLevelDom;
    private getHorizontalBoolAndPlacementName;
    render(): JSX.Element;
}
declare const _default: typeof DrawerChild & {
    prototype: DrawerChild;
    getDerivedStateFromProps: typeof DrawerChild.getDerivedStateFromProps;
    contextType?: React.Context<any>;
};
export default _default;
