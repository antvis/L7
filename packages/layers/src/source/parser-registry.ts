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
 * 错误语义（阶段 2.3 起）：`getParser(type)` / `getTransform(type)` 在未注册时
 * 抛 `ParserNotFoundError` / `TransformNotFoundError`（替代迁移前返回 `undefined`、
 * 调用方残报 `TypeError: xxx is not a function` 的语义）。返回签名保持非 `| undefined`
 * —— 抛错路径由 Error 表达，调用方仍可链式 `getParser('geojson')({...})` 无 null 守卫。
 *
 * 重构参考：docs/refactoring/source/PLAN.md › 阶段 2.2 / 2.3
 */
import type { IParserData, Parser } from './interface';

/** Transform 函数契约：阶段 2.x 进一步抽 `Transform<TIn, TCfg, TOut>` 泛型 */
type TransformFn = (data: IParserData, cfg?: any) => IParserData;

/**
 * 未注册 parser 访问错误（阶段 2.3）。
 *
 * 替代迁移前 `getParser(type)` 返回 `undefined` 后调用方残报
 * `TypeError: undefined is not a function` 的延迟错误 —— 现在在注册表边界
 * 显式抛出，错误消息携带缺失的 `type`，便于排查漏注册或拼写错误。
 */
export class ParserNotFoundError extends Error {
  public readonly type: string;

  constructor(type: string) {
    super(`ParserNotFoundError: parser not registered for type "${type}"`);
    this.name = 'ParserNotFoundError';
    this.type = type;
  }
}

/**
 * 未注册 transform 访问错误（阶段 2.3）。
 *
 * 与 `ParserNotFoundError` 对称：transform 注册表的等价错误。
 */
export class TransformNotFoundError extends Error {
  public readonly type: string;

  constructor(type: string) {
    super(`TransformNotFoundError: transform not registered for type "${type}"`);
    this.name = 'TransformNotFoundError';
    this.type = type;
  }
}

export class ParserRegistry {
  private readonly parsers: Record<string, Parser> = {};
  private readonly transforms: Record<string, TransformFn> = {};

  public registerParser(type: string, parser: Parser): void {
    this.parsers[type] = parser;
  }

  public registerTransform(type: string, transform: TransformFn): void {
    this.transforms[type] = transform;
  }

  /**
   * 取已注册的 parser。未注册时抛 `ParserNotFoundError`（阶段 2.3）。
   *
   * 返回类型保持 `Parser`（不带 `| undefined`）：抛错路径由 Error 表达，
   * 调用方可继续链式 `registry.getParser('geojson')({...})` 无需 null 守卫。
   */
  public getParser(type: string): Parser {
    const parser = this.parsers[type];
    if (parser === undefined) {
      throw new ParserNotFoundError(type);
    }
    return parser;
  }

  /**
   * 取已注册的 transform。未注册时抛 `TransformNotFoundError`（阶段 2.3）。
   *
   * 与 `getParser` 对称：返回类型保持 `TransformFn`（不带 `| undefined`）。
   */
  public getTransform(type: string): TransformFn {
    const transform = this.transforms[type];
    if (transform === undefined) {
      throw new TransformNotFoundError(type);
    }
    return transform;
  }
}

/** 默认注册表单例 —— 由 `index.ts` 模块初始化时注册内置 parser/transform */
export const defaultRegistry: ParserRegistry = new ParserRegistry();
