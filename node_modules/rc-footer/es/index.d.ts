import React from 'react';
import { FooterColumn } from './column';
export interface FooterProps {
    prefixCls?: string;
    bottom?: React.ReactNode;
    maxColumnsPerRow?: number;
    columns?: FooterColumn[];
    theme?: 'dark' | 'light';
    className?: string;
    style?: React.CSSProperties;
    backgroundColor?: string;
    columnLayout?: 'space-around' | 'space-between';
}
declare const Footer: React.FC<FooterProps>;
export default Footer;
