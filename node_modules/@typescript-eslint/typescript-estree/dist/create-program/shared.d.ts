import * as ts from 'typescript';
import { Extra } from '../parser-options';
interface ASTAndProgram {
    ast: ts.SourceFile;
    program: ts.Program | undefined;
}
/**
 * Default compiler options for program generation from single root file
 */
declare const DEFAULT_COMPILER_OPTIONS: ts.CompilerOptions;
declare type CanonicalPath = string & {
    __brand: unknown;
};
declare function getCanonicalFileName(filePath: string): CanonicalPath;
declare function getTsconfigPath(tsconfigPath: string, extra: Extra): CanonicalPath;
declare function canonicalDirname(p: CanonicalPath): CanonicalPath;
declare function getScriptKind(extra: Extra, filePath?: string): ts.ScriptKind;
export { ASTAndProgram, canonicalDirname, CanonicalPath, DEFAULT_COMPILER_OPTIONS, getCanonicalFileName, getScriptKind, getTsconfigPath, };
//# sourceMappingURL=shared.d.ts.map