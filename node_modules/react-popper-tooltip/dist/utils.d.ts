import React from 'react';
export declare const TooltipContext: React.Context<{}>;
declare type Fn = (...args: any[]) => void;
declare type FnOrBool = undefined | Fn;
export declare const callAll: (...fns: FnOrBool[]) => (...args: any[]) => void;
export declare const noop: () => void;
export declare const canUseDOM: () => boolean;
export {};
