/// <reference types="react" />
export declare type RenderIconType = React.ReactNode | ((props: any) => React.ReactNode);
export interface MenuInfo {
    key: React.Key;
    keyPath: React.Key[];
    item: React.ReactInstance;
    domEvent: React.MouseEvent<HTMLElement>;
}
export interface SelectInfo extends MenuInfo {
    selectedKeys?: React.Key[];
}
export declare type SelectEventHandler = (info: SelectInfo) => void;
export declare type HoverEventHandler = (info: {
    key: React.Key;
    hover: boolean;
}) => void;
export declare type MenuHoverEventHandler = (info: {
    key: React.Key;
    domEvent: React.MouseEvent<HTMLElement>;
}) => void;
export declare type MenuClickEventHandler = (info: MenuInfo) => void;
export declare type DestroyEventHandler = (key: React.Key) => void;
export declare type OpenEventHandler = (keys: React.Key[] | {
    key: React.Key;
    item: React.ReactInstance;
    trigger: string;
    open: boolean;
}) => void;
export declare type MenuMode = 'horizontal' | 'vertical' | 'vertical-left' | 'vertical-right' | 'inline';
export declare type OpenAnimation = string | Record<string, any>;
export interface MiniStore {
    getState: () => any;
    setState: (state: any) => void;
}
export declare type LegacyFunctionRef = (node: React.ReactInstance) => void;
export declare type BuiltinPlacements = Record<string, any>;
export declare type TriggerSubMenuAction = 'click' | 'hover';
export declare type AnimationType = string | Record<string, any>;
export declare type TransitionNameType = string;
/**
 * Follow Motion definition is copied from `rc-trigger@latest`.
 * These code can be removed when `rc-trigger` updated.
 */
declare type MotionStatus = 'none' | 'appear' | 'enter' | 'leave';
declare type MotionActiveStatus = 'appear-active' | 'enter-active' | 'leave-active';
declare type MotionNameObject = {
    [key in MotionStatus | MotionActiveStatus]?: string;
};
declare type MotionEventHandler = (element: HTMLElement, event: React.TransitionEvent<HTMLElement> | React.AnimationEvent<HTMLElement> | undefined) => React.CSSProperties | false | null | undefined | void;
export interface MotionType {
    motionName?: string | MotionNameObject;
    motionAppear?: boolean;
    motionEnter?: boolean;
    motionLeave?: boolean;
    motionLeaveImmediately?: boolean;
    removeOnLeave?: boolean;
    leavedClassName?: string;
    onAppearStart?: MotionEventHandler;
    onAppearActive?: MotionEventHandler;
    onAppearEnd?: MotionEventHandler;
    onEnterStart?: MotionEventHandler;
    onEnterActive?: MotionEventHandler;
    onEnterEnd?: MotionEventHandler;
    onLeaveStart?: MotionEventHandler;
    onLeaveActive?: MotionEventHandler;
    onLeaveEnd?: MotionEventHandler;
}
export {};
