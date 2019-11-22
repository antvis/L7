export interface MapLike<T> {
    get(key: string): T | undefined;
    has(key: string): boolean;
    set(key: string, file: T): any;
    delete(key: string): any;
    forEach<R>(cb: (v: T, key: string) => R): any;
    map<R>(cb: (v: T, key: string) => R): R[];
}
export declare class CaseSensitiveMap<T> implements MapLike<T> {
    private store;
    get(key: string): T;
    delete(key: string): boolean;
    has(key: string): boolean;
    set(key: string, file: T): Map<string, T>;
    forEach<R>(cb: (v: T, key: string) => R): void;
    map<R>(cb: (v: T, key: string) => R): R[];
}
export declare class CaseInsensitiveMap<T> implements MapLike<T> {
    private store;
    get(key: string): T;
    delete(key: string): boolean;
    has(key: string): boolean;
    set(key: string, file: T): Map<string, T>;
    forEach<R>(cb: (v: T, key: string) => R): void;
    map<R>(cb: (v: T, key: string) => R): R[];
}
