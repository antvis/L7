---
'@antv/l7-layers': patch
---

refactor(layers): extract LayerScaleLegend (stage-1 1.6)

P4 阶段 1 第五刀（1.6，对外透明 delegate，零 API/行为变更）。

从 BaseLayer 抽出 scale 配置与图例读取 delegate `core/LayerScaleLegend.ts`，
收口 1 个原 private 字段（`scaleOptions`）与 5 个方法：`scale`（含
`styleAttributeService.updateScaleAttribute` 联动）、`getScaleOptions`、
`getScale`、`getLegend`、`getLegendItems`（`invertExtent` 分段 /
`ticks` 连续 / `domain` 枚举三分支分类法，字节级镜像原实现）。

`scaleOptions` 经 `getScaleOptions()` 返回引用，被 `FeatureScalePlugin`
缓存到其自身 `this.scaleOptions` 字段——转发返回同一 delegate 字段引用，
插件缓存语义不变。`scale()` 返回 `ILayer` 由 BaseLayer 转发层 `return this`
完成，delegate 侧改为 void。

`styleAttributeService` 在 BaseLayer 为 public，delegate 经公开
`this.layer.styleAttributeService` 访问 `getLayerAttributeScale` /
`getLayerStyleAttribute` / `updateScaleAttribute`（均 public）。

顺带清理搬运后 BaseLayer 变 dead 的类型 import（`ILegendClassificaItem` /
`ILegendSegmentItem`）与 lodash 解构项 `isUndefined`（仅声明无使用）。
`IScale` / `IScaleOptions` / `ILegend` / `LegendItems` 仍用于转发签名，保留。

验证：eslint 0 error、prettier 通过、layers father build 277 files（含
declaration d.ts 类型检查）、jest layers+maps `--json` 干净跑 0 failed
（77 suites，1 skipped）。
