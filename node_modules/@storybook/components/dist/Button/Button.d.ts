import React from 'react';
export interface ButtonProps {
    isLink?: boolean;
    primary?: boolean;
    secondary?: boolean;
    tertiary?: boolean;
    inForm?: boolean;
    disabled?: boolean;
    small?: boolean;
    outline?: boolean;
    containsIcon?: boolean;
}
export declare const Button: React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<any>> & {
    defaultProps: {
        isLink: boolean;
    };
};
