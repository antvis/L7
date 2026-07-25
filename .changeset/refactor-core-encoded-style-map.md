---
'@antv/l7-core': minor
---

refactor(core): type encodeStyleAttribute via IEncodedStyleMap (stage-3 3.2)

P4 阶段 3 第一刀（3.2，core 侧 typing 子集，minor）。

PLAN 3.2 列举四项替 `any`：经审 `sourceOption`/`shapeOption`/`defaultSourceConfig`
已在历史阶段各自定型为 `ISourceOption`/`IShapeOption`/`IDefaultSourceConfig`
（PLAN 草拟时未及同步），故本轮仅收编真正剩余的 `encodeStyleAttribute:
Record<string, any>` 缺口。

新增（`services/layer/ILayerService.ts`，minor 依据）：

- `export interface IEncodedStyleValue` — 单条数据映射样式值，对齐
  `updateStyleAttribute` 的 `field`/`values` 形参（值键名历史为 `value`
  单数）；`field?: StyleAttributeField`、`value?: StyleAttributeOption`，
  保留 `[key: string]: any` 索引签名兼容历史透传的额外字段（非破坏性收窄）。
- `export type IEncodedStyleMap = Record<string, IEncodedStyleValue>`。

`ILayer.encodeStyleAttribute: Record<string, any>` → `IEncodedStyleMap`。

**向后兼容**：`any`→具名类型是收窄但非破坏——写入侧 `encodeStyle(options: {[k]:any})`
的 `options[key]`（`any`）仍可赋值 `IEncodedStyleValue`；读取侧 `getDynamicStyleInject`
形参 `Record<string, any>` 接受 `IEncodedStyleMap`。

配套 layers 侧声明同步见 `refactor-layers-encoded-style-map` changeset。
`getScale(name)` 泛型化归后续 scale delegate 专属刀（3.2 剩余子项），本刀聚焦
`encodeStyleAttribute` 缺口。

验证：core eslint 0 error、prettier 通过、core father build 98 files（d.ts 类型检查）。
