---
'@antv/l7-source': patch
---

refactor(source): flatten parser/raster subdir and fix function names (stage 0.4)

扁平化 parser/raster 子目录 + 修正复制粘贴遗留的函数名:

- parser/raster/rgb.ts -> parser/rgb.ts, 函数名 rasterRgb -> rgb
- parser/raster/ndi.ts -> parser/ndi.ts, 函数名 rasterRgb -> ndi
- parser/rasterRgb.ts (注册名 rasterRgb) 保持不变, 功能与 rgb/ndi 各异
- index.ts 更新 import 路径

注: 三个 raster*Rgb parser 注册名/功能均不同, 非重复代码,
本次仅命名/位置整理, 运行时无影响, 27/27 单测通过。

详见 docs/refactoring/source/PROGRESS.md 阶段 0.4。
