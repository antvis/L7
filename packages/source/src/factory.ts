/**
 * Parser / Transform 全局可变注册表（阶段 2.1 起标准化）。
 *
 * 当前行为：
 * - `PARSERS` / `TRANSFORMS` 是模块级可变对象，由 `index.ts` 通过副作用注册
 *   （`sideEffects: true` 的来源，阶段 2.4 拆 `registerBuiltins()` 修正）。
 * - `getParser(type)` 在未注册时返回 `undefined`，调用方残报 TypeError ——
 *   阶段 2.3 改抛 `ParserNotFoundError`。
 * - 阶段 2.2 把这两个 Map 收敛为 `ParserRegistry` class，
 *   旧函数作 `defaultRegistry` 的 deprecation wrapper 保留。
 *
 * 类型契约（阶段 2.1）：`ParserFunction` / `TransformFunction` 是契约的「类型
 * 擦除」版本 —— 由 `interface.ts` 的 `Parser<any, any, IParserData>` /
 * `Transform<any, any>` 字面量等价展开，用于按 string 分发的可变注册表。
 * 各 parser/transform 的 default export 已是具体 `(TData, TCfg) => IParserData`
 * 签名，结构上自动满足契约（TS 允许 required-cfg 函数赋值到 optional-cfg 类型
 * 当 cfg 形参类型是 any，阶段 2.1 PROGRESS 记录验证）。
 *
 * 重构参考：docs/refactoring/source/PLAN.md › 阶段 2.1
 */
import type { IParserData, Parser } from './interface';

/** 按字符串分发的 parser 函数（契约的类型擦除版本，等同 `Parser<any, any, IParserData>`） */
type ParserFunction = Parser;

/** 按字符串分发的 transform 函数（阶段 2.x 起由强类型 `Transform` 承接，当前保留 any） */
type transformFunction = (data: IParserData, cfg?: any) => IParserData;

const TRANSFORMS: {
  [type: string]: transformFunction;
} = {};
const PARSERS: {
  [type: string]: ParserFunction;
} = {};

export const getParser = (type: string) => PARSERS[type];
export const registerParser = (type: string, parserFunction: ParserFunction): void => {
  PARSERS[type] = parserFunction;
};
export const getTransform = (type: string) => TRANSFORMS[type];
export const registerTransform = (type: string, transformFn: transformFunction): void => {
  TRANSFORMS[type] = transformFn;
};
