---
'@antv/l7-source': minor
---

refactor(source): async lifecycle 新公开 API — Source.create / ready / dataVersion / error 事件（阶段 4）

阶段 4 异步生命周期重构引入 4 个新公开 API，纯叠加，旧 new Source(data, cfg) 路径零行为变化：

- `Source.create(data, cfg?)` 异步工厂（4.1）：内部 await init 完成后返回，消除 `source.data` 可能为
  undefined 的竞态。旧 `new Source` fire-and-forget 初始化保留不变。
- `source.ready: Promise<void>` 只读属性（4.1）：resolve 时 `inited === true` 且数据已解析；init 失败
  时 reject。消费方可 `await source.ready` 取代手写 `'update' {type:'inited'}` 监听。
- `source.dataVersion: number`（4.3a）：单调递增数据 generation 计数器，setData /
  updateFeaturePropertiesById 后 +1，updateClusterData 不 bump，构造期首次解析为 0。
- `'error'` 事件（4.3b）：setData 触发的 re-parse / cluster / transform 失败时 emit，payload 为错误
  对象。旧版本失败静默 hang，现为显式 surfacing（无监听即静默，eventemitter3 无 Node error 抛错语义）。

行为修复（strictly-better，非回归）：

- 4.2 修复 premature-resolve bug：DataSourcePlugin 迁移 `await source.ready`，消除旧
  `'update' {type:'inited'}` 监听器因 emit 时序可能错过的竞态。
- 4.4 `transforms: [{ type: 'cluster' }]` 标 `@deprecated`（运行时 warn 一次但仍工作）；
  `cluster: true` 顶层配置走 ClusterManager 直调路径，零 warning。

详见 docs/refactoring/source/PROGRESS.md 阶段 4.1 / 4.2 / 4.3a / 4.3b / 4.4。
