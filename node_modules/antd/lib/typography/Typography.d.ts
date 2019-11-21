import * as React from 'react';
export interface TypographyProps {
    id?: string;
    prefixCls?: string;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    ['aria-label']?: string;
}
declare const ExportTypography: React.FC<TypographyProps>;
export default ExportTypography;
