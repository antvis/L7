interface Options {
    allowRegExp: boolean;
    allowFunction: boolean;
    allowSymbol: boolean;
    allowDate: boolean;
    allowUndefined: boolean;
    allowClass: boolean;
    maxDepth: number;
    space: number | undefined;
    lazyEval: boolean;
}
export declare const replacer: (options: Options) => (this: any, key: string, value: any) => any;
interface ValueContainer {
    '_constructor-name_': string;
    [keys: string]: any;
}
export declare const reviver: (options: Options) => (this: any, key: string, value: string | ValueContainer) => any;
export declare const isJSON: (input: string) => RegExpMatchArray | null;
export declare const stringify: (data: any, options?: Partial<Options>) => string;
export declare const parse: (data: string, options?: Partial<Options>) => any;
export {};
