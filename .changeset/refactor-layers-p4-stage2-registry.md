---
'@antv/l7-layers': minor
---

refactor(layers): extract LayerPluginRegistry (stage-2 2.1)

P4 阶段 2 第一刀（2.1，新增 registry 公共 API，minor）。

从 `BaseLayer.init()` 内联的 `createPlugins()` 抽出 `LayerPluginRegistry`
（`plugins/registry.ts`），作为图层默认插件集的可配置来源。

**新增公共 API**（minor 依据）：

- `export class LayerPluginRegistry`：数组型注册表，方法
  `registerBuiltinDefaults()`（幂等注册默认 14，每次 `new` 全新实例、
  顺序与原 `createPlugins` 字节级一致）、`register(plugin)` 追加、
  `reorder(compareFn)` 重排（稳定排序）、`getAll()` 浅拷贝读取、
  `clear()`、`isDefaultsRegistered()`。
- `BaseLayer.pluginRegistry: LayerPluginRegistry`（protected，每实例独立，
  字段初始化器 `new LayerPluginRegistry()`）。

**接入点**：外部可在 `init` 前 `layer.pluginRegistry.registerBuiltinDefaults()`

- `register` / `reorder` 自定义默认集/排序，`init` 内 `registerBuiltinDefaults`
  幂等跳过，保留外部配置。`replace(name, plugin)` 等基于元数据的精确替换留待
  2.2（`ILayerPlugin` 补 `name?`/`order?`/`initStage?` 后）。

**与 source `ParserRegistry` 的关键差异**：parser 无状态可单例
（`defaultRegistry` 单例 + `registerBuiltins`）；插件是**有状态实例**
（`DataSourcePlugin.mapService` 在 `apply` 赋值、
`FeatureScalePlugin.scaleOptions` 缓存），**不可跨图层共享** → 每图层实例
独立 registry，`registerBuiltinDefaults` 每次 new 14。

**行为零回归**：`init` 内 `this.plugins = createPlugins()` →
`this.pluginRegistry.registerBuiltinDefaults(); this.plugins = this.pluginRegistry.getAll()`，
apply 顺序与实例化语义字节级等价。`addPlugin`（init 后追加到 `this.plugins`）
行为不变，与本 registry 解耦。

旧全局 `createPlugins()` 保留为 `@deprecated` wrapper（实现为
`new LayerPluginRegistry().registerBuiltinDefaults().getAll()`），外部调用方
完全等价；`plugins/index.ts` 新增 14 插件具名 re-export 供外部按需 import。

验证：eslint 0 error、prettier 通过、layers father build 278 files（含
declaration d.ts 类型检查）、jest layers+maps 无真实回归（77 suites，
`scroll_zoom` 的 `gl` 原生模块 texImage2D 并发 flake 单跑 9/9 通过，与本 layers
改动无因果）。
