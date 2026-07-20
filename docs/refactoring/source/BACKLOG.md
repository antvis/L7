# 遗留问题与待优化项

> 记录重构过程中**发现但本轮未处理**的问题，供后续接手者参考。避免重复发现。
> 字段：`[阶段]` 标记应在哪个阶段处理；`[状态]` open/done/wontfix。

---

## 待办

<!-- 示例格式：
### [阶段] 简短标题
- **位置**：`packages/source/src/xxx.ts:Lxx`
- **问题**：...
- **建议**：...
- **状态**：open
-->

### [阶段 0.4] MapboxVectorTile 4 处重复定义需统一

- **位置**：
  - `packages/source/src/interface.ts:96`（基础定义，`{ features: GeoJSON.Feature[] }`）
  - `packages/source/src/parser/mvt.ts:21`（`VectorTileLayer & { features: Feature[] }`，死 export，包内无人 import）
  - `packages/source/src/parser/testTile.ts:14`（local 使用，同 mvt.ts 形态）
  - `packages/source/src/parser/geojsonvt.ts` / `jsonTile.ts` / `source/geojsonvt.ts` 均 import 自 interface
- **问题**：4 个定义形态不一致（interface 用 `GeoJSON.Feature[]`，mvt/testTile 用 `VectorTileLayer & { features: Feature[] }`），存在类型语义漂移。mvt.ts 的 `export type` 是死导出。
- **建议**：阶段 0.4 一并清理。统一到 interface.ts 的定义（或更精确的 union），删 mvt.ts/testTile.ts 的本地重复定义。处理时需注意 `VectorTileLayer` 来自 `@mapbox/vector-tile`，与 `GeoJSON.Feature` 结构不同，可能需调整 source/geojsonvt.ts 的消费方式。
- **状态**：open
- **发现于**：阶段 0.1

### [阶段 0.4 或独立] IRasterCfg 两版定义需统一

- **位置**：
  - `packages/core/src/services/source/ISourceService.ts` —— 简化版（`extent` 必需，缺 `coordinates`/`format`/`operation`）
  - `packages/source/src/interface.ts:73` —— 完整版（extent 可选 + 多 3 字段，parser 实际使用）
- **问题**：同名 interface 两处定义且不兼容。source 的 parser 依赖完整版（用 `coordinates?`/`format?`/`operation?`），无法直接 re-export core 的。
- **建议**：让 core 的 `IRasterCfg` 也变完整（把 source 的字段补齐），然后 source 改为 re-export。需改 core，属跨包改动，建议在阶段 0.4 连同 `IRasterParserDataItem` 一起评估。
- **状态**：open
- **发现于**：阶段 0.1

---

## 已知但暂不处理的约束

- `Satistics`（拼写错误）位于 `@antv/l7-utils`，需跨包修改，留到 utils 包独立重构时处理。
- source 包 `tsconfig.json` 引用 core 源码导致 31 个 `.glsl` 模块 TSError，属 pre-existing 噪音，不阻塞本次重构。可考虑给 core 加 `*.glsl` 模块声明，但属 core 包议题。
- `testTile` parser 是 `TileDebugLayer` 调试图层的合法默认 parser（非死代码），阶段 0.5 已确认 wontfix，不移出生产 entry。

---

<!-- 以下为重构过程中新增的遗留项，倒序追加 -->

### [独立小项] RasterDataType / IRGBParseCfg 重复定义

- **位置**：
  - `packages/source/src/parser/rgb.ts:9-24`（`RasterDataType`）+ `:26-33`（`IRGBParseCfg`）
  - `packages/source/src/parser/ndi.ts:9-24`（`RasterDataType`）+ `:26-33`（`IRGBParseCfg`）
- **问题**：两个文件各自定义完全相同的 `RasterDataType` 与 `IRGBParseCfg`。ndi 用 `IRGBParseCfg` 名不副实（ndi 只用 `bands` 2 元素，不用 countCut/R/G/B MinMax）。
- **建议**：抽到 `parser/raster-types.ts` 或 `interface.ts` 共享；ndi 的 cfg 接口独立命名为 `INDIParseCfg`（仅 `bands?: [number, number]`）。
- **状态**：部分 done（阶段 2.1 已抽到 interface.ts 单一定义）；剩余：ndi 用
  IRGBParseCfg 名不副实（仅用 bands），独立命名 INDIParseCfg 留到阶段 2.x
  further split.
- **发现于**：阶段 0.4
- **闭环于**：阶段 2.1（commit 9f11ef6）

---
