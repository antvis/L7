import * as React from 'react';
import { Breakpoint, BreakpointMap } from '../_util/responsiveObserve';
export interface DescriptionsItemProps {
    prefixCls?: string;
    className?: string;
    label?: React.ReactNode;
    children: React.ReactNode;
    span?: number;
}
declare const DescriptionsItem: React.SFC<DescriptionsItemProps>;
export interface DescriptionsProps {
    prefixCls?: string;
    className?: string;
    style?: React.CSSProperties;
    bordered?: boolean;
    size?: 'middle' | 'small' | 'default';
    children?: React.ReactNode;
    title?: React.ReactNode;
    column?: number | Partial<Record<Breakpoint, number>>;
    layout?: 'horizontal' | 'vertical';
    colon?: boolean;
}
declare class Descriptions extends React.Component<DescriptionsProps, {
    screens: BreakpointMap;
}> {
    static defaultProps: DescriptionsProps;
    static Item: typeof DescriptionsItem;
    state: {
        screens: BreakpointMap;
    };
    token: string;
    componentDidMount(): void;
    componentWillUnmount(): void;
    getColumn(): number;
    render(): JSX.Element;
}
export default Descriptions;
