/**
 * Source 工厂函数（阶段 2.5）。
 *
 * `createSource(data, cfg, registry?)` 是 `new Source(data, cfg, registry?)` 的
 * 函数式包装 —— 推荐入口，便于未来扩展（如默认 cfg 合并、registry 校验、
 * 异步初始化钩子等）而不破坏 `new Source(...)` 构造器的兼容签名。
 *
 * 注册表注入：
 * - **默认**：`registry` 省略时走 `defaultRegistry` 单例（由 `index.ts` 模块
 *   初始化时经 `registerBuiltins()` 注册全 13 内置 parser）。与迁移前
 *   `new Source(data, cfg)` 行为完全等价。
 * - **自定义**：传入 `new ParserRegistry()`（可选 `registerBuiltins(myRegistry)`
 *   全量注册 或 手工 `myRegistry.registerParser` 子集注册）可隔离注册表，
 *   支持按需 tree-shaking / 测试隔离 / 多源异构 parser 集合。
 *
 * `Source` 构造器内部 `executeParser` / `executeTrans` 与 `ClusterManager`
 * 均改走注入的 `registry`（阶段 2.5 base-source / cluster-manager 改造），
 * 而非旧全局 `getParser` / `getTransform` 函数 —— 全链路 registry 注入闭环。
 *
 * 重构参考：docs/refactoring/source/PLAN.md › 阶段 2.5
 */
import type { ISourceCFG } from '@antv/l7-core';
import Source from './base-source';
import type { ParserRegistry } from './parser-registry';
import { defaultRegistry } from './parser-registry';

export function createSource(
  data: any | Source,
  cfg?: ISourceCFG,
  registry: ParserRegistry = defaultRegistry,
): Source {
  return new Source(data, cfg, registry);
}
