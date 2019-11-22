export declare type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export declare const tuple: <T extends string[]>(...args: T) => T;
export declare const tupleNum: <T extends number[]>(...args: T) => T;
