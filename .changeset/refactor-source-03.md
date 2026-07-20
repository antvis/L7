---
'@antv/l7-source': patch
---

refactor(source): add strict cfg interfaces for transforms (stage 0.3)

为 5 个内置 transform（filter/map/join/grid/hexagon）新增严格 cfg interface，
内部 narrow 到具体类型获得推导。运行时零变化，ITransform index signature
保留作过渡兼容。

- 新增 src/transform/types.ts: StatMethod + 6 个 cfg interface
- filter/map/join/grid/hexagon: 内部 const cfg = option as IXxxCfg
- cluster 已用 Partial<IClusterOptions>, 未动

详见 docs/refactoring/source/PROGRESS.md 阶段 0.3。
