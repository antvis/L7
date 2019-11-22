import * as React from 'react';
import * as PropTypes from 'prop-types';
import { ConfigConsumerProps } from '../config-provider';
export { ScrollNumberProps } from './ScrollNumber';
export interface BadgeProps {
    /** Number to show in badge */
    count?: React.ReactNode;
    showZero?: boolean;
    /** Max count to show */
    overflowCount?: number;
    /** whether to show red dot without number */
    dot?: boolean;
    style?: React.CSSProperties;
    prefixCls?: string;
    scrollNumberPrefixCls?: string;
    className?: string;
    status?: 'success' | 'processing' | 'default' | 'error' | 'warning';
    color?: string;
    text?: React.ReactNode;
    offset?: [number | string, number | string];
    title?: string;
}
export default class Badge extends React.Component<BadgeProps, any> {
    static defaultProps: {
        count: null;
        showZero: boolean;
        dot: boolean;
        overflowCount: number;
    };
    static propTypes: {
        count: PropTypes.Requireable<PropTypes.ReactNodeLike>;
        showZero: PropTypes.Requireable<boolean>;
        dot: PropTypes.Requireable<boolean>;
        overflowCount: PropTypes.Requireable<number>;
    };
    getNumberedDispayCount(): string | number | null;
    getDispayCount(): string | number | null;
    getScrollNumberTitle(): string | number | undefined;
    getStyleWithOffset(): React.CSSProperties | undefined;
    getBadgeClassName(prefixCls: string): string;
    hasStatus(): boolean;
    isZero(): boolean;
    isDot(): boolean;
    isHidden(): boolean;
    renderStatusText(prefixCls: string): JSX.Element | null;
    renderDispayComponent(): React.ReactElement<any, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)> | null) | (new (props: any) => React.Component<any, any, any>)> | undefined;
    renderBadgeNumber(prefixCls: string, scrollNumberPrefixCls: string): JSX.Element | null;
    renderBadge: ({ getPrefixCls }: ConfigConsumerProps) => JSX.Element;
    render(): JSX.Element;
}
