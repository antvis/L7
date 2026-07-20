# 重构进度记录

> 倒序排列（最新在最上）。每完成一步重构追加一条记录。

---

## 📍 下一步

**阶段 1.1**：拆 `ClusterManager` —— 把 `base-source.ts` 中的 cluster 状态机（`initCluster`/`updateClusterData`/`getClusters`/`getClustersLeaves`/`calcClusterExtent` + `clusterIndex`/`clusterOptions`/`cluster` 字段，约 150 行）抽成 `ClusterManager` delegate class，`Source` 持有它，公开成员全部保留为转发方法/getter，`ISource` 接口不动。详见 [PLAN.md § 阶段 1.1](./PLAN.md)。

---

## 记录模板

```
## [阶段 X.Y] 标题（PR #xxx / commit SHA）
- **改了什么**：
- **怎么验证**：
- **风险/注意**：
- **遗留**：→ 记入 BACKLOG.md
```

---

<!-- 以下为已完成记录，倒序追加 -->

## [阶段 0.6] 重命名 source/ → tile-source/ + class 改名（commit 待回填）

- **改了什么**：
  - `git mv` 三个文件保留历史：`source/vector.ts → tile-source/mvt.ts`、`source/geojsonvt.ts → tile-source/geojsonvt.ts`、`source/index.ts → tile-source/index.ts`
  - `git rm source/baseSource.ts`（抽象类死代码，确认无继承者）
  - class 重命名：`VectorSource → MVTSource`（`tile-source/mvt.ts`，处理 MVT/PBF 矢量瓦片）、`VectorSource → GeoJSONVTTileSource`（`tile-source/geojsonvt.ts`，处理 geojson-vt 内存切瓦片，jsonTile 复用）
  - 新 `tile-source/index.ts`：`export { MVTSource }`、`export { GeoJSONVTTileSource }`，保留 `export { default as VectorSource } from './mvt'` 作 `@deprecated` 兼容别名（= MVTSource）
  - `src/index.ts`：`export * from './tile-source/index'`（原 `export * from './source/index'`）
  - 更新 3 个 parser（`parser/mvt.ts`、`parser/geojsonvt.ts`、`parser/jsonTile.ts`）的 import 路径与 new 的类名（`VtSource/VectorSource → MVTSource/GeoJSONVTTileSource`）
- **偏离 PLAN 的说明**：PLAN 写「删除 `BaseSource` 或让它被真实继承」，实际 `source/baseSource.ts`（小写 b）是抽象类死代码、**无任何继承者**，直接删除。注意：删除的是 `src/source/baseSource.ts`，**不是** `src/base-source.ts`（连字符，主 `Source` 类，阶段 1 的主战场，绝对不动）。
- **怎么验证**：
  - `tsc --noEmit -p packages/source/tsconfig.json`：source/src 自身 0 错误，总错误 31（全是 pre-existing core `.glsl` 噪音，基线不变）。
  - `tsc --noEmit -p packages/layers/tsconfig.json`：229 个 pre-existing 错误（基线不变），`VectorSource`/`MVTSource`/`GeoJSONVTTileSource` 相关 0 错误（兼容别名生效，`VectorTile.ts` 的 `import type { VectorSource }` 仍可用）。
  - `prettier --check packages/source/src`：通过。
  - `jest packages/source/__tests__`：5 suites / 27 tests 全通过。
- **风险/注意**：
  - `git mv` 保留文件历史，blame 可追溯。
  - 兼容别名 `VectorSource = MVTSource` 让 layers 包 `import { VectorSource } from '@antv/l7-source'` 零改动继续可用，跨包影响为零。
  - 兼容别名标 `@deprecated`，正式移除留待阶段 7（届时同步 layers 改用 `MVTSource`）。
- **遗留**：→ 阶段 7 移除 `VectorSource` 兼容别名 + 同步 layers 改名；`MapboxVectorTile` 4 处重复定义仍未清理（阶段 0.1 已记 BACKLOG，留阶段 2 统一）。

---

## [阶段 0.1] interface.ts 与 l7-core 去重（commit d4d3e36）

- **改了什么**：
  - 重写 `packages/source/src/interface.ts`，将与 `@antv/l7-core` 重复的 7 个类型改为 `export type { ... } from '@antv/l7-core'` re-export：`DataType`、`IDictionary`、`IFeatureKey`、`IJsonData`、`IJsonItem`、`IParseDataItem`、`IParserData`。
  - 保留 source 专有类型（`TypedArray`、`IRasterData`、`IRasterFormat`、`IRasterFileData`、`IRgbOperation`、`Schema*`、`IBandsOperation`、`IRasterLayerData`、`IRasterCfg`、`ITileSource`、`MapboxVectorTile`）原地定义。
  - `IRasterCfg` 因 core 版本是简化版（extent 必需、缺 coordinates/format/operation），暂保留 source 完整版并加注释，后续统一记入 BACKLOG。
  - 顶部加 JSDoc 说明文件职责与重构参考。
- **怎么验证**：
  - `tsc --noEmit`：source/src 自身 0 错误（其余 31 个 `.glsl` 错误为 pre-existing，来自 core 源码引用，与本次无关）。
  - `prettier --check`：通过。
  - `jest packages/source`：27/27 通过。
- **风险/注意**：
  - `export type {} from` 是 type-only 透传，原 `import type { ... } from '../interface'` 与 `export * from './interface'` 均仍生效，对外 API 完全等价。
  - 误判 `CallBack` 是重复类型并加了 re-export，已确认 core 未 export 且 source 无人使用，已删除。
- **遗留**：→ `IRasterCfg` 两版统一、`MapboxVectorTile` 4 处重复定义，见 BACKLOG。

---

## [阶段 0.2] 修正私有方法/字段拼写错误（commit 4d3e91d）

- **改了什么**：
  - `src/base-source.ts`：`excuteParser → executeParser`（private 方法 + 1 处调用）、`caculClusterExtent → calcClusterExtent`（private 方法 + 2 处调用）
  - `src/factory.ts`：`registerTransform` 参数 `transFunction → transformFn`（局部参数，2 处引用）
- **偏离 PLAN 的说明**：PLAN 原写 `transFunction→transformFunction`，但 factory.ts 已有类型别名 `transformFunction`，参数同名会遮蔽类型，故改用 `transformFn`。功能等价。
- **怎么验证**：
  - 所有改动均为 private 方法或模块内局部参数，跨包 grep 确认无外部引用。
  - `tsc --noEmit`：source/src 自身 0 错误，总错误 31（基线不变）。
  - `prettier --check`：通过。
  - `jest packages/source`：27/27 通过。
- **风险/注意**：无对外影响。类型别名 `transformFunction`（小写，违反 TS PascalCase 约定）留到阶段 0.3 顺带处理。
- **遗留**：→ 无新增。

---

## [阶段 0.3] 为 transform 加严格 cfg interface（commit a41999c）

- **改了什么**：
  - 新增 `src/transform/types.ts`，定义 `StatMethod` 及 6 个内置 transform 的严格 cfg：`IFilterTransformCfg` / `IMapTransformCfg` / `IJoinTransformCfg` / `IAggregatorTransformCfg`（grid/hexagon 共用，别名 `IGridTransformCfg`/`IHexagonTransformCfg`）。
  - `filter.ts` / `map.ts` / `join.ts` / `grid.ts` / `hexagon.ts`：函数签名保持 `(data, option: ITransform)` 不变（factory 注册类型兼容），内部用 `const cfg = option as IXxxCfg` narrow 到具体类型，后续代码用 `cfg.field`/`cfg.method` 等获得类型推导。
  - `cluster.ts` 已用 `Partial<IClusterOptions>`，未动。
  - `ITransform` 的 index signature 保留（过渡兼容外部调用方传任意字段）。
- **设计取舍（渐进式）**：
  - 不改 transform 函数签名为具体 cfg 类型，避免与 `transformFunction = (cfg?: any)` 注册类型在 strictFunctionTypes 下产生 required/optional 不兼容。
  - `join` 的 `as` 强转因 required 字段不 overlap，用 `as unknown as` 两步转换（TS 推荐）。
  - `hexagon` 的 `[cfg.method]` computed property 因 `StatMethod | undefined` 不被接受，加 `|| 'sum'` 兜底（与 grid 行为一致，method 默认已是 'sum'）。
- **怎么验证**：
  - `tsc --noEmit`：source/src 自身 0 错误，总错误 31（基线不变）。
  - `prettier --check`：通过。
  - `jest packages/source`：27/27 通过。
- **风险/注意**：
  - 纯类型/局部变量改动，运行时行为不变（`as` 断言不产生运行时代码）。
  - 类型 narrow 后若调用方传了不符合结构的 cfg，运行时仍会按原逻辑报错（如 `Satistics.statMap[invalid]`），未新增校验 —— 符合本阶段"零行为变化"原则。
- **遗留**：→ 阶段 2 注册机制现代化时，让 transform 签名直接用具体 cfg，移除 `as` 断言。

---

## [阶段 0.4] 扁平化 parser/raster 子目录 + 修正函数名（commit e83ea40）

- **改了什么**：
  - `git mv` `parser/raster/rgb.ts` → `parser/rgb.ts`、`parser/raster/ndi.ts` → `parser/ndi.ts`，删除空的 `parser/raster/` 子目录。
  - 修正新文件 import 相对路径（`../../` → `../`）。
  - **修正函数名**（复制粘贴遗留 bug）：`parser/rgb.ts` 的 `export default function rasterRgb` → `rgb`；`parser/ndi.ts` 的 `export default function rasterRgb` → `ndi`。函数名此前三者都叫 `rasterRgb`，仅模块 default export 的局部名，导入侧用注册名，运行时无影响，但调试/栈追踪会更准确。
  - `src/index.ts` 更新两条 import 路径，prettier 顺带重排 import 顺序。
- **PLAN 修正**：PLAN 原写「合并两个同名 rasterRgb（重复）」，实际三个 `raster*Rgb` parser（`rasterRgb` / `rgb` / `ndi`）注册名与功能均不同，是命名巧合相同而非重复。本次改为「命名/位置整理」。
- **怎么验证**：
  - `tsc --noEmit`：source/src 自身 0 错误，总错误 31（基线不变）。
  - `prettier --check`：通过。
  - `jest packages/source`：27/27 通过。
- **风险/注意**：
  - `git mv` 保留文件历史。default export 函数名改动对导入方无影响（import 名独立）。
  - `parser/raster.ts`（无斜杠）是另一个独立 parser，未误改。
- **遗留**：→ `RasterDataType` / `IRGBParseCfg` 在 `rgb.ts` 与 `ndi.ts` 重复定义，且 ndi 用 IRGBParseCfg 名不副实，留待后续统一（记 BACKLOG）。

---

## [阶段 0.5] testTile 移出生产 entry — wontfix（计划前提有误）

- **调研结果**：`testTile` parser 有真实下游使用，并非 dev/demo 死代码：
  - `packages/layers/src/tile/core/TileDebugLayer.ts:11` —— `TileDebugLayer`（瓦片调试图层）的 `defaultSourceConfig.parser.type = 'testTile'`
  - `packages/layers/src/tile/utils/utils.ts:3` —— `tileVectorParser = ['mvt', 'geojsonvt', 'testTile']`，用于 `isTileGroup` 判断
  - `packages/layers/src/tile/tile/DebugTile.ts:42` —— 读取 `sourceTile.data.layers.testTile.features`
- **决定**：**不动**。PLAN 阶段 0.5「移出生产 entry」的前提（"dev/test 代码进了生产 bundle"）错误，testTile 是调试功能的合法组成部分。
- **怎么验证**：跨包 grep 确认 3 处下游依赖（见上），均为调试图层正式 API。
- **遗留**：无代码改动。后续如需做 tree-shaking，可在阶段 2 的 `registerBuiltins()` 机制里把 testTile 标记为"仅 debug bundle 需要"，但属优化而非清理。

---
