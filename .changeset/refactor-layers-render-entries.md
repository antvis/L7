---
'@antv/l7-layers': minor
---

refactor(layers): document render entries + drop deprecated renderMulPass (stage-4 4.1)

P4 阶段 4 第一刀（4.1，layers 侧，minor）。

渲染管线 6 入口边界厘清 + 文档化（运行时零行为变化）：

- `render()`：单 pass 渲染入口（`LayerService` 在未启用
  `enableMultiPassRenderer` 时调用）。瓦片图层短路委托
  `tileLayer.render()`；否则 `beforeRenderData` 通知 + 空数据早退
  （避免数据纹理空数据导致 texture 超限），最后委托 `renderModels`。
  multipass 路径由 `LayerService` 直接调用 `renderMultiPass`，不经此方法。
- `renderMultiPass()`：multipass 渲染入口（`LayerService` 在启用
  `enableMultiPassRenderer` 时调用）；有 `multiPassRenderer` 且
  `getRenderFlag()` 为真时委托其编排，否则回退 `renderModels`。
- `renderModels()`：单 pass 共享 `model.draw` 执行器（`beforeRender` +
  逐 model draw，uniforms/blend/stencil/textures 取自 `layerModel`），
  被 `render` 与 `renderMultiPass` 复用。
- `renderLayers()`：触发 `layerService.reRender()` 批量重渲信号，前后
  标记 `rendering` 防重入。
- `prerender()`：每帧渲染前钩子，默认空体，子类可 override。

同时移除 `renderMulPass(multiPassRenderer)` —— 该方法不在 `ILayer`
公共接口、无任何内部调用方、阶段 0.2 已 `@deprecated` 并预告「将在
渲染管线收敛（阶段 4）时并入 `renderMultiPass`」。其能力已被
`renderMultiPass()` 内联的 `await this.multiPassRenderer.render()`
覆盖。属预公告的弃用移除（minor）。

验证：layers eslint 0 error、prettier 通过、layers father build 279
files（d.ts OK）、非 GL jest 子集 25 suites / 158 passed 与基线一致。
