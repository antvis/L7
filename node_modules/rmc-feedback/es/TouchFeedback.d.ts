/// <reference types="react" />
import React from 'react';
import { ITouchProps, ITouchState } from './PropTypes';
export default class TouchFeedback extends React.Component<ITouchProps, ITouchState> {
    static defaultProps: {
        disabled: boolean;
    };
    state: {
        active: boolean;
    };
    componentDidUpdate(): void;
    triggerEvent(type: any, isActive: any, ev: any): void;
    onTouchStart: (e: any) => void;
    onTouchMove: (e: any) => void;
    onTouchEnd: (e: any) => void;
    onTouchCancel: (e: any) => void;
    onMouseDown: (e: any) => void;
    onMouseUp: (e: any) => void;
    onMouseLeave: (e: any) => void;
    render(): React.ReactElement<any>;
}
