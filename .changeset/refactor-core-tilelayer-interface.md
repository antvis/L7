---
'@antv/l7-core': minor
---

refactor(core): tighten IBaseTileLayer + make ILayer.tileLayer optional (stage-5 5.1)

P4 阶段 5 第一刀（5.1，core 侧，minor）。

`ILayer.tileLayer` 原声明为非可选 `IBaseTileLayer`，但运行时
对非瓦片图层始终为 `undefined`（`Scene.initTileLayer` 仅在
`source.isTile` 时赋值；mock 一律传 `undefined`）。非可选契约被
实现侧 `any | undefined` 长期掩盖。本刀将其改为
`tileLayer: IBaseTileLayer | undefined`，使接口如实反映「瓦片图层
才有、其余为 undefined」的语义。

同时向 `IBaseTileLayer` 补 `reload(): void` —— `BaseTileLayer` 已
实现该方法且 `BaseLayer.onSourceUpdate` 经 `this.tileLayer.reload()`
外部调用，属公共能力，补入接口使其成为正式契约（additive，非破坏）。

下游实现侧（`@antv/l7-layers` `BaseLayer.tileLayer`）由 `any` 对齐
为 `IBaseTileLayer | undefined`，见 `refactor-layers-tilelayer-type`
changeset。

运行时零行为变化，仅类型面收紧/修正。所有 `.tileLayer` 消费点均经
真值守护或可选链（`LayerPickService` / `BaseLayer.render|destroy|
onSourceUpdate` / `Tile.getMaskLayer` / `DataSourcePlugin` /
`LayerMaskPlugin`），可选化不引入新空指针面。

验证：core eslint 0 error、prettier 通过、core father build 98
files（d.ts OK）。layers + scene father build 均通过（279 / 66
files），非 GL jest 子集 25 suites / 158 passed 与基线一致。
