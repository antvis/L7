---
'@antv/l7-source': patch
---

refactor(source): loader 解耦 + relative-coordinates 迁出 + transform 不可变 + 测试补强（阶段 3 / 5 / 6.1-6.3）

内部重构与测试补强，对外 API 零变化：

- 阶段 3.2：RasterTileLoader 6 分支 switch 拆 4 个独立 loader（raster / rasterRgb / rasterNdi /
  image）+ 接口化分发器，瓦片生命周期可测性提升。
- 阶段 3.3：ImageLoader 抽取，image.ts parser 去内联 fetch。
- 阶段 3.4：CustomDataProvider 统一，mvt / raster CUSTOM* 走 loader 接口。
- 阶段 5.1：`relative-coordinates` 从 source 迁出至 `@antv/l7-utils`（Approach B，source 侧 re-export
  transitional 保留过渡）。
- 阶段 6.1：`filter` / `map` / `join` transform 改为返回新对象（不再原地改入参），executeTrans 语义等价。
- 阶段 6.2：raster 家族补单测（raster / rasterRgb / rgb / ndi 纯函数 happy + error，19 case）。
- 阶段 6.3：cluster / grid / hexagon 脆弱大数快照断言改为下界 + 形状断言。

详见 docs/refactoring/source/PROGRESS.md 阶段 3.2 / 3.3 / 3.4 / 5.1 / 6.1 / 6.2 / 6.3。
