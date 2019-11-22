import React from 'react';
interface IFrameProps {
    id: string;
    key?: string;
    title: string;
    src: string;
    allowFullScreen: boolean;
    scale: number;
    style?: any;
}
interface BodyStyle {
    width: string;
    height: string;
    transform: string;
    transformOrigin: string;
}
export declare class IFrame extends React.Component<IFrameProps> {
    iframe: any;
    componentDidMount(): void;
    shouldComponentUpdate(nextProps: IFrameProps): boolean;
    setIframeBodyStyle(style: BodyStyle): any;
    render(): JSX.Element;
}
export {};
