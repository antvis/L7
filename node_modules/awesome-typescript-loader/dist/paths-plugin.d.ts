import { LoaderConfig } from './interfaces';
import * as ts from 'typescript';
export interface Request {
    request?: Request;
    relativePath: string;
}
export interface Callback {
    (err?: Error, result?: any): void;
    log?: any;
    stack?: any;
    missing?: any;
}
export declare type ResolverCallback = (request: Request, callback: Callback) => void;
export interface ResolverPlugin {
    apply(resolver: Resolver): void;
}
export interface Resolver {
    hooks: any;
    apply(plugin: ResolverPlugin): void;
    plugin(source: string, cb: ResolverCallback): any;
    doResolve(target: Hook, req: Request, desc: string, resolveContext: any, Callback: any): any;
    ensureHook(name: string): Hook;
    join(relativePath: string, innerRequest: Request): Request;
}
export interface Hook {
}
export interface Mapping {
    onlyModule: boolean;
    alias: string;
    aliasPattern: RegExp;
    target: string;
}
export interface PathPluginOptions {
    context?: string;
}
export declare class PathPlugin implements ResolverPlugin {
    ts: typeof ts;
    configFilePath: string;
    options: ts.CompilerOptions;
    baseUrl: string;
    mappings: Mapping[];
    absoluteBaseUrl: string;
    constructor(config?: LoaderConfig & ts.CompilerOptions & PathPluginOptions);
    apply(resolver: Resolver): void;
    isTyping(target: string): boolean;
    createPlugin(resolver: Resolver, mapping: Mapping): (request: any, resolveContext: any, callback: any) => any;
}
