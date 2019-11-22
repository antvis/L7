import * as React from 'react';
import * as PropTypes from 'prop-types';
import { AntAnchor } from './Anchor';
import { ConfigConsumerProps } from '../config-provider';
export interface AnchorLinkProps {
    prefixCls?: string;
    href: string;
    target?: string;
    title: React.ReactNode;
    children?: React.ReactNode;
    className?: string;
}
declare class AnchorLink extends React.Component<AnchorLinkProps, any> {
    static defaultProps: {
        href: string;
    };
    static contextTypes: {
        antAnchor: PropTypes.Requireable<object>;
    };
    context: {
        antAnchor: AntAnchor;
    };
    componentDidMount(): void;
    componentDidUpdate({ href: prevHref }: AnchorLinkProps): void;
    componentWillUnmount(): void;
    handleClick: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
    renderAnchorLink: ({ getPrefixCls }: ConfigConsumerProps) => JSX.Element;
    render(): JSX.Element;
}
export default AnchorLink;
