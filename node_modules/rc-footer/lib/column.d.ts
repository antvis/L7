import React from 'react';
export interface FooterColumnItem {
    title: React.ReactNode;
    url?: string;
    openExternal?: boolean;
    icon?: React.ReactNode;
    description?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    LinkComponent?: React.ReactType;
}
export interface FooterColumn {
    prefixCls?: string;
    title?: React.ReactNode;
    icon?: React.ReactNode;
    items?: FooterColumnItem[];
    className?: string;
    style?: React.CSSProperties;
}
declare const Column: React.FC<FooterColumn>;
export default Column;
