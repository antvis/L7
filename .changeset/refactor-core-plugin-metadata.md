---
'@antv/l7-core': minor
---

refactor(core): add optional metadata to ILayerPlugin (stage-2 2.2)

P4 阶段 2 第二刀（2.2，跨包 core 侧，minor）。

给 `ILayerPlugin` 接口（`services/layer/ILayerService.ts`）补三个可选元数据字段，
为 `LayerPluginRegistry`（2.1）的声明式排序与按名替换提供契约基础：

- `name?: string` — 插件名（kebab-case，唯一标识符）。供 `LayerPluginRegistry.replace(name, plugin)` / `getByName(name)` 按名索引，亦便于调试日志与 `addPlugin` 顺序观测。
- `order?: number` — 声明式排序优先级（升序）。`LayerPluginRegistry.sortByOrder()` 据此稳定排序；缺省视 `Infinity` 兜底，相同 order（含均为 undefined）保持插入序。
- `initStage?: 'init' | 'afterInit'` — 初始化阶段标记。当前 14 内置插件均为 `'init'`，字段为未来按阶段分流的 registry 改造预留（2.2 仅声明，不改 apply 时序）。

**向后兼容**：三字段均为可选，既有 `implements ILayerPlugin` 类不声明元数据也编译通过。
配套 layers 侧改动见 `refactor-layers-p4-stage2-plugin-metadata` changeset。

验证：core eslint 0 error、prettier 通过、core father build 98 files（含 declaration d.ts 真实类型检查）。
