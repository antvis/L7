---
'@antv/l7-layers': patch
---

refactor(layers): BaseLayer stage-0 dead-code cleanup & render API doc

P4 阶段 0 第一刀（无行为变更、无 API 变更）。

- 删死代码/注释：`plugins/index.ts` 注释 import、BaseLayer 注释字段
  `pickingPassRender`、`init()` 内旧 config 注释块、注释 `tileLayer = new TileLayer` 块
- 命名/文档收口：`renderMulPass` 标 `@deprecated`（public 但不在 `ILayer` 接口、
  仓库内无内部调用方）；`renderMultiPass`/`prerender`/`setEarthTime`/`processData`
  补 JSDoc 明确各自职责与「子类可选 override」约定，与优先级矩阵「阶段 0 极低风险」一致

对应 PLAN 0.1 / 0.2 / 0.5；`@ts-ignore` 收敛(0.3)与类型抽接口(0.4)留待阶段 0 第二刀。
`renderMulPass` 的实际可见性/命名收敛留到阶段 4（渲染管线，中高风险）配合处理。
验证：layers eslint 0 error、prettier --check 通过、father build 271 files、
jest 40 suites / 191 passed（1 skipped 为 pre-existing）。
