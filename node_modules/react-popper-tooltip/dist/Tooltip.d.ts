import React, { Component } from 'react';
import { TooltipProps } from './types';
declare class Tooltip extends Component<TooltipProps> {
    static contextType: React.Context<{}>;
    private observer?;
    private tooltipRef;
    componentDidMount(): void;
    componentDidUpdate(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
    private handleOutsideClick?;
    private handleOutsideRightClick?;
    private addOutsideClickHandler;
    private removeOutsideClickHandler;
    private addOutsideRightClickHandler;
    private removeOutsideRightClickHandler;
    private getTooltipRef;
    private getArrowProps;
    private getTooltipProps;
    private contextValue;
}
export default Tooltip;
