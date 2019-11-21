import React, { AnchorHTMLAttributes, FunctionComponent } from 'react';
export interface LinkStylesProps {
    secondary?: boolean;
    tertiary?: boolean;
    nochrome?: boolean;
    inverse?: boolean;
    isButton?: boolean;
}
export interface LinkInnerProps {
    withArrow?: boolean;
    containsIcon?: boolean;
}
declare type AProps = AnchorHTMLAttributes<HTMLAnchorElement>;
export interface LinkProps extends LinkInnerProps, LinkStylesProps {
    cancel?: boolean;
    className?: string;
    style?: object;
    onClick?: (e: React.MouseEvent) => void;
    href?: string;
}
export declare const Link: FunctionComponent<LinkProps & AProps>;
export {};
