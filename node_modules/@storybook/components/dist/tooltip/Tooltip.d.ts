import { FunctionComponent } from 'react';
import { Color } from '@storybook/theming';
export interface ArrowProps {
    color: keyof Color;
    placement: string;
}
export interface WrapperProps {
    color: keyof Color;
    placement: string;
    hidden?: boolean;
    hasChrome: boolean;
}
export interface TooltipProps {
    arrowRef?: any;
    tooltipRef?: any;
    hasChrome?: boolean;
    arrowProps?: any;
    placement?: string;
    color?: keyof Color;
}
export declare const Tooltip: FunctionComponent<TooltipProps>;
