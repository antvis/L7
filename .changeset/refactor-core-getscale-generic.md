---
'@antv/l7-core': minor
---

refactor(core): genericize ILayer.getScale with IStyleScale default (stage-3 3.2)

P4 阶段 3 第二刀收尾（3.2，core 侧，minor）。

`ILayer.getScale(name: string): any` →
`getScale<T = IStyleScale>(name: string): T`（`ILayerService.ts`）。
默认 `IStyleScale` 为该返回路径的实际语义结构
（`scale`/`field`/`type`/`option`，见 `IStyleAttributeService`），
比 `any` 严格且对未指定 `T` 的调用方保持类型安全；调用方可显式 opt-in
泛型。底层 `styleAttributeService.getLayerAttributeScale(name)` 仍返
`any`（scaler 结构未具名，归后续 scale service 专属刀），经 `as T`
透传不引入类型错误。

运行时零行为变化，仅类型面收紧。配套 layers 侧实现同步见
`refactor-layers-getscale-generic` changeset。

验证：core eslint 0 error、prettier 通过、core father build 98 files
（d.ts 生成、类型检查通过）。
