import { FunctionComponent, ReactNode } from 'react';
export interface TooltipMessageProps {
    title?: ReactNode;
    desc?: ReactNode;
    links?: {
        title: string;
        href?: string;
        onClick?: () => void;
    }[];
}
export declare const TooltipMessage: FunctionComponent<TooltipMessageProps>;
