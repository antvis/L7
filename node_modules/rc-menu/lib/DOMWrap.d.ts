import * as React from 'react';
import { MenuMode } from './interface';
interface DOMWrapProps {
    className?: string;
    children?: React.ReactElement[];
    mode?: MenuMode;
    prefixCls?: string;
    level?: number;
    theme?: string;
    overflowedIndicator?: React.ReactNode;
    visible?: boolean;
    tag?: string;
    style?: React.CSSProperties;
}
interface DOMWrapState {
    lastVisibleIndex: number;
}
declare class DOMWrap extends React.Component<DOMWrapProps, DOMWrapState> {
    static defaultProps: {
        tag: string;
        className: string;
    };
    overflowedIndicatorWidth: number;
    resizeObserver: any;
    mutationObserver: any;
    originalTotalWidth: number;
    overflowedItems: React.ReactElement[];
    menuItemSizes: number[];
    state: DOMWrapState;
    componentDidMount(): void;
    componentWillUnmount(): void;
    getMenuItemNodes: () => HTMLElement[];
    getOverflowedSubMenuItem: (keyPrefix: string, overflowedItems: React.ReactElement<any, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)>) | (new (props: any) => React.Component<any, any, any>)>[], renderPlaceholder?: boolean) => React.ReactElement<any, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)>) | (new (props: any) => React.Component<any, any, any>)>;
    setChildrenWidthAndResize: () => void;
    handleResize: () => void;
    renderChildren(children: React.ReactElement[]): React.ReactElement<any, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)>) | (new (props: any) => React.Component<any, any, any>)>[];
    render(): JSX.Element;
}
export default DOMWrap;
