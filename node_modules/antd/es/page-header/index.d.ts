import * as React from 'react';
import Tag from '../tag';
import { BreadcrumbProps } from '../breadcrumb';
import { AvatarProps } from '../avatar';
export interface PageHeaderProps {
    backIcon?: React.ReactNode;
    prefixCls?: string;
    title: React.ReactNode;
    subTitle?: React.ReactNode;
    style?: React.CSSProperties;
    breadcrumb?: BreadcrumbProps;
    tags?: React.ReactElement<Tag> | React.ReactElement<Tag>[];
    footer?: React.ReactNode;
    extra?: React.ReactNode;
    avatar?: AvatarProps;
    onBack?: (e: React.MouseEvent<HTMLDivElement>) => void;
    className?: string;
    ghost?: boolean;
}
declare const PageHeader: React.SFC<PageHeaderProps>;
export default PageHeader;
