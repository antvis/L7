import * as React from 'react';
import * as PropTypes from 'prop-types';
import AnchorLink from './AnchorLink';
import { ConfigConsumerProps } from '../config-provider';
declare function getDefaultContainer(): Window & typeof globalThis;
export declare type AnchorContainer = HTMLElement | Window;
export interface AnchorProps {
    prefixCls?: string;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    offsetTop?: number;
    bounds?: number;
    affix?: boolean;
    showInkInFixed?: boolean;
    getContainer?: () => AnchorContainer;
    /** Return customize highlight anchor */
    getCurrentAnchor?: () => string;
    onClick?: (e: React.MouseEvent<HTMLElement>, link: {
        title: React.ReactNode;
        href: string;
    }) => void;
    /** Scroll to target offset value, if none, it's offsetTop prop value or 0. */
    targetOffset?: number;
    /** Listening event when scrolling change active link */
    onChange?: (currentActiveLink: string) => void;
}
export interface AnchorState {
    activeLink: null | string;
}
export interface AnchorDefaultProps extends AnchorProps {
    prefixCls: string;
    affix: boolean;
    showInkInFixed: boolean;
    getContainer: () => AnchorContainer;
}
export interface AntAnchor {
    registerLink: (link: string) => void;
    unregisterLink: (link: string) => void;
    activeLink: string | null;
    scrollTo: (link: string) => void;
    onClick?: (e: React.MouseEvent<HTMLElement>, link: {
        title: React.ReactNode;
        href: string;
    }) => void;
}
export default class Anchor extends React.Component<AnchorProps, AnchorState> {
    static Link: typeof AnchorLink;
    static defaultProps: {
        affix: boolean;
        showInkInFixed: boolean;
        getContainer: typeof getDefaultContainer;
    };
    static childContextTypes: {
        antAnchor: PropTypes.Requireable<object>;
    };
    state: {
        activeLink: null;
    };
    private inkNode;
    private scrollContainer;
    private links;
    private scrollEvent;
    private animating;
    private prefixCls?;
    getChildContext(): {
        antAnchor: AntAnchor;
    };
    componentDidMount(): void;
    componentDidUpdate(): void;
    componentWillUnmount(): void;
    getCurrentAnchor(offsetTop?: number, bounds?: number): string;
    handleScrollTo: (link: string) => void;
    saveInkNode: (node: HTMLSpanElement) => void;
    setCurrentActiveLink: (link: string) => void;
    handleScroll: () => void;
    updateInk: () => void;
    renderAnchor: ({ getPrefixCls }: ConfigConsumerProps) => JSX.Element;
    render(): JSX.Element;
}
export {};
