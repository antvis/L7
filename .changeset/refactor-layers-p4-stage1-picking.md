---
'@antv/l7-layers': patch
---

refactor(layers): extract LayerPickingManager (stage-1 1.3a)

P4 阶段 1 第一刀（1.3a，对外透明 delegate，零 API/行为变更）。

从 BaseLayer 抽出拾取状态与查询 delegate `core/LayerPickingManager.ts`，
收口：

- 私有状态 `currentPickId`、`selectedFeatureID`（前者原 private，后者原 public
  但非 ILayer 成员、全仓零外部直引用）搬入 delegate
- 查询/转发方法 `pick` / `boxSelect` / `needPick`
- pick-id 状态访问器 `setCurrentPickId` / `getCurrentPickId` /
  `setCurrentSelectedId` / `getCurrentSelectedId`

BaseLayer 保留全部 `ILayer` 公开签名作为薄转发（`this.pickingManager.*`），
方法签名字节级镜像原实现，子类 override 路径不变。外部调用方
（`PickingService` / `PixelPickingPass` / `tile/interaction/utils`）全部经由
ILayer 方法访问，无一受影响。

`active` / `setActive` / `select` / `setSelect`（含 hooks beforeHighlight/
beforeSelect + `setTimeout(reRender,1)` 异步重渲染，依赖 protected `reRender`）
暂留 BaseLayer，留待 1.3b 随 reRender 桥接一并搬入——拆分以保持本刀零
protected 跨类访问、最小风险。

验证：eslint 0 error、prettier 通过、layers father build 272 files（含
declaration d.ts 类型检查）、jest layers 40 suites/191 passed、jest maps
36 suites/462 passed。
