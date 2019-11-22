import PopperJS from 'popper.js';
import React from 'react';
import ReactPopper from 'react-popper';
export declare type TriggerTypes = 'none' | 'click' | 'right-click' | 'hover' | 'focus';
export declare type Trigger = TriggerTypes | TriggerTypes[];
export interface GetTriggerPropsArg {
    onTouchEnd?(event: React.SyntheticEvent): void;
    onClick?(event: React.SyntheticEvent): void;
    onContextMenu?(event: React.SyntheticEvent): void;
    onMouseEnter?(event: React.SyntheticEvent): void;
    onMouseLeave?(event: React.SyntheticEvent): void;
    onMouseMove?(event: React.SyntheticEvent): void;
    onFocus?(event: React.SyntheticEvent): void;
    onBlur?(event: React.SyntheticEvent): void;
    [key: string]: any;
}
export interface GetTooltipPropsArg {
    style?: React.CSSProperties;
    onMouseEnter?: (event: React.SyntheticEvent) => void;
    onMouseLeave?: (event: React.SyntheticEvent) => void;
    [key: string]: any;
}
export interface GetArrowPropsArg {
    style?: React.CSSProperties;
    [key: string]: any;
}
export interface ChildrenArg {
    triggerRef: ReactPopper.RefHandler;
    getTriggerProps(arg?: GetTriggerPropsArg): GetTriggerPropsArg;
}
export interface TooltipArg {
    arrowRef: ReactPopper.RefHandler;
    tooltipRef: ReactPopper.RefHandler;
    placement: PopperJS.Placement;
    getArrowProps(arg?: GetArrowPropsArg): GetArrowPropsArg;
    getTooltipProps(arg?: GetTooltipPropsArg): GetTooltipPropsArg;
}
export interface TooltipTriggerProps {
    /**
     * Whether to close the tooltip when it's trigger is out of the boundary
     * @default true
     */
    closeOnOutOfBoundaries: boolean;
    /**
     * Whether tooltip is shown by default
     * @default false
     */
    defaultTooltipShown: boolean;
    /**
     * Delay in hiding the tooltip
     * @default 0
     */
    delayHide: number;
    /**
     * Delay in showing the tooltip
     * @default 0
     */
    delayShow: number;
    /**
     * Whether to make the tooltip spawn at cursor position
     * @default false
     */
    followCursor: boolean;
    /**
     * Function that can be used to obtain a tooltip element reference
     */
    getTooltipRef?: ReactPopper.RefHandler;
    /**
     * Function that can be used to obtain a trigger element reference
     */
    getTriggerRef?: ReactPopper.RefHandler;
    /**
     * Modifiers passed directly to the underlying popper.js instance
     * For more information, refer to Popper.js’ modifier docs:
     * @link https://popper.js.org/popper-documentation.html#modifiers
     */
    modifiers?: PopperJS.Modifiers;
    /**
     * Tooltip placement w.r.t. trigger
     *  @default right
     */
    placement: PopperJS.Placement;
    /**
     * Element to be used as portal container
     * @default document.body
     */
    portalContainer: HTMLElement;
    /**
     * Used to create controlled tooltip
     */
    tooltipShown?: boolean;
    /**
     * Event that triggers the tooltip
     * @default hover
     */
    trigger: Trigger;
    /**
     * Whether to use React.createPortal for creating tooltip
     * @default true // for browser environments
     */
    usePortal: boolean;
    /**
     * Trigger
     */
    children(arg: ChildrenArg): React.ReactNode;
    /**
     * Called when the visibility of the tooltip changes
     * @default no-op
     */
    onVisibilityChange(tooltipShown: boolean): void;
    /**
     * Tooltip
     */
    tooltip(arg: TooltipArg): React.ReactNode;
}
export interface TooltipTriggerState {
    pageX?: number;
    pageY?: number;
    tooltipShown: boolean;
}
export interface TooltipProps {
    arrowProps: ReactPopper.PopperArrowProps;
    closeOnOutOfBoundaries: boolean;
    innerRef: ReactPopper.RefHandler;
    outOfBoundaries: boolean | null;
    placement: PopperJS.Placement;
    style: React.CSSProperties;
    trigger: Trigger;
    clearScheduled(): void;
    hideTooltip(): void;
    tooltip(arg: TooltipArg): React.ReactNode;
    scheduleUpdate(): void;
}
