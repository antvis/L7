import * as React from 'react';
export interface OptionProps {
    value?: string;
    disabled?: boolean;
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}
declare const Option: React.SFC<OptionProps>;
export default Option;
