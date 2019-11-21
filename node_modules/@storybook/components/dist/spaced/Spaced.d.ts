import { FunctionComponent } from 'react';
export interface ContainerProps {
    col?: number;
    row?: number;
    outer?: number;
}
export interface SpacedProps {
    col?: number;
    row?: number;
    outer?: number | boolean;
}
export declare const Spaced: FunctionComponent<SpacedProps>;
