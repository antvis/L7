import * as React from 'react';
declare type NoticeType = 'info' | 'success' | 'error' | 'warning' | 'loading';
export interface ThenableArgument {
    (val: any): void;
}
export interface MessageType {
    (): void;
    then: (fill: ThenableArgument, reject: ThenableArgument) => Promise<void>;
    promise: Promise<void>;
}
export interface ArgsProps {
    content: React.ReactNode;
    duration: number | null;
    type: NoticeType;
    onClose?: () => void;
    icon?: React.ReactNode;
    key?: string | number;
}
declare type ConfigContent = React.ReactNode | string;
declare type ConfigDuration = number | (() => void);
declare type JointContent = ConfigContent | ArgsProps;
export declare type ConfigOnClose = () => void;
export interface ConfigOptions {
    top?: number;
    duration?: number;
    prefixCls?: string;
    getContainer?: () => HTMLElement;
    transitionName?: string;
    maxCount?: number;
}
export interface MessageApi {
    info(content: JointContent, duration?: ConfigDuration, onClose?: ConfigOnClose): MessageType;
    success(content: JointContent, duration?: ConfigDuration, onClose?: ConfigOnClose): MessageType;
    error(content: JointContent, duration?: ConfigDuration, onClose?: ConfigOnClose): MessageType;
    warn(content: JointContent, duration?: ConfigDuration, onClose?: ConfigOnClose): MessageType;
    warning(content: JointContent, duration?: ConfigDuration, onClose?: ConfigOnClose): MessageType;
    loading(content: JointContent, duration?: ConfigDuration, onClose?: ConfigOnClose): MessageType;
    open(args: ArgsProps): MessageType;
    config(options: ConfigOptions): void;
    destroy(): void;
}
declare const _default: MessageApi;
export default _default;
