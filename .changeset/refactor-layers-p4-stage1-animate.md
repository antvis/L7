---
'@antv/l7-layers': patch
---

refactor(layers): extract LayerAnimateState (stage-1 1.5)

P4 阶段 1 第四刀（1.5，对外透明 delegate，零 API/行为变更）。

从 BaseLayer 抽出动画运行态 delegate `core/LayerAnimateState.ts`，收口
2 个原 private 字段（`animateStartTime` / `animateStatus`）与 4 个方法：
`getTime`（clock.getDelta）、`setAnimateStartTime`、`stopAnimate`（含
layerService.stopAnimate + `updateLayerConfig` 关闭 animateOption）、
`getLayerAnimateTime`；另将 `prepareBuildModel` 内联启动块抽为 delegate
`prepareAnimate()`。

`animateStatus` 被 `LayerAnimateStylePlugin` 经 `@ts-ignore` 直读
`layer.animateStatus`（private + 不在 ILayer 接口）。为保留该运行时读取，
BaseLayer 新增 **public getter `get animateStatus()`** 桥接到 delegate
`getAnimateStatus()`——外部读取行为不变（读取实例属性命中 getter）。
`animateStartTime` 纯内部（仅本组方法读写），直接搬入。

`layerService` 在 BaseLayer 为 protected getter，delegate 经公开
`this.layer.container.layerService` 访问（同 `LayerVisibilityZoom` 先例）；
`updateLayerConfig` / `getLayerConfig` 均公开，可跨类调用。

顺带清理原 protected dead 字段 `animateOptions`（`{ enable: false }`）——
全仓仅声明、无任何读写（动画配置实走 `getLayerConfig().animateOption`），
protected 不属外部 API，删除零行为/零 API 变更。`IAnimateOption` import
仍被 `animate()` 方法使用，保留。

验证：eslint 0 error、prettier 通过、layers father build 276 files（含
declaration d.ts 类型检查）、jest layers+maps `--json` 干净跑 0 failed
（77 suites，1 skipped；偶发 `gl` 原生模块 texImage2D 并发 flake 已知，单跑通过）。
