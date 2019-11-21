import * as React from 'react';
import { Settings } from 'react-slick';
import { ConfigConsumerProps } from '../config-provider';
export declare type CarouselEffect = 'scrollx' | 'fade';
export declare type DotPosition = 'top' | 'bottom' | 'left' | 'right';
export interface CarouselProps extends Settings {
    effect?: CarouselEffect;
    style?: React.CSSProperties;
    prefixCls?: string;
    slickGoTo?: number;
    dotPosition?: DotPosition;
    children?: React.ReactNode;
}
export default class Carousel extends React.Component<CarouselProps, {}> {
    static defaultProps: {
        dots: boolean;
        arrows: boolean;
        draggable: boolean;
    };
    innerSlider: any;
    private slick;
    constructor(props: CarouselProps);
    componentDidMount(): void;
    componentDidUpdate(prevProps: CarouselProps): void;
    componentWillUnmount(): void;
    getDotPosition(): DotPosition;
    saveSlick: (node: any) => void;
    onWindowResized: () => void;
    next(): void;
    prev(): void;
    goTo(slide: number, dontAnimate?: boolean): void;
    renderCarousel: ({ getPrefixCls }: ConfigConsumerProps) => JSX.Element;
    render(): JSX.Element;
}
