---
'@antv/l7-layers': minor
---

refactor(layers): plugin metadata + registry replace/sortByOrder/getByName (stage-2 2.2)

P4 阶段 2 第二刀（2.2，layers 侧，minor）。

配合 core 侧 `ILayerPlugin` 新增的 `name?`/`order?`/`initStage?` 可选元数据
（见 `refactor-core-plugin-metadata` changeset），落地 registry 声明式 API
并为 14 内置插件各自声明唯一 `name`。

**新增公共 API（`LayerPluginRegistry`，minor 依据）**：

- `replace(name, plugin): this` — 按 `name` 精确替换已注册插件（首个匹配；
  未匹配抛错，显式 fail 避免静默吞拼写错误；替换保留下标，apply 序位不变）。
- `sortByOrder(): this` — 按 `order` 升序稳定排序（缺省视 `Infinity` 兜底，
  相同 order 保持插入序）。14 内置插件均未声明 `order`，调用为 no-op。
- `getByName(name): ILayerPlugin | undefined` — 按 `name` 查询。

**14 内置插件元数据**：各插件加 `public readonly name = '<kebab>'`（与
`registerBuiltinDefaults` 实例化顺序一致）：`data-source` / `register-style-attribute`
/ `feature-scale` / `data-mapping` / `layer-style` / `layer-mask` /
`update-style-attribute` / `update-model` / `multi-pass-renderer` / `shader-uniform`
/ `layer-animate-style` / `lighting` / `pixel-picking` / `layer-model`。
均不声明 `order`/`initStage`（保持 2.1 的插入序 apply 时序字节级一致）。

**顺带修正 pre-existing class-name typo**：`LayerMaskPlugin.ts` 原误声明为
`export default class LayerStylePlugin`（文件名/导入名与类名长期不一致，污染
emitted `.d.ts`）→ 改回 `LayerMaskPlugin`。默认 export 绑定与 `instanceof`
类身份不受影响（importer 全部经 default import 绑定到 `LayerMaskPlugin` 名），
纯严格性修正。

**行为零回归**：`ILayerPlugin` 三字段可选；registry 新方法不被 `BaseLayer.init`
调用（apply 时序与实例化语义与 2.1 字节级等价）。仅_additive_ 公共 API。

验证：layers eslint 0 error、prettier 通过、layers father build 278 files（含
declaration d.ts 类型检查）、jest layers+maps 77 suites 无真实回归
（`scroll_zoom` 的 `gl` 原生模块 texImage2D 并发 flake 单跑 9/9 通过，与本
layers 改动无因果）。
