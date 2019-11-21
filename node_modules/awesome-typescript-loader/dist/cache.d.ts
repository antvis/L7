export interface CompiledModule {
    fileName: string;
    text: string;
    map?: string;
    mapName?: string;
}
export declare function findCompiledModule(fileName: string): CompiledModule;
export interface CacheParams<T> {
    source: string;
    options: any;
    transform: () => Promise<T>;
    identifier: any;
    directory: string;
}
export declare function cache<T>(params: CacheParams<T>): Promise<{
    cached: boolean;
    result: T;
}>;
