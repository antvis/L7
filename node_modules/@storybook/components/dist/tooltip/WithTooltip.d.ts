import { FunctionComponent, ReactNode } from 'react';
import { Modifiers, Placement } from 'popper.js';
interface WithHideFn {
    onHide: () => void;
}
export interface WithTooltipPureProps {
    svg?: boolean;
    trigger?: 'none' | 'hover' | 'click' | 'right-click';
    closeOnClick?: boolean;
    placement?: Placement;
    modifiers?: Modifiers;
    hasChrome?: boolean;
    tooltip: ReactNode | ((p: WithHideFn) => ReactNode);
    children: ReactNode;
    tooltipShown?: boolean;
    onVisibilityChange?: (visibility: boolean) => void;
    onDoubleClick?: () => void;
}
declare const WithTooltipPure: FunctionComponent<WithTooltipPureProps>;
declare const WithToolTipState: FunctionComponent<WithTooltipPureProps & {
    startOpen?: boolean;
}>;
export { WithTooltipPure, WithToolTipState, WithToolTipState as WithTooltip };
