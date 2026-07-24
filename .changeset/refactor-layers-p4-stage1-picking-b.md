---
'@antv/l7-layers': patch
---

refactor(layers): move picking orchestration into LayerPickingManager (1.3b)

P4 阶段 1 第二刀（1.3b，对外透明 delegate，零 API/行为变更）。1.3 整步收尾。

将编排方法 `active` / `setActive` / `select` / `setSelect` 从 BaseLayer 搬入
`core/LayerPickingManager.ts`（1.3a 已搬入 pick/boxSelect/needPick + 状态）。
BaseLayer 保留全部 `ILayer` 公开签名作为薄转发，方法体逻辑字节级镜像原实现，
子类 override 路径不变（全仓无子类 override 这四方法，已确认）。

关键设计：`reRender` 是 BaseLayer protected 成员，delegate 不能直访。采用 ctor
注入 `rerender` 回调桥接——`new LayerPickingManager(this, () => this.reRender())`，
箭头函数延迟求值，在 BaseLayer 字段初始化处定义时对 protected 可见、且不实际
调用（仅 setActive/setSelect 的 setTimeout 回调内触发）。保持 hooks
beforeHighlight/beforeSelect 编排与 `setTimeout(reRender,1)` 行为不变。

`@ts-ignore`（`@antv/async-hook` `SyncHook.call().then()` thenable，运行时成立
但类型未声明）随方法体一并搬入 delegate，归属阶段 1.3 既有标记不变。

验证：eslint 0 error、prettier 通过、layers father build 272 files（含
declaration d.ts 类型检查）、jest layers 40 suites/191 passed。
（maps `scroll_zoom.spec` 全量跑时偶现 GL texImage2D mock flaky，单跑 9 passed，
与本改动无关。）
