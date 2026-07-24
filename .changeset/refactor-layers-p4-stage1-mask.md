---
'@antv/l7-layers': patch
---

refactor(layers): extract LayerMaskManager (stage-1 1.7)

P4 阶段 1 第三刀（1.7，对外透明 delegate，零 API/行为变更）。

从 BaseLayer 抽出遮罩管理 delegate `core/LayerMaskManager.ts`，收口
mask 相关方法：`addMask` / `removeMask` / `disableMask` / `enableMask` /
`addMaskLayer` / `removeMaskLayer`（后两者 `@deprecated` JSDoc 随搬入）。

**关键设计**：`masks[]` 数组**保持为 BaseLayer 公开字段**——`core` 的
`LayerService`（`layer.masks.filter`）与 `BaseModel`
（`this.layer.masks.length`）直接读取该字段，故数组引用不能移入 delegate。
delegate 持有对该数组的引用并就地 mutate（push/splice），reassign 仅发生在
BaseLayer ctor 初始化与 `destroy()` 清空两处。为避免 ctor 中
`this.masks = config.maskLayers` 断开 delegate 引用，delegate 在该赋值之后
实例化（`new LayerMaskManager(this, this.masks)`）。

BaseLayer 保留全部 `ILayer` 公开签名作为薄转发；全仓无子类 override 这一组
方法（已确认）。destroy() 中 `this.masks = []` reassign 在终态、之后 manager
不再使用，无引用失效风险。

验证：eslint 0 error、prettier 通过、layers father build 273 files（含
declaration d.ts 类型检查）、jest layers+maps 76 suites/653 passed。
