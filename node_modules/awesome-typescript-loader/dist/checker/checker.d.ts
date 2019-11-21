/// <reference types="node" />
import * as childProcess from 'child_process';
import { QueuedSender } from './send';
import { CompilerInfo, LoaderConfig, Req, EmitFile, TsConfig } from './protocol';
export interface Resolve {
    resolve: (...args: any[]) => void;
    reject: (e: Error) => void;
}
export declare class Checker {
    seq: number;
    checker: childProcess.ChildProcess;
    pending: Map<number, Resolve>;
    compilerInfo?: CompilerInfo;
    loaderConfig?: LoaderConfig;
    compilerConfig?: TsConfig;
    webpackOptions?: any;
    sender: QueuedSender;
    constructor(compilerInfo: CompilerInfo, loaderConfig: LoaderConfig, compilerConfig: TsConfig, webpackOptions: any, context: string, fork?: boolean);
    req<T>(message: Req): Promise<T>;
    emitFile(fileName: string, text: string): Promise<EmitFile.ResPayload>;
    updateFile(fileName: string, text: string, ifExist?: boolean): Promise<{}>;
    removeFile(fileName: string): Promise<{}>;
    getDiagnostics(): Promise<any>;
    getFiles(): any;
    kill(): void;
}
