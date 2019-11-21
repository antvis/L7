/// <reference types="react" />
export declare function dataToArray(vars: any): any[];
export declare const transitionStr: string;
export declare const transitionEnd: string;
export declare function addEventListener(target: HTMLElement, eventType: string, callback: (e: React.TouchEvent | TouchEvent | Event) => void, options?: any): void;
export declare function removeEventListener(target: HTMLElement, eventType: string, callback: (e: React.TouchEvent | TouchEvent | Event) => void, options?: any): void;
export declare function transformArguments(arg: any, cb: any): any[];
export declare const isNumeric: (value: string | number) => boolean;
export declare const windowIsUndefined: boolean;
export declare const getTouchParentScroll: (root: HTMLElement, currentTarget: HTMLElement | Document, differX: number, differY: number) => boolean;
