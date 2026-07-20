# 重构进度记录

> 倒序排列（最新在最上）。每完成一步重构追加一条记录。

---

## 📍 下一步

**阶段 1.4**：抽 `Bounds` value object —— 把 `base-source.ts` 中的 `extent` / `center` / `setCenter()` / `invalidExtent`（约 20 行）抽成 `Bounds` 类，封装范围计算与中心点推导。`Source.extent` / `Source.center` 改 getter 转发 `bounds.extent` / `.center`，`executeParser` 末尾的 `this.extent = ...; this.setCenter(...); this.invalidExtent = ...` 改调 `this.bounds.update(...)`。`ClusterManager` 的 `getExtent` / `getInvalidExtent` 闭包改为读 `this.bounds.extent` / `.invalidExtent`。详见 [PLAN.md § 阶段 1.4](./PLAN.md)。

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

## [阶段 1.3] 拆 FeatureIndex delegate（commit 待回填）

- **改了什么**：
  - 新增 `src/feature-index.ts`（115 行）从 `base-source.ts` 抽出 feature 查询/更新职责：
    - 持有 private `dataArrayChanged: boolean`（状态自持，不暴露）
    - 构造期注入 5 个 getter 闭包：`getParser` / `isClusterEnabled` / `getOriginData` / `getTransforms` / `getData`
    - 方法：`getById(id)`（替代原 `getFeatureById`，含三分支语义）/ `updateProperties(id, props)`（替代 `updateFeaturePropertiesById` 主体，**不含 emit**）/ `getIdByField(field, value)`（替代 `getFeatureId`）/ `reset()`
  - `base-source.ts`（306 → 290 行，-16 行）：
    - 删除 `private dataArrayChanged: boolean = false` 字段
    - 3 个方法体收敛为转发：`getFeatureById` → `featureIndex.getById`、`getFeatureId` → `featureIndex.getIdByField`、`updateFeaturePropertiesById` → `featureIndex.updateProperties` + 保留 `emit('update')`
    - `setData` 的 `this.dataArrayChanged = false` → `this.featureIndex.reset()`
    - 构造期 `new FeatureIndex(5 个闭包)`
    - import 清理：`cloneDeep` 从 lodashUtil 解构移除（搬到 feature-index），`mergeWith` 保留（initCfg 仍用）
- **设计取舍**：
  - **`emit('update')` 留在 Source 转发端**：delegate 不持有 EventEmitter，职责单一。`updateFeaturePropertiesById` 在 Source 上仍负责 emit，delegate.updateProperties 只做数据 map + dataArrayChanged=true。
  - **5 个 getter 闭包延迟求值**：getFeatureById 读 `originData`/`data`/`transforms` 等均在 setData/executeParser 后变化，闭包每次调用拿最新值，与原字段直读语义一致。
  - **`dataArrayChanged` 不暴露 getter**：原为 private，仅 Source 内部用（getFeatureById 读、updateFeaturePropertiesById 写、setData 重置），delegate 内部闭环，Source 不再直接访问。
- **偏离 PLAN 的说明**：PLAN 估「~30 行」，实际 base-source 净减 16 行（306→290）。delegate 115 行含 ~50 行注释 + ~65 行逻辑。`getFeatureById` 三分支逻辑较密，delegate 行数偏高，但 base-source 收益实在。
- **怎么验证**：
  - `tsc --noEmit -p packages/source/tsconfig.json`：source/src 自身 0 错误，总错误 31（基线不变）。
  - `tsc --noEmit -p packages/layers/tsconfig.json`：229 个 pre-existing 错误（基线不变），`getFeatureById` / `getFeatureId` / `updateFeaturePropertiesById` / `FeatureIndex` 相关 0 错误 —— `LayerPickService.ts:116 this.layer.getSource().getFeatureById(...)` 经转发仍 work。
  - `eslint`：通过（`feature-index.ts` + `base-source.ts` 干净，`cloneDeep` 移到 feature-index 后 `consistent-type-imports` / `no-unused-vars` 规则均满足）。
  - `prettier --check`：通过。
  - `jest packages/source/__tests__`：5 suites / 27 tests 全通过。
- **风险/注意**：
  - `getFeatureById` 的 `cloneDeep(feature)` 行为保留：geojson+未聚合分支仍深拷贝原 feature，避免调用方修改污染 originData。
  - `'null'` 字符串占位（原代码 `id < length ? features[id] : 'null'`）：保留原行为，未改为 null/undefined —— 避免破坏既有调用方对「越界返回 'null' 字符串」的隐式依赖。
  - `ITransform` / `IParserData` / `IParseDataItem` 类型从 `@antv/l7-core` import 到 feature-index（与 base-source 一致，未走 source/interface re-export 避免循环）。
- **遗留**：→ 阶段 1.4 拆 `Bounds` value object（`extent` / `center` / `setCenter` / `invalidExtent`，约 20 行）。完成后 base-source.ts 约 270 行，接近 PLAN 估的「~120 行协调者」目标的中间里程碑（实际 1.x 全做完预计 ~250 行，PLAN 的 ~120 偏乐观）。

---

## [阶段 1.2] 拆 TilesetAdapter delegate（commit 6c6e372）

- **改了什么**：
  - 新增 `src/tileset-adapter.ts`（88 行）从 `base-source.ts` 抽出瓦片管理职责：
    - 持有 `manager: TilesetManager | undefined`（**public**，非 private）+ `isTile: boolean`
    - 方法：`init(data)`（替代原 `initTileset`，复用「已存在则 updateOptions、否则新建」语义）、7 个转发方法（`reloadAllTile` / `reloadTilebyId` / `reloadTileByLnglat` / `reloadTileByExtent` / `getTileExtent` / `getTileByZXY`）、`destroy()`
  - `base-source.ts`（314 → 306 行，-8 行）：
    - `tileset` / `isTile` 字段 → getter 转发 `tilesetAdapter.manager` / `.isTile`（满足 `ISource` 字段契约）
    - 删除 `private initTileset()`（14 行），`executeParser` 改调 `this.tilesetAdapter.init(this.data)`
    - 7 个 `reload*/getTile*` 方法实现体从 `this.tileset?.xxx()` 改为 `this.tilesetAdapter.xxx()`
    - `destroy()` 改调 `this.tilesetAdapter.destroy()`
    - 构造函数 `new TilesetAdapter()`（无依赖闭包，直接 new）
    - import 清理：`TilesetManager` 从 value import 改 type import（base-source 不再 `new TilesetManager`，只用 getter 返回类型）；`TilesetAdapter` 新增 value import
- **偏离 PLAN 的说明**：PLAN 估「搬出 ~40 行」，实际 base-source 净减仅 8 行（314→306）。差异主因：7 个 reload/getTile **方法签名仍在 Source 上**（ISource 接口要求），只是实现体从 `this.tileset?.xxx()` 换成 `this.tilesetAdapter.xxx()`，每个方法仍占 3 行；真正删的是 `initTileset`（14 行）+ 2 个字段（2 行），新增 getter 块（8 行）+ adapter 声明 + import。`base-source.ts` 显著瘦身要等 1.4 抽完 Bounds 后做一次方法体收敛。
- **怎么验证**：
  - `tsc --noEmit -p packages/source/tsconfig.json`：source/src 自身 0 错误，总错误 31（基线不变）。
  - `tsc --noEmit -p packages/layers/tsconfig.json`：229 个 pre-existing 错误（基线不变），`tileset` / `TilesetAdapter` / `isTile` / `getTileBy` / `reloadTile` 相关 0 错误。
  - `eslint`：通过（`tileset-adapter.ts` + `base-source.ts` 干净，`TilesetManager` 改 type import 后 `consistent-type-imports` 规则满足）。
  - `prettier --check`：通过。
  - `jest packages/source/__tests__`：5 suites / 27 tests 全通过。
  - `jest packages/source/__tests__ + packages/layers/__tests__`：81 passed / 1 skipped / 0 failed —— 瓦片图层运行时路径覆盖，`tile/core/BaseLayer.ts` 读 `source.tileset as TilesetManager` 借用实例（update/on/destroy/tiles.filter/currentTiles）行为等价。
- **风险/注意**：
  - **`tileset` getter 返回 adapter.manager 是关键设计**：layers 的 `tile/core/BaseLayer.ts:68` 直接 `this.tilesetManager = source.tileset as TilesetManager` 后**自由操作实例**（调 update/throttleUpdate/on('tile-loaded' 等)/destroy/clear/tiles.filter/isLoaded/currentTiles）。delegate 的 `manager` 必须 public 且就是 Source 原来持有的同一个 `TilesetManager` 实例 —— 本次用 getter 转发 `adapter.manager`，layers 拿到的实例与迁移前完全相同，所有方法/事件订阅/属性读取均透明。
  - `tileset` / `isTile` 从字段改 getter only：`ISource` 接口字段契约由 getter 满足；Source 内部不再写 `this.tileset = ...` / `this.isTile = ...`（改调 adapter.init），所以不需要 setter。layers 只读，无写入路径。
  - `isTile` 不主动重置：原 `initTileset` 仅在 `tilesetOptions` 存在时 `this.isTile = true`，从不重置回 false；`adapter.init` 保留同样行为（setData 切回非瓦片数据时 isTile 保持旧值）—— 与原行为一致。
  - `reloadTilebyId`（小写 b）沿用原拼写：ISource 接口签名如此，不改名避免破坏接口。
- **遗留**：→ 阶段 1.3 拆 `FeatureIndex`（`getFeatureById` / `getFeatureId` / `updateFeaturePropertiesById` + `dataArrayChanged` 状态，约 30 行）。

---

## [阶段 1.1] 拆 ClusterManager delegate（commit 2dcd055）

- **改了什么**：
  - 新增 `src/cluster-manager.ts`（138 行）从 `base-source.ts` 抽出 cluster 状态机：
    - 持有 `enabled: boolean` / `options: Partial<IClusterOptions>`（含运行时 zoom）/ private `index: Supercluster | null`
    - 方法：`init(data)`（替代原 `initCluster`）、`updateData(zoom): IParserData`（原 `updateClusterData` 主体）、`getClusters(zoom)`、`getClustersLeaves(id)`、`destroy()`、private `calcExtent(bufferRatio)`
    - 构造期注入 getter 闭包 `() => this.extent` / `() => this.invalidExtent`，delegate 不拥有 extent 状态（留待阶段 1.4 抽 Bounds value object）
  - `base-source.ts`（358 → 314 行，-44 行）：
    - `cluster` / `clusterOptions` 字段 → accessor 透明转发 `clusterManager.enabled` / `.options`（满足 `ISource` 字段契约）
    - 删除 private `clusterIndex: Supercluster` 字段
    - `getClusters` / `getClustersLeaves` / `updateClusterData` 改为转发 delegate：`updateClusterData` 负责把返回的 `IParserData` 赋给 `this.data` 并 `executeTrans()`，delegate 与 transform 链解耦
    - 删除 `initCluster()` / `calcClusterExtent()`，`processData()` 改调 `this.clusterManager.init(this.data)`
    - `destroy()` 改调 `this.clusterManager.destroy()`
    - 构造函数 first thing `new ClusterManager(...)`（必须先于 `initCfg`，因 initCfg 通过 setter 写 `cluster` 字段）
  - import 清理：`bBoxToBounds` / `padBounds` / `Supercluster` / `cluster` transform / `statMap` / `getColumn` 从 `base-source.ts` 迁到 `cluster-manager.ts`；`isFunction` / `isString` 解构删除（搬走后未用）
- **偏离 PLAN 的说明**：PLAN 估「搬出 ~150 行」，实际搬出 ~90 行逻辑 + ~50 行注释 = 138 行新文件，`base-source.ts` 净减 44 行（358→314）。差异主因：`updateClusterData` 末尾 `this.data = getParser('geojson')(...); this.executeTrans()` 拆成「delegate 返回 + Source 转发赋值」多 2 行；4 个 accessor 也比原 2 个字段声明多几行。`base-source.ts` 降到 PLAN 估的 ~120 行要等 1.2/1.3/1.4 全部完成。
- **怎么验证**：
  - `tsc --noEmit -p packages/source/tsconfig.json`：source/src 自身 0 错误，总错误 31（全是 pre-existing core `.glsl` 噪音，基线不变）。
  - `tsc --noEmit -p packages/layers/tsconfig.json`：229 个 pre-existing 错误（基线不变），`cluster` / `ClusterManager` 相关 0 错误（accessor 转发对 layers 完全透明）。
  - `prettier --check`：通过。
  - `eslint`：通过（`cluster-manager.ts` + `base-source.ts` 干净）。
  - `jest packages/source/__tests__`：5 suites / 27 tests 全通过，其中 `source.spec.ts` 的 `source.transform.cluster` case 调用 `source.updateClusterData(2/3)`，覆盖了 delegate `updateData` 路径，等价性有单测兜底。
- **风险/注意**：
  - `cluster` / `clusterOptions` 从**字段**改为 **accessor**：TypeScript 接口字段契约由 accessor 满足，运行时读写语义不变（`source.cluster = true` → setter → `clusterManager.enabled = true`）；`source.clusterOptions.zoom` 在 `DataSourcePlugin` 中读取仍 OK。
  - **构造期顺序敏感**：`this.clusterManager = new ClusterManager(...)` 必须先于 `this.initCfg(cfg)`，否则 setter 写 `clusterManager` 为 undefined 会 throw。已在构造函数中按序排列并加注释。
  - **extent 闭包延迟求值**：`calcExtent` 调用时取最新 `this.extent`（executeParser 后才赋值），与原 `this.calcClusterExtent` 直接读字段语义一致；`invalidExtent` 同理。
  - **未启用时的错误时机保留**：`enabled = false` 时 `init` 不建索引、`index = null`；此时调 `getClusters` / `updateClusterData` 仍抛 `TypeError`（null 上调 getClusters），与原行为完全一致。不加额外 guard，避免改变错误时机（这是 `DataSourcePlugin` 先检查 `source.cluster` 才调用的契约前提）。
- **遗留**：→ 阶段 1.2 拆 `TilesetAdapter`（包 `initTileset` + 7 个 `reload*/getTile*` 方法，预计再搬出 ~40 行）。

---

## [阶段 0.6] 重命名 source/ → tile-source/ + class 改名（commit 1654221）

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
