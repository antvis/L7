---
'@antv/l7-layers': patch
---

refactor(layers): align getScale generic signature with ILayer (stage-3 3.2)

P4 阶段 3 第二刀收尾（3.2，layers 侧，patch）。

`BaseLayer.getScale` 与 `LayerScaleLegend.getScale` 同步加
`<T = IStyleScale>` 泛型签名，对齐 `@antv/l7-core` 的 `ILayer.getScale`
接口变更（见 `refactor-core-getscale-generic` changeset）：

- `BaseLayer.getScale<T = IStyleScale>(name): T` →
  `return this.scaleLegendManager.getScale<T>(name)`
- `LayerScaleLegend.getScale<T = IStyleScale>(name): T` →
  `return this.layer.styleAttributeService
.getLayerAttributeScale(name) as T`

纯内部签名对齐，运行时零行为变化。

验证：layers eslint 0 error、prettier 通过、layers father build 278 files
（d.ts 生成、类型检查通过）、jest packages/layers packages/maps
0 failed（660 passed，1 skipped citybuilding 基线不变）。
