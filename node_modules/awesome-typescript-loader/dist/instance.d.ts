/// <reference types="node" />
import * as fs from 'fs';
import * as ts from 'typescript';
import { Checker } from './checker';
import { CompilerInfo, LoaderConfig, TsConfig } from './interfaces';
import { Compiler } from 'webpack';
export interface Instance {
    id: number;
    babelImpl?: any;
    compiledFiles: {
        [key: string]: boolean;
    };
    compiledDeclarations: {
        name: string;
        text: string;
    }[];
    configFilePath: string;
    compilerConfig: TsConfig;
    loaderConfig: LoaderConfig;
    checker: Checker;
    cacheIdentifier: string;
    context: string;
    times: Dict<number>;
    watchedFiles?: Set<string>;
    startTime?: number;
}
export interface Compiler {
    inputFileSystem: typeof fs;
    _tsInstances: {
        [key: string]: Instance;
    };
    options: {
        watch: boolean;
    };
}
export interface Loader {
    _compiler: Compiler;
    _module: {
        meta: any;
    };
    cacheable: () => void;
    query: string;
    async: () => (err: Error, source?: string, map?: string) => void;
    resourcePath: string;
    resolve: () => void;
    addDependency: (dep: string) => void;
    clearDependencies: () => void;
    emitFile: (fileName: string, text: string) => void;
    emitWarning: (msg: Error) => void;
    emitError: (msg: string) => void;
    context: string;
    options: {
        ts?: LoaderConfig;
    };
}
export declare type QueryOptions = LoaderConfig & ts.CompilerOptions;
export declare function getRootCompiler(compiler: any): any;
export declare function ensureInstance(webpack: Loader, query: QueryOptions, options: LoaderConfig, instanceName: string, rootCompiler: any): Instance;
export declare function setupTs(compiler: string): CompilerInfo;
export interface Configs {
    configFilePath: string;
    compilerConfig: TsConfig;
    loaderConfig: LoaderConfig;
}
export declare function readConfigFile(context: string, query: QueryOptions, options: LoaderConfig, tsImpl: typeof ts): Configs;
export declare type Dict<T> = {
    [key: string]: T;
};
