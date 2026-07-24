---
'@antv/l7-layers': minor
---

fix(layers): unpin mapAfterFrameChange listener leak on destroy

P4 阶段 2 第四刀（2.4，strictly-better：修复真实事件泄漏，零接口变化）。

`BaseLayer.init` 在 `enableMultiPassRenderer + passes` 下以 **inline arrow**
注册 `mapService.on('mapAfterFrameChange', () => this.renderLayers())`，
而 `destroy()` 无对应 `off`——匿名箭头引用不可复现，即便加 off 也无法命中，
监听器随图层销毁后仍挂在 `mapService` 上泄漏（图层重复创建/销毁场景累积）。

修复（与既有 `onSourceUpdate` 具名实例箭头同模式）：

- inline arrow → `protected readonly onMapAfterFrameChange = (): void => { this.renderLayers(); }`
  稳定实例引用，on/off 配对解绑。
- init 内 `on(..., this.onMapAfterFrameChange)`。
- destroy 内 **无条件** `this.mapService.off('mapAfterFrameChange', this.onMapAfterFrameChange)`
  （未注册时 off 为空操作，无害；条件化注册下统一 off 比 guard 更简洁安全）。

行为变化：仅修复泄漏，renderLayers 触发时机与频率不变。属 strictly-better，
按 PLAN 阶段 2 归 minor。

验证：eslint 0 error、prettier 通过、layers father build 278 files（含
declaration d.ts）、jest layers+maps 0 failed（77 suites，1 skipped）。
