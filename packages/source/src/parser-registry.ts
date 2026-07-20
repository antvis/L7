/**
 * Parser / Transform 注册表 class（阶段 2.2）。
 *
 * 取代 `factory.ts` 原有的 `PARSERS` / `TRANSFORMS` 模块级可变对象。
 * `defaultRegistry` 作为单例，由 `index.ts` 在模块初始化时通过
 * `registerParser` / `registerTransform` 注册内置 parser 与 transform。
 *
 * 旧全局 `getParser` / `registerParser` / `getTransform` / `registerTransform`
 * 函数保留为 `defaultRegistry` 的 deprecation wrapper（见 `factory.ts`），
 * 对外 API 完全等价，外部调用方无需改动。
 *
 * 类型契约（阶段 2.2 弱保留）：照原按字符串擦除的行为，`getParser(type)`
 * 返回 `Parser`（不带 `| undefined`）—— 调用方仍可直接链式 `getParser('geojson')(...)`。
 * 阶段 2.3 改抛 `ParserNotFoundError` 收紧未注册错误语义。
 *
 * 重构参考：docs/refactoring/source/PLAN.md › 阶段 2.2
 */
import type { IParserData, Parser } from './interface';

/** Transform 函数契约：阶段 2.x 进一步抽 `Transform<TIn, TCfg, TOut>` 泛型 */
type TransformFn = (data: IParserData, cfg?: any) => IParserData;

export class ParserRegistry {
  private readonly parsers: Record<string, Parser> = {};
  private readonly transforms: Record<string, TransformFn> = {};

  public registerParser(type: string, parser: Parser): void {
    this.parsers[type] = parser;
  }

  public registerTransform(type: string, transform: TransformFn): void {
    this.transforms[type] = transform;
  }

  public getParser(type: string): Parser {
    return this.parsers[type];
  }

  public getTransform(type: string): TransformFn {
    return this.transforms[type];
  }
}

/** 默认注册表单例 —— 由 `index.ts` 模块初始化时注册内置 parser/transform */
export const defaultRegistry: ParserRegistry = new ParserRegistry();
