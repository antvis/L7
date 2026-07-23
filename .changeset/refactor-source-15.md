---
'@antv/l7-source': minor
---

refactor(source): add createSource factory + registry injection (stage 2.5)

新增 createSource(data, cfg, registry?) 工厂 + Source 构造器可选注入
registry 第 3 参 (默认 defaultRegistry 单例). base-source 的 executeParser /
executeTrans 与 ClusterManager 改走注入的 registry.getParser/getTransform
而非旧全局 getParser/getTransform 函数 —— 全链路 registry 注入闭环.
对外 API 完全兼容: 所有既有 new Source(data, cfg) 调用零行为变化.

- create-source.ts (新, 33 行): export function createSource(data:
  any | Source, cfg?, registry = defaultRegistry): Source, 函数式
  包装 new Source(data, cfg, registry). 推荐入口, 便于未来扩展 (默认
  cfg 合并 / registry 校验 / 异步初始化钩子) 而不破坏构造器兼容签名
- base-source.ts (+13): 加 parser-registry import (替 factory 的
  getParser/getTransform); 加 private readonly registry 字段
  (默认 defaultRegistry); 构造器增第 3 参 registry = defaultRegistry
  注入并传给 ClusterManager; executeParser/executeTrans 改
  this.registry.getParser/getTransform
- cluster-manager.ts (+9): 同 parser-registry import; 构造器第 3 参
  registry = defaultRegistry; getParser('geojson') 改
  this.registry.getParser('geojson'). 聚合 re-parse 与 Source 共用
  同一注入 registry
- index.ts (+1): export { createSource } from './create-source'
- **tests**/create-source.spec.ts (新, 71 行, 5 tests): factory 返
  Source 实例; factory ≡ new Source 等价; 默认 registry cluster
  端到端; jest.spyOn(customRegistry,'getParser') 证明 Source +
  ClusterManager 全链路走注入的 registry (parser + cluster re-parse);
  自定义 registry 状态与单例隔离 (custom-only type 不污染 default)

设计取舍:

- 构造器增可选第 3 参而非新子类: registry = defaultRegistry 默认参
  让所有既有 new Source(data, cfg) 调用零行为变化. createSource 仅
  函数式包装, 无新类继承. monorepo grep 仅 1 处 new Source(data,
  options) in packages/layers/src/plugins/DataSourcePlugin.ts:15 +
  9 处测试, 全 new Source(data, cfg?) 无第 3 参, 100% 向后兼容
- cluster-manager 共享同一注入 registry: base-source 构造 cluster-manager
  时传 registry, 保证 cluster re-parse 也走注入的 registry (不仅
  executeParser/executeTrans). spec 用 spy 验 updateClusterData(2)
  后 spy 调用次数增加
- create-source.ts 独立文件不并入 factory.ts: factory.ts 是 @deprecated
  wrapper 入口 (4 函数均弃用); createSource 是新推荐入口, 职责分离
- factory.ts 4 个 @deprecated wrapper 不动: getParser/registerParser/
  getTransform/registerTransform 全局函数仍 re-export (外部可能
  registerParser('custom', fn) 注册自定义 parser), base-source/
  cluster-manager 不再用但保留出口

向后兼容: registry 省略走 defaultRegistry 单例 (index.ts 经
registerBuiltins() 自动注册全 13 内置 parser), 与迁移前 new Source(data,
cfg) 完全等价. 注入自定义 new ParserRegistry() 可隔离注册表 (按需子集
tree-shaking / 测试隔离 / 多源异构 parser 集合), 阶段 2.4 抽出的
registerBuiltins(myRegistry) 全量注册 或 手工 registerParser 子集注册
均可用.

验证: source tsc 31 / jest 45/45 (旧 40 + 新 5) / eslint / prettier
全通过. 无 layers/l7 tsc 回归 (registry 默认参对调用方零影响).

详见 docs/refactoring/source/PROGRESS.md 阶段 2.5. 下一步阶段 3
Parser 与 Loader 解耦 (触及瓦片生命周期).
