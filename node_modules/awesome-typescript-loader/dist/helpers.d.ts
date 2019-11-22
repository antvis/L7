import * as ts from 'typescript';
import { OutputFile } from './interfaces';
export declare function toUnix(fileName: string): string;
export declare function isCaseInsensitive(): boolean;
export declare function findResultFor(fileName: string, outputFiles: ts.OutputFile[]): OutputFile;
export declare function codegenErrorReport(errors: any): any;
export declare function formatError(diagnostic: any): string;
export declare function formatMessageChain(chain: ts.DiagnosticMessageChain): string;
export declare function formatLineChar(lineChar: any): string;
export declare function loadLib(moduleId: any): {
    fileName: string;
    text: string;
};
export declare function withoutTypeScriptExtension(fileName: string): string;
export declare function unorderedRemoveItem<T>(array: T[], item: T): boolean;
