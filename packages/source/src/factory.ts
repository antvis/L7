/**
 * Parser / Transform 注册表旧入口（阶段 2.2 起 deprecation wrapper）。
 *
 * 旧的 `getParser` / `registerParser` / `getTransform` / `registerTransform`
 * 全局函数保留为 `defaultRegistry` 的薄封装 —— 对外 API 完全等价。
 * 推荐改用 `defaultRegistry.getParser(...)` / `defaultRegistry.registerParser(...)`
 * 或自定义 `new ParserRegistry()` 实例（阶段 2.5 `createSource` 工厂可选注入）。
 *
 * 错误语义（阶段 2.3）：未注册 type 经 wrapper 转发到 `defaultRegistry.getParser`
 * / `getTransform`，自动享受抛 `ParserNotFoundError` / `TransformNotFoundError`
 * 的新语义 —— 旧调用方无需改动即可从「残报 TypeError」升级为「显式命名错误」。
 *
 * 阶段 2.4 `index.ts` 副作用注册抽取为 `registerBuiltins()` + `sideEffects: false`；
 * 阶段 2.5 创建 `createSource(data, cfg, registry?)` 工厂可选注入自定义 registry。
 *
 * 重构参考：docs/refactoring/source/PLAN.md › 阶段 2.3
 */
import type { IParserData, Parser } from './interface';
import { defaultRegistry } from './parser-registry';

export {
  defaultRegistry,
  ParserNotFoundError,
  ParserRegistry,
  TransformNotFoundError,
} from './parser-registry';

/** Transform 函数契约（与 `parser-registry.ts` 内部 `TransformFn` 等价） */
type TransformFn = (data: IParserData, cfg?: any) => IParserData;

/** @deprecated 阶段 2.2：改用 `defaultRegistry.getParser(type)` */
export const getParser = (type: string): Parser => defaultRegistry.getParser(type);

/** @deprecated 阶段 2.2：改用 `defaultRegistry.registerParser(type, p)` */
export const registerParser = (type: string, parser: Parser): void => {
  defaultRegistry.registerParser(type, parser);
};

/** @deprecated 阶段 2.2：改用 `defaultRegistry.getTransform(type)` */
export const getTransform = (type: string): TransformFn => defaultRegistry.getTransform(type);

/** @deprecated 阶段 2.2：改用 `defaultRegistry.registerTransform(type, t)` */
export const registerTransform = (type: string, transform: TransformFn): void => {
  defaultRegistry.registerTransform(type, transform);
};
