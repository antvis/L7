import * as React from 'react';
export interface DividerProps {
    className?: string;
    rootPrefixCls?: string;
    style?: React.CSSProperties;
    disabled?: boolean;
}
declare const Divider: React.FC<DividerProps>;
export default Divider;
