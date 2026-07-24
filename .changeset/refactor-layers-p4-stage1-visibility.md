---
'@antv/l7-layers': patch
---

refactor(layers): extract LayerVisibilityZoom (stage-1 1.8)

P4 阶段 1 第四刀（1.8，对外透明 delegate，零 API/行为变更）。

从 BaseLayer 抽出可见性/缩放管理 delegate `core/LayerVisibilityZoom.ts`，
收口 10 个方法：`show` / `hide`（含 `emit('show'|'hide')` 事件契约）、
`setIndex`（写 `zIndex` + renderList 重排）、`setMinZoom` / `setMaxZoom` /
`getMinZoom` / `getMaxZoom`、`isVisible`（zoom 范围判定）、`setAutoFit` /
`fitBounds`（未 init 落 autoFit 标记、init 后走 mapService.fitBounds）。

BaseLayer 保留全部 `ILayer` 公开签名作为薄转发。`reRender`（protected）经
ctor 注入 `rerender` 回调桥接——同 `LayerPickingManager`（1.3b）先例模式，
箭头延迟求值、字段初始化处定义、不实际调用。

子类 override 路径不受影响：`CanvasLayer.show/hide` 完全替换基类、走 DOM
显隐不调 super，保持原行为不变（已确认）。`isVisible` 被同轮 `pickingManager`
delegate（1.3a）的 `needPick` 间接调用，转发链经 BaseLayer 回路完整。

验证：eslint 0 error、prettier 通过、layers father build 274 files（含
declaration d.ts 类型检查）、jest layers+maps 76 suites/653 passed。
