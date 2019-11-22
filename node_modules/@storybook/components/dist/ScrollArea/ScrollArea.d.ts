import { FunctionComponent } from 'react';
export interface ScrollProps {
    horizontal?: boolean;
    vertical?: boolean;
    [key: string]: any;
}
export interface ScrollAreaProps {
    horizontal?: boolean;
    vertical?: boolean;
    className?: string;
}
export declare const ScrollArea: FunctionComponent<ScrollAreaProps>;
