# 重构进度记录

> 倒序排列（最新在最上）。每完成一步重构追加一条记录。

---

## [阶段 6.4] `Source.stats()` 只读快照 — `ISourceStats` 类型 + stats() 方法 + 7 case spec（commit 待补）

- **改了什么（1 新 API + 1 新类型 + 1 新 spec，纯增量，零行为变化）**：
  - **新类型 `ISourceStats`**（`packages/source/src/interface.ts`）：7 字段只读快照 ——
    `rows: number`（`data.dataArray.length`）、`bbox: BBox`（`extent`）、`parserType: string`
    （`parser.type`，默认 `'geojson'`）、`tileCount: number`（`tileset.currentTiles.length`，
    非瓦片源 / 无视口更新时 `0`）、`isTile: boolean`、`cluster: boolean`、`dataVersion: number`。
    经 `export * from './interface'` 由 index 透出；`BBox` 加进 turf import。
  - **新方法 `Source.stats(): ISourceStats`**（`packages/source/src/base-source.ts`，置于
    `getParserType()` 之后）：纯只读，不变 Source 状态。`rows` 用 `this.data?.dataArray?.length ??
0` 兜底（init 未完成时 `data` 可能为 `undefined`）；`tileCount` 用 `this.tileset?.
currentTiles.length ?? 0`；`parserType` 用 `(this.parser as IParserCfg).type || 'geojson'`
    与 `executeParser` 的默认逻辑一致。对 `new Source` / `Source.create` / `setData` /
    `updateFeaturePropertiesById` 路径**零行为变化**（minor-safe 新增 API，未触及 `ISource`
    核心契约，未加 deprecation）。
  - **新 spec `packages/source/__tests__/source-stats.spec.ts`**（7 case）：非瓦片 geojson 源
    全字段快照（rows=`dataArray.length`=`Polygon.features.length`、bbox=`extent`、
    parserType=`'geojson'`、tileCount=0、isTile=false、cluster=false、dataVersion=0）；
    parserType 与 `getParserType()` 一致；聚合源 cluster=true 且初始未 zoom 时 rows=全量 feature；
    瓦片源（mvt，`Source.create('http://t/{z}/{x}/{y}.pbf', {parser:{type:'mvt'}})`）isTile=true /
    parserType=`'mvt'` / tileCount=0 / rows=0（mvt parser `dataArray=[]`）；`setData` 后 stats
    反映新 rows + dataVersion bump（用 `once('update')` 等 re-parse 完成而非 `ready`——`ready`
    只 resolve 构造期 initPromise，setData 不重置）；`updateFeaturePropertiesById` bump dataVersion
    行数不变；`stats()` 幂等且不改 Source 状态。
- **为什么 6.4 是纯增量但仍有价值**：L7 source 一直把「当前行数 / bbox / parser 类型 / 瓦片数」
  分散在 `data.dataArray.length` / `extent` getter / `getParserType()` / `tileset.currentTiles`
  四处，调试与 size 监控需各自手取。`stats()` 收敛为一次只读调用，且 `dataVersion` 字段
  （阶段 4.3a 新增，之前无公开读取面）一并暴露，便于消费方判断数据是否已变化。不改任何现有
  成员语义，故 minor-safe。
- **实现细节 / 边界**：
  - `ISourceStats` 放 source 包 `interface.ts`（source 专有类型）而非 core `ISourceService.ts`
    的 `ISource` 契约 —— 避免触及 layers 依赖的核心接口（minor 纪律）。未来若要把 `stats()` 提到
    `ISource` 契约可作 minor/major 切片。
  - mvt 瓦片源构造不触发网络（mvt parser 仅同步组装 `tilesetOptions.getTileData` 闭包指向
    `MVTLoader`，实际取数在 `tileset.update` 视口驱动时懒加载），故 `Source.create` 完成后
    `tileCount=0` 是真实快照，测试无需 mock 取数。
  - `extent([])` 返回 `[Infinity, Infinity, -Infinity, -Infinity]`（非抛错），故 mvt 源
    `bbox` 为退化值——spec 不锁瓦片源 bbox 精确值，符合「瓦片源无全局 bbox」语义。
  - spec 必须 `import Source from '../src/'`（index，触发 `registerBuiltins()` 副作用注册
    13 parser + 6 transform）；从 `'../src/base-source'` 直引会因 registry 空抛
    `ParserNotFoundError`（与 `set-data.spec.ts` 同模式：顶部 `import '../src'`）。
- **验证（5 项全过，零回归）**：prettier ✓（3 文件）/ eslint 0 ✓（interface + base-source +
  spec）/ tsc source 0（去 glsl）✓ / jest source **133 passed**（= 6.2/6.3 后 126 baseline +
  7 新 case）✓ / tsc layers **229**（baseline，`error TS` 计数；零 `stats`/`ISourceStats`/
  `base-source` 关联错误）✓ / jest layers 57 passed 1 skipped（baseline）✓。
- **风险 / 边界**：纯增量 API，无现有成员语义改动、无核心 `ISource` 契约改动、无 deprecation。
  下界/兜底（`?? 0`、`|| 'geojson'`）保证 init 未完成 / 取数未触发时不抛错，仅返回 `0` / 默认值。
- **遗留**：无新增 BACKLOG。`stats()` 仅读现有公开成员与 `data`，未发现新隐患。

## 📍 下一步

**阶段 6 全部收敛（6.1 transform 不可变 + 6.2 raster 补单测 + 6.3 脆弱断言改造 + 6.4 `Source.stats()`）**。
6.1 把 `filter/map/join` 改为返回新对象（不再原地改入参）；6.2 补 `parser/raster.spec.ts` +
`parser/rgb.spec.ts` 19 case（raster/rasterRgb/rgb/ndi 纯函数 happy + error）；6.3 把
cluster/grid/hexagon 脆弱大数断言改下界+形状；6.4 新增 `ISourceStats` 类型 + `Source.stats()`
只读快照方法（7 字段：rows/bbox/parserType/tileCount/isTile/cluster/dataVersion）+ 7 case spec。
**至此 PLAN 阶段 0-6 全部落地**，阶段 6 完整收敛。阶段 7（class 层级 / pipeline / geojsonvt-decoder）
显式标「可选，长期」，不计入完成门槛。后续可选价值高地：

- **阶段 4.5（未来 major）**：移除 `cluster` transform 注册（`clusterTransform`
  wrapper），届时 `transforms:[{type:'cluster'}]` → `TransformNotFoundError`。需
  changeset major，defer。
- **BACKLOG**：`cluster()` pointIndex 分支 `data.dataArray` 原地改不可变（6.1 defer，
  deprecated 路径）；`rgb`/`ndi` 既存的 extent 无默认值 + 解项缺失无 guard 致崩风险（6.2
  发现，见 BACKLOG）；`BaseLayer` 的 `off('update', this.sourceEvent)` 空操作 cleanup；
  `init()` inited 双设；`processData` Promise 同步包装；setData 失败后 stale-data/inited/
  dataVersion recovery（4.3b 遗留）；raster-tile 4 小 loader 直接 per-loader 单测覆盖缺口；
  source re-export 退役（5.1 transitional，未来 minor/major 移除）；`stats()` 上提 `ISource`
  核心契约（minor/major 切片，当前仅 `Source` 类方法）。

详见 [PLAN.md § 阶段 3/4/5/6/7](./PLAN.md)。

---

## [阶段 6.3] 脆弱断言改造 — 聚合大数快照断言 → 下界 + 形状断言（commit 26602c4）

- **改了什么（4 spec 文件，纯测试改造，零生产代码改动）**：把 cluster / grid / hexagon 聚合产出的
  「具体大数」断言（随 Supercluster 算法 / 投影精度 / 测试数据增删即碎）改为**下界 + 结构形状**断言：
  - `source.spec.ts`：cluster 110/217 → `zoom2 下界 >50 + coordinates 形状` + `zoom3 > zoom2（簇拆分单调）`；
    grid 2511 → `>1000 + coordinates/count/_id:number 形状`；hexagon 1934 → 同型。map spec 的 `name===0`
    保留（非脆弱大数，精确语义断言）。
  - `data-version.spec.ts`：cluster 110/217 → `>50`（本 case 锁的是 `dataVersion===0` 不 bump 契约，
    点数精确值非主角）。
  - `create-async.spec.ts`：两处 cluster 110 → `>50`（锁的是 async 工厂 / 自定义 registry 端到端契约）。
  - `create-source.spec.ts`：两处 cluster 110 → `>50`（同上，sync 工厂 / 自定义 registry）。
- **为什么是脆弱断言**：cluster 点数由 Supercluster 在给定 zoom / radius / extent 下实时聚合算出，grid/hexagon
  bin 数由屏幕投影 + size 网格切分算出。这些数依赖 ① 算法库版本（supercluster / d3-hexbin）、② 投影常量
  （R_EARTH = 6378000 等硬编码）、③ 测试数据规模（Point ~6107 feature）。任意一项微调即令 `toEqual(2511)`
  碎裂，却无真实行为回归 → 属测试可信度陷阱。
- **保留的精确断言**：纯数 parser 的小整数（`dataArray.length===1`、csv `===2/21`、geojson `===1/2/3`）+
  值断言（`value===100`、`mag===100`）非脆弱（数据自洽、无外部算法依赖），保留。`toEqual(Point.features.length - 1)`
  （filter case）已具相对语义，保留。
- **验证（4 项全过，零回归）**：prettier ✓（4 spec unchanged after patch）/ eslint 0 ✓ /
  tsc source 0（去 glsl）✓ / jest source **126 passed**（= 6.2 后 baseline，改造仅放宽断言不增不减 case）✓ /
  tsc layers 229（baseline）✓ / jest layers 57 passed 1 skipped（baseline）✓。
- **风险 / 边界**：纯测试改造，零生产代码、零公开 API 变化、零行为变化。下界阈值选取保守（50 / 1000）远低于
  当前实际值（110 / 1934 / 2511），留足算法 / 数据漂移余量，同时仍能捕获「聚合完全失效」（返 0 / undefined）
  这类真回归。
- **遗留**：无新增 BACKLOG（6.2 发现的 rgb/ndi guard 隐患不变，仍记 BACKLOG）。

## [阶段 6.2] raster 家族补单测 — raster/rasterRgb/rgb/ndi 纯函数 spec（commit f933f91）

- **改了什么（2 新 spec 文件，16 case，零生产代码改动）**：
  - 新增 `packages/source/__tests__/parser/raster.spec.ts`（10 case）：`raster` 7 case
    （number[] 直传 happy：data=Array.from / width-height-min-max 透传 / 默认 extent 4 角派生 /
    自定义 extent / 自定义 coordinates 非矩形 / format 提供但 isNumberArray 优先走直传 / ArrayBuffer
    路径 bandsOperation 产 Promise 进 data 异步契约 / ArrayBuffer[] 包装走同路径）+ `rasterRgb` 3 case
    （number[] 直传 + rest 字段透传 / coordinates 透传）。
  - 新增 `packages/source/__tests__/parser/rgb.spec.ts`（6 case… 实为 9 case：rgb 5 + ndi 4）：
    `rgb` 5 case（显式 R/G/BMinMax 交错 RGB 输出 / 负值钳 0 / 自定义 bands 通道序 / 缺 MinMax 走
    percentile / 不足 3 波段 warn-only 无 guard 致崩）+ `ndi` 4 case（归一化差值 / 自定义 bands /
    rest 透传 / 不足 2 波段 warn-only 无 guard 致崩）。
- **为什么 6.2 真实缺口是 raster 家族（而非PLAN 字面 6 项）**：阶段 3 已为 `image`（ImageLoader 7
  case）、`mvt`（MVTLoader 6 case）、`geojsonvt`（GeoJSONVTLoader 6 case）、`jsonTile`(JsonTileLoader
  6 case）、`raster-tile`（RasterTileLoader 16 case）落 loader spec（happy + error，mock 取数 utils）；
  另 `CustomDataProvider` 6 case。**唯一无 spec 的 parser = `raster`/`rasterRgb`/`rgb`/`ndi`**（同步
  纯函数：band 操作 + 坐标投影，无需 mock loader，直接断言）。故 6.2 实际补这 4 个纯函数 parser。
- **发现既存隐患（记 BACKLOG，未在本步修——6.2 是补测试不改行为）**：① `rgb.ts` 的 `extent` 用非空
  断言 `extent!`（无默认值），缺 extent + coordinates 时 `extentToCoord` 读 `extent[0]` 崩；
  ② `rgb`/`ndi` 不足波段时仅 `console.warn` **不 guard**，warn 后仍访问缺失波段致崩（percentile
  读 `undefined.length` / 循环读 `undefined[0]`）。spec 把这建模为「warn + throw（既存无 guard 行为）」
  断言，锁住现状避免回归。修复留 BACKLOG（加 guard 是 strictly-better minor，但非 6.2 范畴）。
- **验证（4 项全过）**：prettier ✓（2 spec unchanged after patch）/ eslint 0 ✓ /
  tsc source 0（去 glsl，spec 在 tsconfig include 内故需补 `IRGBParseCfg` required `min/max`）✓ /
  jest source **126 passed**（110 baseline + 16 新增，19 suites，全绿）✓。
- **风险 / 边界**：零生产代码改动（纯补测试），无行为变化、无公开 API 变化。新 spec 不引入新依赖
  （仅 jest + 既有 parser import）。

## [阶段 6.1] transform 不可变 — filter/map/join 返回新对象（commit 215b2ea）

- **改了什么（3 文件，纯内部重构）**：
  - `packages/source/src/transform/filter.ts`：`data.dataArray = data.dataArray.filter(callback); return data;`
    → `return { ...data, dataArray: data.dataArray.filter(callback) };`（无 callback 时原样返回 `data`）。
  - `packages/source/src/transform/map.ts`：同型改 `data.dataArray = data.dataArray.map(callback); return data;`
    → `return { ...data, dataArray: data.dataArray.map(callback) };`。
  - `packages/source/src/transform/join.ts`：`geoData.dataArray = geoData.dataArray.map(...); return geoData;`
    → `return { ...geoData, dataArray: geoData.dataArray.map(...) };`。
- **为什么是零行为变化（executeTrans 等价性证明）**：`base-source.ts:367-373` `executeTrans()` 对每个
  transform 执行 `Object.assign(this.data, getTransform(type)(this.data, tran))`。改前 filter/map/join
  原地改 `data.dataArray`（data === this.data）+ 返回同引用，`Object.assign(this.data, this.data)` = no-op
  （dataArray 已就地改）。改后返回 `B = {...A, dataArray: newArr}`（A = this.data 未被改），`Object.assign(A, B)`
  把 B 的 own enumerable props 回写 A：`A.dataArray = B.dataArray`（新数组），其余 props `B[p] === A[p]` 故
  `A[p] = A[p]` no-op → 最终态与原地改**逐字段等价**，且 `this.data` 引用保持稳定（Object.assign 不换引用，
  消费方持引用安全）。callback 执行期间 `data.dataArray`（RHS 读取）在两种实现下均为原始数组，对闭包读
  `data.dataArray` 的 callback 亦等价。
- **切片边界（为何不含 grid/hexagon/cluster）**：PLAN line 100 明确写「filter/map/join」。
  ① **grid/hexagon**：本就返回全新对象（`aggregatorToGrid`/`pointToHexbin` 不改入参 dataArray），**已不可变**，
  无需改；② **cluster**：transform 路径已 @deprecated（`clusterTransform` wrapper warn + delegate，Path B
  broken），且 `cluster()` no-pointIndex 分支返回 Supercluster 实例（非 IParserData，ClusterManager 直调
  Path A），pointIndex 分支的 `data.dataArray = formatData(...)` mutation 在 deprecated/legacy 领域，
  纳入 6.1 风险 > 收益 → **defer BACKLOG**。
- **方案（patch：纯内部重构，零公开 API 变化，零行为变化）**：不动 `executeTrans`（`Object.assign` 对新对象
  语义已正确，无须改 `this.data = data` 直装——后者会换 `this.data` 引用，属另一风险面，非 6.1 范畴）。
  不动 builtins.ts 注册、不动 transform/types.ts cfg 契约。
- **验证（6 项全过，回归网 = 5 transform spec）**：prettier ✓（3 文件 unchanged）/ eslint 0 ✓ /
  tsc source 0（去 glsl）✓ / tsc layers 229（baseline 不变，全 maps/TMap pre-existing）✓ /
  jest source **110 passed**（= 基线；`source.transform.filter/grid/hexagon/map/join` 5 case 全过 =
  transform 行为等价证明）✓ / jest layers **57 passed 1 skipped**（= 基线）✓。
- **风险 / 边界**：零公开 API 变化、零行为变化（legacy「input 是否被 mutate」契约非公开——filter/map/join
  仅经 builtins 注册消费，无外部直接 import，git grep 确认）。`{...data}` 浅拷贝成本可忽略（ dataArray 数组
  本就 filter/map 产生新数组）。未引入新类型。
- **遗留**：① `cluster()` pointIndex 分支不可变（BACKLOG，deprecated 路径，低优先）；② `executeTrans` 改
  `this.data = data` 直装（另一优化面，非 6.1 范畴，留 BACKLOG）；③ 6.2 transform 单测补充（filter/map/join
  直接 unit 调用 currently 无独立 spec，仅经 Source 集成覆盖）。

## [阶段 5.1] relative-coordinates 迁出 source → @antv/l7-utils（Approach B 执行，commit c4dd0de）

- **改了什么（4 文件跨 3 包）**：
  - 新增 `packages/utils/src/relative-coordinates.ts`（189 行）—— 4 函数 + 2 interface
    迁入，**泛型化解耦**：`<T extends { coordinates?: any[] }>` 替 `IParseDataItem[]` 参数、
    `IRelativeCoordinateResult<T>` 替 `IRelativeCoordinateResult`。无 `@antv/l7-core` 依赖。
  - `packages/utils/src/index.ts`：加 `export * from './relative-coordinates';`（无命名碰撞）。
  - 重构 `packages/source/src/index.ts`：`export * from './utils/relative-coordinates';` →
    命名 re-export 自 `@antv/l7-utils`（4 函数 `export {}` + 2 interface `export type {}`）——
    **transitional 保公开 API**（minor-safe，未来 major 退役）。
  - `packages/source/src/utils/relative-coordinates.ts`：**删除**（git rm，逻辑移入 utils）。
  - `packages/layers/src/core/BaseLayer.ts:42`：`import { processRelativeCoordinates } from
'@antv/l7-source'` → 合并入既有 `@antv/l7-utils` import（去重，避免 duplicate-import lint）。
- **方案（minor：包边界修复，source re-export 过渡保公开 API；唯一消费方改 import 源）**：
  - **类型设计最终选择 = 泛型（非 scoping 草拟的 minimal interface）**：scoping 阶段 BACKLOG
    草拟 `IRelativeDataItem { coordinates?: unknown }` minimal interface。**执行期发现推翻**：
    `BaseLayer.ts:1423` 把 `result.dataArray` **赋回** `this.layerSource.data.dataArray`
    （`IParserData.dataArray: IParseDataItem[]`）。minimal `IRelativeDataItem[]` → `IParseDataItem[]`
    会因缺 `_id: number` + index signature 兼容性 **tsc 失败**。泛型 `<T extends { coordinates?: any[] }>`
    令 `T = IParseDataItem`（BaseLayer 入参推断），`result.dataArray: IParseDataItem[]` 直接赋回
    零涟漪。**代价**：`IRelativeCoordinateResult` 变 `IRelativeCoordinateResult<T>`（泛型，
    source `export type` re-export 泛型 interface 合法）；`coordinates` 内部仍 `any[]`（与
    迁移前 `IParseDataItem.coordinates: any[]` 同，递归 `coords[0]` 零摩擦）。
  - **Approach A（layers 目标）弃用**：source↔layers re-export 循环（layers→source 已存在）→
    re-export 过渡不可能 → 须 breaking 移除（major 级，程式冲突）。见 PROGRESS [阶段 5.1 scoping]。
  - **行为零变化**：函数逻辑字节级搬运（仅加泛型 type 参数，运行时擦除）；import 源 l7-source →
    l7-utils（re-export 等价，运行时同函数）。
- **验证（7 项全过，含严格 baseline 对比）**：prettier ✓ / eslint --max-warnings 0 ✓ /
  tsc utils 0（新 home 编译） / tsc source 0（去 glsl；re-export + 泛型 interface re-export）/
  tsc layers 229（baseline 不变，**BaseLayer:1421 泛型 T 推断 IParseDataItem 正确、result.dataArray
  赋回零错**；无新增非 TMap 错误）/ jest source 110 / **jest layers 57 passed 1 skipped —— 与
  改前 stash 对比 baseline 完全一致（57/1-skip），严格无回归证明**。
- **风险 / 边界**：source re-export 为 transitional（未来 minor/major 退役，记 BACKLOG）；
  泛型 `IRelativeCoordinateResult<T>` 公开 type 形状变化（`<T>` 参数化），但 source re-export
  保留可消费性、BaseLayer 不受影响；`coordinates: any[]` 约束保留迁移前宽松类型（未收紧）。
- **遗留**：① source re-export 退役（BACKLOG，未来 major）；② 4 函数无直接单测（行为由
  BaseLayer 集成间接覆盖，BACKLOG 低优先）。

---

## [阶段 5.1 scoping] relative-coordinates 迁出 source — 依赖图勘探 + 方案修订（commit 4eab778）

- **评估什么**：5.1 原 PLAN 拟「`relative-coordinates.ts` 迁 layers/utils + source 保 type
  re-export 过渡一个 minor」。本步勘探依赖图 + call sites 判定目标可行性 + re-export 过渡
  是否成立。
- **勘探结论**：
  - **`IParseDataItem` 定义在 `@antv/l7-core`**（`core/src/services/source/ISourceService.ts:119`）；
    source 的 `interface.ts:22` 仅 re-export（阶段 0.1 已统一）。
  - **依赖图**：`core→utils`、`source→{core,utils}`、`layers→{core,source,utils}`（各 package.json deps 确认）。
  - **唯一函数消费方**：`packages/layers/src/core/BaseLayer.ts:42` `import { processRelativeCoordinates
} from '@antv/l7-source'`（+ 同类 `1404-1422` `processRelativeCoordinates()` 方法）。其余 `relativeOrigin`
    /`enableRelativeCoordinates` 命中均为 layers 内 config 字段 / 本地变量，与函数迁出无关。
    `source/loader/geojsonvt-loader.ts:155` 的 `relativeOrigin:[0,0]` 是无关瓦片字段。
    examples/dev/docs **零代码 import**（仅 BACKLOG/PLAN/PROGRESS 文档引用）。
  - **`@antv/l7-utils` 无任何 `@antv/*` 依赖**（deps: @babel/runtime/@turf/earcut/eventemitter3/gl-matrix）。
- **两方案**：
  - **Approach A（target=layers）❌**：layers 已有 core（拿类型），消费方改本地 import；
    **但 source→layers re-export 循环**（layers→source 已存在）→ re-export 过渡**不可能** →
    source 公开导出须**彻底移除** = breaking（major 级 API 移除），与「major removal 留未来」纪律冲突。
  - **Approach B（target=utils，推荐）✓**：utils 无 l7 依赖 → 须**解耦 `IParseDataItem` 类型依赖**
    （4 个函数 + `IRelativeCoordinateResult` 仅用 `item.coordinates`，改泛型
    `<T extends {coordinates?: unknown}>` 或本地 `IRelativeDataItem` minimal interface）。
    source `export {...} from '@antv/l7-utils'` re-export（source→utils 已存在，**过渡保公开 API**，
    minor-safe）；BaseLayer 改 `import from '@antv/l7-utils'`。**代价**：`IRelativeCoordinateResult.dataArray`
    类型 `IParseDataItem[]` → `T[]`/`IRelativeDataItem[]`（公开 type 涟漪，需泛型默认值或接受收窄；
    BaseLayer 结构访问不受影响）。**推荐 B**：保 minor-safe + 符合 PLAN 原「re-export 过渡」意图。
- **纯评估切片，无代码改动**（同 4.1b / 4.2 后续评估模式）。PLAN 5.1/5.2 已据发现修订
  （记 Approach A/B + 推荐 B）。下一「继续」执行 Approach B。
- **风险 / 待决**：Approach B 的 `IRelativeCoordinateResult<T>` 默认值选取（无 core 依赖下无天然默认
  → `T = {coordinates?: unknown}` 或接受 `dataArray` type 收窄）；`IRelativeDataItem` 与 `IParseDataItem`
  结构兼容性须 tsc 验证（IParseDataItem 无 index signature，minimal interface 须不含冲突必填字段）。
- **基线**：无代码改，jest source 110 baseline 不变（docs only）。

---

## [阶段 3.2.2] RasterTileLoader 6 分支 switch 拆 4 loader + 接口化（commit 0ce4700）

- **改了什么（5 文件）**：
  - 新增 `packages/source/src/loader/raster/image-raster-loader.ts` — `ImageRasterLoader`
    （IMAGE + 未命中兜底，保 3.2.1 `default` 分支语义；双用 tileParams+tile）。
  - 新增 `packages/source/src/loader/raster/buffer-raster-loader.ts` — `BufferRasterLoader`
    （ARRAYBUFFER；RGB 在 parser 侧已归并 ARRAYBUFFER 故共用；双用 tileParams+tile）。
  - 新增 `packages/source/src/loader/raster/custom-image-raster-loader.ts` —
    `CustomImageRasterLoader`（CUSTOMIMAGE/CUSTOMTERRAINRGB 共享，tile-only）。
  - 新增 `packages/source/src/loader/raster/custom-raster-loader.ts` — `CustomRasterLoader`
    （CUSTOMARRAYBUFFER/CUSTOMRGB 共享，tile-only，format/operation 构造期注入）。
  - 重构 `packages/source/src/loader/raster-tile-loader.ts` — 导出 `IRasterTileLoader`
    接口（`loadTile(tileParams, tile): Promise<unknown>`）+ `RasterTileLoader` 分发器持
    `Map<RasterTileType, IRasterTileLoader>` 按 tileDataType 选 loader、未命中走
    `ImageRasterLoader` 兜底；删原 `loadCustomImageData`/`loadCustomRasterData` 私有方法
    （逻辑移入对应小 loader）。唯一消费方 `parser/raster-tile.ts` 零改动。
- **方案（patch 级纯内部重构，零行为变化；公开 API `ctor(data, tileDataType, cfg)` +
  `loadTile(tileParams, tile)` 不变）**：
  - **PLAN 偏差（6→4 loader）**：原 PLAN 拟拆 6 独立小 loader，但 6 个 `RasterTileType`
    enum 仅 **4 种取数行为** —— CUSTOMIMAGE/CUSTOMTERRAINRGB 共享 `CustomImageRasterLoader`、
    CUSTOMARRAYBUFFER/CUSTOMRGB 共享 `CustomRasterLoader`；拆 6 会成对重复（同一段
    `provider.fetch(tile).then(decode)` 逻辑复制两份），故拆 4。Map 仍列 6 key（映射到
    4 loader 实例），未命中落 image 兜底（保 default 分支：TERRAINRGB/未知 → getTileImage）。
  - **构造期 resolve**：tileDataType 构造期固定，故 loader 在 ctor 内
    `loaders.get(tileDataType) ?? image` resolve 一次（等价原 `loadTile` 每次 call 重判
    switch，略省）。CUSTOM\* 4 分支仍共用一个 `CustomDataProvider` 实例（与 3.4 同；provider
    无状态故按 enum 拆无行为差异）。
  - **fewer-params 失败回退教训**：初版 CUSTOM\* loader 试省 `tileParams`（CUSTOM\* 只用
    `tile`）改单参 `loadTile(tile)` —— **tsc 失败**：TS 从左对齐参数，省第一个 `tileParams`
    会令实参 `tile` 对齐 interface 第一参 `tileParams`，类型不匹配。已回退完整 2-param
    `loadTile(tileParams, tile)`；未用的 `tileParams` 依赖 `@typescript-eslint/no-unused-vars`
    默认 `args:'after-used'`（不检查末位使用参数前的位置参数）零告警。**无
    `argsIgnorePattern`**，`_` 前缀无效，故不省参。custom-image loader 注释一度残留
    fewer-params 措辞（截断句 + 自相矛盾）本次修复。
  - **`import type` 坑**：分发器 `import type { CustomDataProvider }` 但 ctor
    `new CustomDataProvider(...)` 作值用 → tsc TS1361（cannot be used as a value）。改回
    值 import `import { CustomDataProvider }`（与迁移前同）。**此错上一轮交接未捕获**
    （推断因 fewer-params 回退后未重跑 tsc），本轮重跑 5 项验证发现并修复。
  - **分支等价性逐条核对**（vs 迁移前 switch）：IMAGE→getTileImage / ARRAYBUFFER→
    getTileBuffer / CUSTOMIMAGE·TERRAINRGB→ loadCustomImageData 逻辑（provider.fetch→
    !data reject / ArrayBuffer formatImage / HTMLImage 直传 / else reject）/
    CUSTOMARRAYBUFFER·RGB→ loadCustomRasterData 逻辑（provider.fetch→ data.length===0
    reject / else processRasterData；format=cfg.format||defaultFormat 构造期注入）/
    default→getTileImage 兜底。全部字节级等价。
- **验证（5 项全过）**：prettier ✓ / eslint --max-warnings 0 ✓（after-used 不告警未用
  tileParams，确认无 argsIgnorePattern 依赖成立）/ tsc source 0（去 glsl 31 噪音）/
  tsc layers 229 不变 / jest source 110 passed（含 raster-tile-loader.spec **16 case
  全过** = 行为等价唯一证明，零新增 spec）。
- **风险 / 边界**：公开 API 不变 → 零回归；CUSTOM\* 4 分支共用一个 provider 实例
  （provider 无状态，按 enum 拆 provider 无收益）；CUSTOM-image 的 async-cb「挂起」
  既存隐患（迁移前既有，见 3.4）本阶段不修正（BACKLOG）。
- **遗留**：① 4 小 loader 缺直接单测（行为已由 16 case 间接锁，BACKLOG 记档）；
  ② CUSTOM-image async-cb 挂起隐患（3.4 既存，defer）。

---

## [阶段 4.1b 评估] `new Source` deprecation — 勘探结案 wontfix（commit efe236d）

- **评估什么**：阶段 4.1 原含「保留 `new Source` 走旧路径并 `console.warn` deprecation」，4.1a 纯叠加切片推迟到 4.1b。本步勘探全仓 call sites 判定 deprecation 是否可行 / 有无 bad-pattern 可推。
- **勘探结论（git grep 全仓 `new Source(` / `Source.create(` / `createSource(` —— `-- packages`）**：
  - **生产代码 `new Source(` 仅 1 处**：`packages/layers/src/plugins/DataSourcePlugin.ts:15`（`source = new Source(data, options)`）—— 正是阶段 4.2 迁移到 `new Source` + `await source.ready` 的合法 race-free 模式（`if (source.inited)` fast-path + `else await source.ready`，已读确认 L10-36）。非 `Source.create`，而是借 4.1 的 `ready` getter 消除 race。
  - **`Source.create(` 生产零消费**：仅 spec 文件（`create-async` / `data-version` / `set-data`）+ `base-source.ts` 内部定义/doc 注释。
  - **`createSource(` 生产零消费**：仅 spec（`create-source.spec`）+ source 包内 doc 注释与自身定义（`base-source.ts` / `create-source.ts` / `factory.ts` / `builtins.ts` / `interface.ts`）。
  - source 包内其余 `new Source(` 命中均为工厂内部（`base-source.ts` `Source.create` 内部 `new Source`、`create-source.ts` `createSource` 包装 `new Source`）—— 非消费 call site。
  - examples/demos 多处 `new Source(geoData)`，但属 demo 代码 + 经 layer 包装（`layer.setData` 路径），非直接 race 场景。
- **wontfix 五条理由**：
  1. **自相矛盾**：4.1b「`new Source` 加 `console.warn`」会 nag 唯一生产消费方 `DataSourcePlugin` —— 而它用的正是 4.2 确立的合法 `new Source` + `await ready` 模式。warn 一个合法站点是错误的。
  2. **零 bad-pattern call site**：4.2 已清掉唯一真实 race（DataSourcePlugin 旧 `'update'` 手写 Promise premature-resolve + init 失败 hang）。全仓无「`new Source` + 同步读 `source.data` / `inited`」的 race 残留。
  3. **`Source.create` / `createSource` 生产零采用 → 无迁移可「推」**：deprecation 推动退役的目标 API 没有消费方，deprecation 无对象。
  4. **`new Source` 是公开构造器**：doc + examples 大量使用，是主流入口。deprecate 它属 major 级 API 劝退，不该在 minor 周期推进。
  5. **race 已在消费侧解决**：4.1 的 `ready` getter 已提供 opt-in await surface（`new Source` + `await source.ready`）；非 await 路径的 unhandled rejection 是 4.1 明确保留的现状（fire-and-forget 语义）。`Source.create` 仅是 sugar，非必需。
- **纯评估切片，无代码改动**（同 4.2 后续 BaseLayer:1070 评估 `f20b3e6` 模式）。阶段 4 主题（4.1 infra + 4.2 迁移 + 4.2 后续评估 + 4.3a 版本号 + 4.3b 失败 surfacing + 4.4 cluster 合并 + 4.1b deprecation 评估）全部收敛。后续应转向 stage 3.2.2（loader 解耦弧延续）或 stage 5（包边界）。
- **基线**：无代码改，jest source 110 baseline 不变（docs only，lint-staged case-police 仅碰 `*.md`）。

---

## [阶段 4.3b] setData 失败 surfacing — swallow/hang → 'error' 事件（commit 4796148）

- **改了什么**：
  - `packages/source/src/base-source.ts` `setData`：`this.init().then(emit 'update')` → 追加 `.catch((err) => this.emit('error', err))`。零签名变化（仍 `void`），零调用方影响（BaseLayer/swipe/examples 均事件消费，不 await）。
  - 新增 `packages/source/__tests__/set-data.spec.ts`（3 tests）。
- **方案（minor：strictly-better 行为，零签名变化）**：
  - **诊断**：setData 旧路径 `init().then(emit 'update')` 无 `.catch`。re-parse/cluster/transform 失败 → `processData` reject → `init()` async reject → `.then` 不执行 → `'update'` **不 fire**（事件消费方 hang，如 BaseLayer.dataUpdatelog 的 `once('update')` debug-log 收尾不闭合）+ fire-and-forget **未捕获 rejection**（吞错）。这正是 4.2 为构造期 `initPromise` 修的 swallow/hang 模式在 setData 路径的复刻。
  - **fix**：`.catch((err) => this.emit('error', err))`。`'update'` 仍仅成功时 fire（契约不变）；失败由 `'error'` surface。eventemitter3（Source 所用）无 Node `EventEmitter` 的「'error' 无监听即抛」语义 → 无监听即静默，**安全**（不会 crash）。
  - **为何不 return Promise（opt-in await surfacing，同 ready）**：虽 `no-floating-promises` 未在 eslint.config 启用（call-site 不会 lint 报错），但 void+事件是 setData 既有契约；return Promise 属 API 变更，留待未来切片单独评估。本切片仅修 swallow（最小 strictly-better）。
- **4.3b 原构想（同 schema skip re-parse）dead-end 结案**：
  - 勘探 executeParser / clusterManager.init / executeTrans 的 data-vs-schema 依赖：parse（`sourceParser(originData, parser)`）、`tilesetAdapter.init(this.data)`、`bounds.update(extent(data.dataArray))`、clusterManager.init（`cluster(data)` 重建 Supercluster 索引）、executeTrans（transforms on `this.data`）**全 data-dependent**。唯一 schema-dependent 步骤是 `registry.getParser(type)` 查表（微秒级）。
  - setData 本质即换 `originData` —— 「同 schema + 不同 data」仍须全量 re-parse（data 变了）；「同 schema + 同 data」是退化 no-op。故 skip re-parse 无收益，dead-end。结案记 BACKLOG（wontfix）。
- **风险 / 边界**：
  - 成功路径字节级不变（`.then` 链仅在失败时多走 `.catch`），tsc layers 229 / jest layers-plugins 6 baseline 不变佐证零回归。
  - 失败时 `dataVersion` 已 bump（reseat 已发生，4.3a 语义）但 `this.data` 为旧 parse 结果（stale）；`inited` 留 false。recovery（回滚 originData / 恢复 parser / 重置 dataVersion）不在 4.3b 范围 → BACKLOG 记档。
  - 无消费方当前监听 `'error'`（git grep 确认 source/layers 零 `'error'` 监听）—— 纯 additive surfacing，不破坏既有行为。
- **基线**：tsc core 0 / tsc source 0（去 glsl 31 噪音）/ tsc layers 229（不变）/ jest source 110（107+3）/ jest layers-plugins 6 / eslint 0。
- **遗留**：① setData 失败后 stale-data/inited/dataVersion recovery（BACKLOG）；② return-Promise opt-in await surfacing（未来切片评估）；③ 原 skip-reparse dead-end（BACKLOG wontfix）。

---

## [阶段 4.3a] dataVersion 版本号计数器 — 纯叠加 infra（commit 9aff994）

- **改了什么**：
  - `packages/core/src/services/source/ISourceService.ts`：`ISource` 新增 `dataVersion: number` 契约字段（after `data`，doc 注明 bump 点 / 不 bump 点 / 纯叠加 / 4.3b 展望）。
  - `packages/source/src/base-source.ts`：
    - 新增 `public dataVersion: number = 0`（after `data`，doc 同上）。
    - `setData`：`this.originData = data` 后 `this.dataVersion++`（reseat 同步阶段 bump，先于 init / `'update'` fire）。
    - `updateFeaturePropertiesById`：`featureIndex.updateProperties` 后、`emit('update')` 前 `this.dataVersion++`（原地变更同步 bump）。
  - 新增 `packages/source/__tests__/data-version.spec.ts`（5 tests）。
- **方案（minor：纯叠加 infra，零行为变化）**：
  - **契约定义**：`dataVersion` = 单调递增 generation。bump 点 = 用户发起的、改变数据语义的操作（`setData` 全量 reseat + `updateFeaturePropertiesById` 原地属性变更，二者均 emit `'update' {type:'update'}`）。不 bump = `updateClusterData`（zoom 驱动聚合视图重算，originData 未变，属派生视图，不 emit）+ 构造期首次 parse（generation 0 = 初始数据）。
  - **setData bump 时机**：bump 在 `this.originData = data` 之后**同步**执行（init 仍 async）。故 `setData` 调用返回时 `dataVersion` 已 +1，而 `'update'` 事件仍 in-flight —— 下游可读 version 判断「新版本 loading，缓存已过期」，`'update'` fire 时 data 已 re-parse 且 version 仍为该 generation。
  - **为何不直接做 4.3b（同 schema skip re-parse）**：setData = 运行时热路径 + 用户动态换数据核心 API，改错即运行时回归。4.3a 先铺版本号 infra（与 4.1 infra→4.2 消费模式一致），4.3b 单切片在版本号基础上做 skip，需先补① setData 调用链（已勘探：`layer.setData` → `BaseLayer.setData:597` → `this.layerSource.setData:600/604` → `base-source.setData:230`；swipe.ts:387 / examples 经 layer.setData）② initCfg 二次调用副作用 ③ executeParser data-dependent 初始化（tilesetAdapter.init / bounds.update）④ 对照 spec（source.spec 现无 setData 直接覆盖）。
  - **为何不 bump updateClusterData**：cluster 下 `source.data` 随 zoom 变（`updateClusterData` 重算），但这是 originData 的*派生视图*而非数据源变更；bump 会令 version 语义混入 zoom 噪音，掩盖真正的 setData 变更。未来若下游需区分「聚合视图变」可另设 `clusterViewVersion`，不在 4.3a 引入。
- **风险 / 边界**：
  - 纯叠加：无任何消费方读 `dataVersion`（仅 ISource 契约 + Source 字段 + spec），所有现有路径行为字节级不变。
  - ISource 新增 required `dataVersion` —— 验证 `implements ISource` 仅 `Source` 一处（git grep 确认无其他 implementor / Source 无 subclass），契约无破坏；tsc layers 229 baseline 不变。
  - setData 连续调用（`setData(A); setData(B);` before any await）：两次同步 bump → version +2，两次 init() 排队，`'update'` 可能 fire 2 次（既有行为，4.3a 不改）。version 单调性仍成立。
- **基线**：tsc core 0 / tsc source 0（去 glsl 31 噪音）/ tsc layers 229（不变）/ jest source 107（102+5）/ jest layers-plugins 6 / eslint 0。
- **遗留**：4.3b 行为切片（同 schema skip re-parse）BACKLOG 记档；`updateClusterData` 不 bump 的语义选择记档供未来 review。

---

## [阶段 4.4] cluster 双路径合并 — 删 enable 死字段 + cluster transform 标 deprecated（commit 00502f9）

- **改了什么**：
  - `packages/core/src/services/source/ISourceService.ts`：`IClusterOptions` 删 `enable: false;`（literal `false` 死字段，零 set/read —— `ClusterManager` 用独立 `this.enabled` boolean，不读 `options.enable`）。
  - `packages/source/src/cluster-manager.ts`：`options` 默认删 `enable: false,`。
  - `packages/source/src/transform/cluster.ts`：新增 `clusterTransform(data, option)` —— once-guard `console.warn`（deprecation）+ delegate 到 `cluster()`；保留 `cluster()` 工厂不变。
  - `packages/source/src/builtins.ts`：`registerTransform('cluster', cluster)` → `registerTransform('cluster', clusterTransform)`；import 同步更新。`cluster-manager.ts` 仍直 `import { cluster }`（Path A 不经注册表，零 warning）。
  - 新增 `packages/source/__tests__/cluster-deprecation.spec.ts`（3 tests）。
- **方案（minor：删死字段 patch + deprecation warning 新行为）**：
  - **双路径诊断**：`cluster()` 实为 Supercluster 工厂，两条消费路径：
    - **Path A（live 正用）**：`cluster:true` cfg → `ClusterManager.init()` 直调 `cluster()` 建 index 存储。`source.spec.ts` 的 `'source.transform.cluster'` 用此路径（历史命名误导，实际是 cfg.cluster）。
    - **Path B（broken footgun）**：`transforms:[{type:'cluster'}]` → `executeTrans` 调注册的 transform = `cluster()` → 返回 Supercluster 实例 → `Object.assign(this.data, supercluster)` 腐蚀 `source.data`。全仓 grep `transforms:.*cluster` / `{type:'cluster'}` **零使用**（仅 refactor 文档提及），故未爆发。
  - **合并方向（保留 Path A 为唯一入口）**：不删 `cluster` transform 注册（会破坏 `parser-registry.spec` 3 处断言 + PLAN 说"标 deprecated"非"删"），改注册为 `clusterTransform` deprecation wrapper：warn（once-guard）+ delegate 旧行为。`ClusterManager.init` 直调 `cluster()`（不经注册表）故 Path A 零 warning、零行为变化。
  - **`enable` 死字段**：`IClusterOptions.enable` 类型是 literal `false`（设 `true` 本就是 tsc 错），`ClusterManager` 用 `this.enabled` 不读 `options.enable`。删除是纯 patch（零行为变化）。
  - **行为变化（minor）**：Path B 用户（零存在）首次调 `clusterTransform` 得 `console.warn` deprecation。strictly better（broken 路径从静默腐蚀 → 显式 warn + 旧行为兼容）。Changeset minor。
- **怎么验证**：
  - `tsc source 31 / core 0 / layers 229` 基线全不变（`enable` 删除零 tsc 错——`cluster-manager` 用 `this.enabled`，`IClusterOptions` 删字段不影响已注册 transform 签名）。
  - `eslint --max-warnings 0` + `prettier --check`：5 文件 0 错 0 警（`no-console` disable 删除——rule 不活跃；`require` 改直调避免 `no-require-imports`）。
  - `jest packages/source`：**102 passed**（99 baseline + 3 cluster-deprecation）。`parser-registry.spec` 6 transform 断言（含 'cluster'）全绿——`clusterTransform` 仍注册为 function；`source.spec` 的 `'source.transform.cluster'`（Path A）零 warning 零回归。
  - 新 spec 3 case：① `'cluster'` transform 仍注册（getTransform 不抛、typeof function）；② `clusterTransform` 首调 emit warn（once-guard 二次静默）；③ `cluster` 直调无 warn（Path A 零噪音）。
- **风险/注意**：
  - **once-guard 模块级**：`clusterTransformDeprecationWarned` 模块 flag，jest 文件级模块隔离保证测试 fresh。生产环境 Path B（如有）首触发即 warn 一次，避免 render 循环 spam。
  - **`cluster()` 返回类型松**：`cluster()` 无 `pointIndex` 时返 Supercluster（非 `IParserData`），但已注册为 `TransformFn`（`=> IParserData`）—— tsc 宽容（Supercluster 结构兼容或隐式）。4.4 不动此松签名（预存），仅加 wrapper。
  - **不删 transform 注册**：删会使 `transforms:[{type:'cluster'}]` 抛 `TransformNotFoundError`（2.3）——虽 strictly better 但破坏 parser-registry.spec 断言 + 属 major 级 removal。留 4.5（未来 major）。
  - **`enable` 删除无外部影响**：全仓零 `clusterOptions.enable` 消费；interface 字段删除对 `Partial<IClusterOptions>` 消费方零影响（无人设 `enable`）。
- **遗留**：→ 4.5（未来 major）移除 `cluster` transform 注册 + `clusterTransform` wrapper，`transforms:[{type:'cluster'}]` → `TransformNotFoundError`；4.3 setData async + 版本号增量（下一主推进）；4.1b deprecation 收尾。**阶段 4.4 完成 —— cluster 逻辑分裂（PLAN P2 诊断 #6）收敛：死字段清除 + broken Path B 标 deprecated，`cluster:true` cfg 确立为唯一聚合入口。**

---

## [阶段 4.2 后续] BaseLayer.ts:1070 `on('update')` 评估 — 结论保持现状（commit f20b3e6）

- **评估什么**：4.2 迁了 `DataSourcePlugin` 的 init 等待（`source.on('update')` 手写 Promise → `await source.ready`）。本步评估 layers 包**另一处** `'update'` 监听 `BaseLayer.ts:1070`（`setSource` 内：`'inited'`→`processRelativeCoordinates`、`'update'`→`sourceEvent`/tile reload）是否同样迁 `ready`/标准化。
- **结论：保持现状，不迁**。三条理由：
  1. **同步 ordering load-bearing**：`processRelativeCoordinates`（就地转 `data.dataArray` 相对坐标）在 `'inited'` emit 时**同步**跑，严格早于 `DataSourcePlugin` 的 `await source.ready`→`updateClusterData`（`initPromise=init().then(cb)`，cb 内 `emit` 后才 resolve）。改 `ready.then` 会推迟到 ready resolve 后微任务，破坏预-inited 路径（`source(:584)` 外部 `data.type==='source'`）的 `sourceEvent` 同步 fast-path 预期，且对 clustering+相对坐标交互引入时序风险。
  2. **双语义监听不可拆**：`'inited'`（一次性）+ `'update'`（`setData` 反复）共用一 handler；`ready` 一次性无法承接反复 `'update'`，只拆 `'inited'` 会变两套机制、零收益。
  3. **`setSource` 同步**：改 `await` 需异步化级联调用方。
- **新发现（记 BACKLOG）**：`BaseLayer.ts:1002/1056` 的 `off('update', this.sourceEvent)` 是**空操作** —— 1070 挂的是 inline arrow（引用 ≠ `sourceEvent`），off 永不命中，listener 仅靠 source GC 清理。pre-existing refactor 残留，低风险，低优先 cleanup。
- **怎么验证**：纯评估 + 文档，无代码改动 —— 基线（tsc source 31 / layers 229 / jest 105 passed）零接触、零回归。
- **遗留**：4.2 阶段全部结案（4.1 infra + 4.2 迁移 + 4.2 后续评估）。→ 4.4 cluster 双路径合并（下一主推进）；4.3 setData async + 版本号增量；4.1b deprecation（范围需斟酌：`new Source`+`await ready` 是合法模式，可能不弃 `new Source`）；`off('update',sourceEvent)` 空操作 cleanup（BACKLOG）。**async lifecycle 阶段收尾 —— 转入 cluster 路径合并（4.4）。**

---

## [阶段 4.2] DataSourcePlugin 迁移 await source.ready — 修复 premature-resolve bug + init 失败 hang→reject（commit 1ef39aa）

- **改了什么**：
  - `packages/layers/src/plugins/DataSourcePlugin.ts`：init `else` 分支（`source.inited===false` 路径）由旧手写 `await new Promise(resolve => source.on('update', e => { if(e.type==='inited'){...} resolve(null) }))` 改为 `await source.ready; this.updateClusterData(layer); layer.log(SourceInitEnd, INIT)`。`if (source.inited)` fast-path 分支**不动**（外部预存已 inited source 走 sync，零时序变化）。
  - `packages/core/src/services/source/ISourceService.ts`：`ISource` interface 加 `readonly ready: Promise<void>`（4.1 `base-source.ts` 的 `ready` getter 已满足契约，无需再改 source）。
  - 新增 `packages/layers/__tests__/plugins/data-source-plugin.spec.ts`（3 tests）。
- **方案（minor：新增 interface 字段 + strictly-better 行为变化）**：
  - **修复 bug**：旧 `resolve(null)` 在 `if (e.type==='inited')` 块**外** → 首个**任意类型** update 即 resolve Promise。对 fresh `new Source`（首事件即 inited）恰好蒙对；对外部预存未 inited source 先发他类 update（如 'sourceUpdate'）会 **premature resolve + 跳过 updateClusterData**。`await source.ready` 只在 init 真正完成（`initPromise` resolve）时 resume，根除该 bug。
  - **失败路径 hang→reject（minor 行为变化，见 BACKLOG）**：旧路径 source init 失败不 emit 'inited' → Promise 永不 resolve → layer init 静默 hang。`await source.ready` 在 init 失败时 reject（`initPromise` reject）→ tapPromise reject → `BaseLayer await this.hooks.init.promise()` 抛 → `layer.init()` reject。**strictly better**（错误 surface vs 静默 hang），非回归，但属行为变化需显式记档。
  - **时序等价（成功路径）**：`initPromise = init().then(cb)`，cb 内先 `inited=true` 再 `emit('update',{type:'inited'})` 后 resolve。`await source.ready` 恢复时 `inited===true` 必然成立，与旧 `resolve(null)`（同在 inited emit 的微任务链）时序等价 —— updateClusterData + log 仍在 layer init 完成前执行。
  - **fast-path 保留**：`if (source.inited)` 分支零改动，外部预存已 inited source 不 await、sync 调 updateClusterData + log。
  - **`'update' {type:'inited'}` 事件仍 emit**（4.1 不动 base-source 构造器 cb）：`BaseLayer.ts:1070` 另一处 `layerSource.on('update')` 监听仍依赖之，本切片不动该监听（留 4.2 后续评估，见 BACKLOG）。
- **怎么验证**：
  - `tsc --noEmit -p packages/source/tsconfig.json`：31 错基线不变；`tsc layers`：229 pre-existing 不变（`ISource` 加字段不引入新错 —— `Source` 已有 `ready` getter，唯一 ISource 实现者）。
  - `eslint --max-warnings 0` + `prettier --check`：DataSourcePlugin.ts + ISourceService.ts + data-source-plugin.spec.ts 0 错 0 警。
  - `jest packages/layers/__tests__/plugins`：6 passed（3 新 + 3 lighting）；`jest packages/source`：99 passed 0 failed（ISource 加字段未破坏 source）。
  - 新 spec 3 case：① fresh `new Source`（geojson）→ `await source.ready` 后 `inited===true` + `log` 调 2 次（start+end）；② 预存已 inited fake source（`ready: new Promise(()=>{})` 永不 resolve）→ fast-path，initTap 在超时内 resolve（证明未 await neverReady）+ `log` 2 次；③ `parser:{type:'nonexistent'}` → `initTap()` `rejects.toThrow` + `log` 仅 1 次（start，end 未到达）—— 锁 reject surface 契约。
  - **不直接断言 `IDebugLog`/`ILayerStage` 枚举值**：`IDebugLog` 为 `const enum`，`isolatedModules:true` 下运行时表示不稳定，改用 `layer.log` 调用次数判分支（成功 2 / 失败 1）。
- **风险/注意**：
  - **minor 行为变化：init 失败 hang→reject**：旧路径 `layer.init()` 永不 resolve（hang）；新路径 `layer.init()` reject。若上游有 `await layer.init()` 不 catch 的点会从 hang 变 unhandled rejection。**strictly better**（hang 是最坏静默失败），但需 changeset 标 minor + 发布说明提及。已记 BACKLOG。
  - **`DataSourcePlugin` 是 layers 包内唯一 `new Source` 构造点**（grep 确认 `packages/layers/src/plugins/DataSourcePlugin.ts:15`）—— 本切片覆盖 layers 主路径。其他 `'update'` 监听（`BaseLayer.ts:1070`）不构造 source，仅响应事件，留后续。
  - **fast-path 对外部预存 source 的 `updateClusterData` 仍调用**（与旧代码一致）：旧 fast-path 也调，零变化。
- **遗留**：→ 4.2 后续评估 `BaseLayer.ts:1070` `layerSource.on('update')` 是否迁 `ready`/标准化（见 BACKLOG）；4.1b `new Source` deprecation warn（layers 主路径已迁 4.2，可推进）；4.3 `setData` async + 版本号增量；4.4 cluster 双路径合并。**阶段 4.2 完成 —— layers 侧 DataSourcePlugin init 路径迁移到 `await source.ready`，async lifecycle 串联打通（4.1 infra + 4.2 消费），premature-resolve bug 修复 + init 失败错误 surface。**

---

## [阶段 4.1] Source.create async 工厂 + ready getter — 纯叠加消除 source.data race（commit 99e7094）

- **改了什么**：
  - `src/base-source.ts`：① 新增 `private readonly initPromise: Promise<void>` 字段，构造器把原 `this.init().then(() => { this.inited = true; this.emit('update', {type:'inited'}) })` 改为 `this.initPromise = this.init().then(...)`（**仅捕获 Promise 引用，cb 体 + 时序零变化**）。② 新增 `public get ready(): Promise<void>` 返回 `initPromise`。③ 新增 `public static async create(data, cfg?, registry=defaultRegistry): Promise<Source>`：内部 `const source = new Source(data, cfg, registry); await source.initPromise; return source`。
  - **方案（纯叠加，`new Source` 零行为变化）**：`initPromise` 捕获不改 `init()` 时序 —— `new Source` 路径不 await 本字段，init 成功仍 `.then` cb 设 inited+emit、init 失败仍 fire-and-forget unhandled rejection（保留现状吞错）。`Source.create` 通过 `await source.initPromise` 让 init 失败**显式 reject 抛错**（parse/cluster init/transform 错，对比旧路径吞错）+ 保证返回时 `inited===true`（消除同步 `new Source` 时 `inited===false` race —— init 在微任务里才置 true）。`ready` getter 给 `new Source` 用户补 await 能力（additive，旧用户不调用则零影响）。
  - **`console.warn` deprecation 推迟**（4.1b 切片）：PLAN 原 4.1 含「`new Source` 走旧路径并 `console.warn`」，本切片**不加** warn —— 加 warn 会改变所有现有 `new Source` 调用方的控制台输出（minor 级行为变化），违反「纯叠加零行为变化」渐进纪律。待 layers 包迁移到 `Source.create` / `await source.ready` 后，4.1b 再加 warn 推动 `new Source` 退役。
  - **与阶段 2.5 `createSource(data, cfg, registry?)` 互补**：`createSource` 是 sync 函数工厂（`return new Source(...)`，仍 fire-and-forget init）；`Source.create` 是 async 工厂（await init）。两者不冲突、不替代，对应「sync 取数同步已可用」vs「await init 完成 + 错误 surface」两种消费模式。
  - **关键事实（PLAN 诊断 #7 再核）**：`processData` 的 `new Promise(executor)` 执行器**同步**跑，故 `executeParser` 在构造器返回前就同步设了 `this.data` —— 现有 `source.spec.ts` 同步读 `extent`/`data.dataArray` 即依赖此。故 `source.data` 的「undefined race」对 GeoJSON/CSV 等 sync parser **实际不存在**（data 同步已设）；race 主要是 ① `inited` 标志（微任务里才 true）② `'inited'` 事件时序 ③ init 失败吞错。`Source.create` 三者一并收敛。tile/image parser 的 async 取数（loader/tileset/images Promise）不在 init 关键路径，`create` 不 await 之（与 `new Source` 等价）。
  - 新增 `__tests__/create-async.spec.ts`（7 tests）：① happy path（sync `new Source.inited===false` → `await Source.create` `inited===true` + extent 断言）；② 等价性（create vs new+ready 的 extent/dataArray）；③ cluster 端到端（create+await 后 updateClusterData(2)=110）；④ **失败 reject**（`parser:{type:'nonexistent'}` → `rejects.toThrow(ParserNotFoundError)`，锁错误 surface 契约）；⑤ 自定义 registry 端到端（spy getParser('geojson') + cluster re-parse 走 injected registry）；⑥ `ready` getter on new Source（`await source.ready` → inited true）；⑦ **'inited' 事件时序**（同步 attach listener → await ready → 事件必已触发，锁 ready 在 emit 之后 resolve）。
- **怎么验证**：
  - `tsc --noEmit -p packages/source/tsconfig.json`：31 错基线不变（全 core `.glsl` 噪音）—— `initPromise` 字段 `readonly` 构造器赋值满足 definite assignment、`static async create` 访问 instance private `initPromise` 合法（同类 body）、`ready` getter 返回类型 `Promise<void>`。`tsc layers` 229 pre-existing 不变（layers 仍 `new Source`，零接触 create/ready）。
  - `eslint --max-warnings 0` + `prettier --check`：base-source.ts + create-async.spec.ts 0 错 0 警（spec 经 `--write` 重排纯 whitespace）。
  - `jest packages/source/__tests__ + packages/layers/__tests__`：**153 passed / 1 skipped / 0 failed**（旧 146 + 7 create-async）—— 7 case 全过；现有 source.spec.ts（sync `new Source` 读 extent/data/cluster/transform）+ create-source.spec.ts（2.5 sync 工厂）零回归，证明 `new Source` 路径零行为变化。
- **风险/注意**：
  - **⚠️ `new Source` 失败路径仍 unhandled rejection**：`initPromise` 捕获但 `new Source` 路径不 await，parse 失败时仍是 fire-and-forget unhandled rejection（inited 留 false、无 emit）—— **保留现状**（4.1 不动旧路径）。`Source.create` 路径因 `await` 消费 rejection 故不产生 unhandled。若未来想让 `new Source` 也 surface 错误，需在构造器加 `.catch` 或引导用户迁 `create`（4.1b/4.2 范畴）。
  - **`init()` 内冗余 `this.inited = true`**：`init()` 末尾 + 构造器 `.then` cb 都设 `inited=true`（双设）。迁移前既有，4.1 保留不动（改之会动 init 内部时序，违反零行为变化）。记 BACKLOG 清理候选。
  - **`processData` 的 `new Promise` 同步包装**：PLAN 诊断 #7 标「无意义」（包同步代码）。4.1 不动（改之改变微任务时序）。记 BACKLOG 清理候选。
  - **`setData` 的 `init().then` 不动**：`setData` 也有 `this.init().then(cb)`（type:'update'），4.1 只改构造器的。`setData` 仍 fire-and-forget（与现状等价）。`setData` 的 async 化属 4.3（版本号+增量）范畴。
  - **tile/image async 取数不在 create 关键路径**：`await Source.create` 不等瓦片/影像实际加载（那些在 loader/tileset 异步）。`create` 只保证 init（parse+cluster init+transforms）完成。消费方仍需按现有方式听瓦片/影像 update。与 `new Source` 等价，非回归。
- **遗留**：→ 4.1b `console.warn` deprecation on `new Source`（待 layers 迁移后）；4.2 layers 侧 `await source.ready` 消费迁移 + `once('inited')` 标准化（`ready` infra 已在 4.1 落地，剩 layers 改动）；4.3 `setData` async + 版本号增量；4.4 cluster 双路径合并；`init()` inited 双设 + `processData` Promise 同步包装清理记 BACKLOG。**阶段 4.1a（纯叠加切片）完成 —— source 包侧 async lifecycle 基础设施就绪，等 layers 侧迁移（4.2）释放价值。**

---

## [阶段 3.4] CustomDataProvider 统一 — mvt/raster CUSTOM\* 走 loader 接口（commit 9500f6c）

- **改了什么**：
  - 新增 `src/loader/custom-data-provider.ts`（70 行）：`export class CustomDataProvider`。构造器持用户 `getCustomData` 回调（`ITileParserCFG['getCustomData']`）。`fetch(tile: SourceTile): Promise<unknown>` 内含原三处消费点共享的「调用户回调 + Promise 包装」1 行原语 —— `fn({x:tile.x,y:tile.y,z:tile.z}, (err,data) => err ? reject(err) : resolve(data))`。**方案 A（薄 provider，零行为变化）**：provider **只在 `err` 真值时 reject(err)**，`err` falsy 时**无条件 resolve(data)**（即使 data 为 undefined / 空数组 / 空缓冲）。**不在 provider 层做 empty 判定** —— 因三消费点 empty 语义不同（mvt / raster-image 用 `!data`；raster-buffer 用 `data.length===0`，对 ArrayBuffer `.length` 恒 undefined 故不触发，但对空 TypedArray/空数组会 reject），统一 empty 判定会改变 raster-buffer 空 TypedArray 的 reject 行为，违反渐进等价。empty 检查 + 解码后处理仍由各消费点 `.then` 内各自保留。
  - 重写 `src/loader/mvt-loader.ts`（84 → 91 行）：构造器新增 `private readonly customDataProvider?: CustomDataProvider`（仅当 `getCustomData` 提供时构造，与迁移前 `if (getCustomData)` 分支判断同构）。`loadTile` 的 `getCustomData` 分支改走 `this.customDataProvider.fetch(tile).then(data => !data ? resolve(undefined) : resolve(new MVTSource(data as ArrayBuffer, tile.x, tile.y, tile.z))).catch(() => resolve(undefined))`。**保留 resolve `undefined` 契约**：provider reject(err) → catch → resolve undefined（err 值被丢弃，与迁移前 `if (err || !data) resolve(undefined)` 的 err 分支等价）；provider resolve(undefined/空) → `.then` `!data` → resolve undefined；provider resolve(有效 data) → `new MVTSource`。`getArrayBuffer` 分支不变（xhrCancel 保留）。`new MVTSource(data as ArrayBuffer, ...)` 加 cast（provider 返回 `Promise<unknown>`，MVTSource 构造器要 `ArrayBuffer`）。
  - 重写 `src/loader/raster-tile-loader.ts`（76 → 178 行）：构造器新增 `private readonly customDataProvider: CustomDataProvider`（从 `cfg.getCustomData` 构造，`Partial<ITileParserCFG>` 下可 undefined → `as ITileParserCFG['getCustomData']` cast；CUSTOM\* 若用户未提供则 provider.fetch 调 undefined fn 抛 TypeError，与迁移前 `getCustomData(tile, undefined, ...)` 调 undefined fn 抛 TypeError 等价）。CUSTOM\* 4 分支改走 2 私有方法：① `loadCustomImageData(tile)`（CUSTOMIMAGE/CUSTOMTERRAINRGB）：`provider.fetch(tile).then(data => new Promise((resolve,reject) => !data ? reject(undefined) : data instanceof ArrayBuffer ? formatImage(data, cb) : HTMLImageElement ? resolve(data) : reject(undefined)))` reject 透传；② `loadCustomRasterData(tile, format, operation)`（CUSTOMARRAYBUFFER/CUSTOMRGB）：`provider.fetch(tile).then(data => new Promise((resolve,reject) => (data as any).length === 0 ? reject(undefined) : data && processRasterData([{data: data as ArrayBuffer, bands:[0]}], format, operation, cb)))` reject 透传。**机械保留迁移前 empty 语义**：raster-image 用 `!data`、raster-buffer 用 `(data as any).length === 0`（**非** `!data`，空 TypedArray 真值但 length===0 的独有 reject 行为保留，`any` cast 与迁移前 util 的 `data: any` 同）。IMAGE/ARRAYBUFFER/default 分支不变（仍走 `getRasterTile` utils）。import：删 `getCustomData`/`getCustomImageData`（utils 已删），加 `formatImage`（l7-utils）、`processRasterData`（bandOperation/bands）、`CustomDataProvider`、`IBandsOperation`/`IRasterFormat` 类型。
  - **删除** `src/utils/tile/getCustomData.ts`（55 行）：`getCustomData`/`getCustomImageData` 两 free function 被 `CustomDataProvider` + loader 后处理完全取代。`git rm` 后全仓 grep 仅留 loader 注释中的历史引用，无生产/测试 import 残留。
  - 新增 `__tests__/loader/custom-data-provider.spec.ts`（66 行 / 6 tests）：构造 real `CustomDataProvider`（fn 用 jest.fn cast 为 `ITileParserCFG['getCustomData']`）—— ① cb(null, buf) → resolve(buf)；② cb(err, null) → reject(err)；③ **cb(null, undefined) → resolve(undefined)**（provider 不 empty-check，consumer job，锁关键契约）；④ cb(null, []) → resolve([])（空数组真值，provider 透传不 length-check）；⑤ fn 入参用 `{x:1,y:2,z:3}` 从 tile（锁「CUSTOM\* 只用 tile 不用 tileParams」）；⑥ 异步 cb（setTimeout 0）→ 仍正确 settle。
  - 重写 `__tests__/loader/raster-tile-loader.spec.ts`（146 → 258 行 / 6 → 16 tests）：删 `jest.mock('../../src/utils/tile/getCustomData')`；加 `jest.mock('@antv/l7-utils', () => ({ ...jest.requireActual('@antv/l7-utils'), formatImage: jest.fn() }))`（**⚠️ requireActual 展开**：raster spec 经 `RasterTileType` 值导入拉起 `@antv/l7-core/index` → `BasePostProcessingPass` 从 l7-utils 解构 `lodashUtil`/`gl`，整模块只导 formatImage 会令 core 解构 undefined 报错；故保留真实 l7-utils 仅覆盖 formatImage）+ `jest.mock('../../src/utils/bandOperation/bands', () => ({ processRasterData: jest.fn() }))`。`jest.resetAllMocks()`（非 clearAllMocks，见 3.3 流程教训）防 mockImplementation 跨 case 泄露。real `CustomDataProvider` 集成（fn 用 jest.fn cast）。**CUSTOMIMAGE/CUSTOMTERRAINRGB** 6 case：ArrayBuffer→formatImage 解码、HTMLImageElement 直传、formatImage 解码错→reject、!data→reject(undefined)、err→reject 透传、truthy-非 ArrayBuffer/HTMLImageElement→reject(undefined)。**CUSTOMARRAYBUFFER/CUSTOMRGB** 6 case：ArrayBuffer→processRasterData 入参 `[{data,bands:[0]}]`/`defaultFormat`/`operation` 断言（用 `call[0][0].data` ref 判定避 ArrayBuffer 深比较歧义）、CUSTOMRGB 同路径、`cfg.format` 提供切 customFormat 否则 defaultFormat、空数组 `[]`→`data.length===0`→reject(undefined)（**锁非 `!data` 语义**）、err→reject 透传、processRasterData 解码错→reject。IMAGE/ARRAYBUFFER/default 4 case 不变。**关键契约**：`tile={x:1,y:2,z:3}` vs `tileParams={x:10,y:20,z:30}` 差异化取值，锁死「CUSTOM\* 只用 tile、IMAGE/ARRAYBUFFER 双用」第 4 种混用形态。mvt-loader spec **零改动**复跑全过（构造器仍收 getCustomData 第 3 参 → 内部构造 provider → fn 入参断言 `{x:1,y:2,z:3}` 仍成立）。
- **设计取舍**：
  - **方案 A（薄 provider + 各消费点保留后处理/错误语义）vs 方案 B（统一错误语义）**：选 A。方案 B 把 mvt 的「失败 resolve undefined」改成 reject 会破坏 3.1.2 spec 契约 + 行为变化（消费层 `SourceTile.loadData` try/catch 令 reject 与 resolve 空值都走 `onError`，故对消费层等价，但仍是行为变更）。A 保留 mvt resolve undefined / raster reject 的各自语义，仅 DRY「调用户回调 + Promise 包装」原语。
  - **provider 不做 empty 判定（resolve data always on no-err）**：三消费点 empty 语义不同（mvt/image `!data`、buffer `data.length===0`），provider 统一会破坏 raster-buffer 空 TypedArray reject。故 empty 检查 + 解码下沉各消费点 `.then`。provider 只负责 err→reject、no-err→resolve(data)。这把「调用户回调」原语 DRY 成单点，而保留「empty/decode」的差异性（诚实地表达三路径契约不同）。
  - **raster CUSTOM\* 后处理内联 loader（删 utils）vs 保留 utils 包 provider**：选内联 + 删 utils。内联让 loader 自包含「fetch(provider) + decode(formatImage/processRasterData)」，与 PLAN「loader=fetch+decode」定义一致；utils `getCustomData`/`getCustomImageData` 两 free function 被完全取代，删除避免死代码。代价：loader 直接依赖 `bandOperation/bands`（processRasterData）+ l7-utils（formatImage），但二者本就是 decode 职责，loader 持有合理。IMAGE/ARRAYBUFFER 仍走 `getRasterTile` utils（fetch+decode 合在一起），对称性差异留 3.2.2 评估（若拆小 loader 可统一）。
  - **mvt `new MVTSource(data as ArrayBuffer, ...)` cast**：provider 返回 `Promise<unknown>`（data 是用户回调的 `any`，但 Promise 包装后类型收窄到 `unknown`）。MVTSource 构造器要 `ArrayBuffer`，需 cast。迁移前 util 的 `data: any` 隐式兼容，此处显式 cast 等价且类型更诚实。
  - **`cfg.getCustomData` undefined 时仍构造 provider（cast）**：raster-tile-loader 构造期无条件 `new CustomDataProvider(cfg.getCustomData as ...)`。CUSTOM\* 若用户未提供 getCustomData，provider.fetch 调 undefined fn 抛 TypeError「getCustomDataFunc is not a function」—— 与迁移前 `getCustomData(tile, undefined, ...)` util 调 `undefined(...)` 抛同款 TypeError 等价。IMAGE/ARRAYBUFFER 分支不触发 provider（构造无害，provider 不被调用）。避免「按需构造」的分支复杂度，构造期一次性。
  - **reject 值 null vs undefined 微差异（empty-no-err 边缘）**：迁移前 `if (err || data.length===0) reject(err)` —— empty-no-err 时 err 为 falsy（用户传 `cb(null, [])` → err=null，或 `cb(undefined, [])` → err=undefined）。provider 路径下 consumer `.then` 内 reject(undefined) 固定值，故 `cb(null, [])` 时迁移前 reject(null)、新路径 reject(undefined) —— **reject 值差异**。但经核消费链 `SourceTile.loadData`→`onTileError`→`emit(TileError, {error, tile})`，error 值仅 emit 给 layers 订阅者，**无 layer 做 `error===null vs ===undefined` 区分**（结构性行为 TileError 触发 / loadFinished 完全一致）。故此差异**不可观测**，记入 BACKLOG 备查。err-passthrough 路径（err 真值）reject 值**字字等价**（provider reject(err) → consumer catch → reject(err)）。
- **怎么验证**：
  - `tsc --noEmit -p packages/source/tsconfig.json`：source 总 31 错基线不变（全 core `.glsl` 噪音，0 非 glsl）—— `CustomDataProvider` + mvt/raster loader 改造 + 两 spec 零类型回归；`new MVTSource(data as ArrayBuffer, ...)` / `processRasterData([{data: data as ArrayBuffer, ...}])` cast 合法；raster spec 的 `jest.requireActual('@antv/l7-utils')` 展开不引入新 TSError。
  - `tsc --noEmit -p packages/layers/tsconfig.json`：229 pre-existing 不变 —— layers 经 registry 拿到的 `rasterTile` parser default export 签名 + `tilesetOptions` 结构全不变，`RasterTile`/`RasterRGBTile`/`RasterTerrainRGBTile` 读 `sourceTile.data.data.rasterData` / `sourceTile.data.images`（CUSTOMIMAGE 经 formatImage）行为等价。
  - `eslint --max-warnings 0`：5 文件 0 错 0 警（custom-data-provider / mvt-loader / raster-tile-loader / 2 spec）。
  - `prettier --check`：通过（raster loader + raster spec 经 `--write` 重排，纯 whitespace）。
  - `jest packages/source/__tests__`：13 suites / 82 tests 全通过（旧 76 + 6 provider + 10 net raster[16-6]）；新 provider spec 6 case 锁「provider 不 empty-check」契约；新 raster spec 16 case 经 requireActual 展开注入 formatImage 桩 + bands 桩 + real provider，覆盖 CUSTOM\* 4 分支的 ArrayBuffer/HTMLImageElement/!data/length===0/err/decode-err 全路径 + format/defaultFormat 切换。
  - `jest packages/source/__tests__ + packages/layers/__tests__`：146 passed / 1 skipped / 0 failed（旧 130 + 6 provider + 10 net raster）—— 瓦片图层运行时路径覆盖，mvt/raster parser 经 registry 透明委托 loader→provider，CustomRasterSource 运行时行为等价。
- **风险/注意**：
  - **⚠️ provider 不做 empty 判定是零行为变化的关键**：若未来想在 provider 层统一 empty 检查（如「reject on !data」），会破坏 raster-buffer 空 TypedArray（真值 + length===0）的 reject 行为 —— 那 reject 是 CUSTOMARRAYBUFFER/CUSTOMRGB 独有语义。统一 empty 须同时改三消费点并评估跨阶段影响，本阶段不动。
  - **⚠️ raster spec 必须 `jest.requireActual('@antv/l7-utils')` 展开**：`RasterTileType` 值导入拉起 core/index → 解构 `lodashUtil`。若整模块只导 formatImage，core 侧 TypeError。mvt spec 无此坑因 mvt-loader 不值导入 l7-core（仅 type import）。后续任何「既 mock l7-utils 又值导入 l7-core」的 spec 须 requireActual 展开。记入 BACKLOG 流程教训。
  - **reject 值 null vs undefined 微差异（empty-no-err）**：见设计取舍。不可观测（消费链不区分 null/undefined error）。err-passthrough 路径字字等价。
  - **`data.length===0` 对 undefined data 抛 TypeError**：raster-buffer 若用户 `cb(null, undefined)`（无 err 也无 data），`(data as any).length` 抛 TypeError。迁移前 util 同样 `data.length` 抛 TypeError —— **sync cb 路径**（Promise executor 内）两者都 reject(TypeError) 等价；**async cb 路径**迁移前 uncaught 挂起、新路径 `.then` 抛错 reject(TypeError)。async 挂起属既存隐患（用户传 undefined 给 raster-buffer 自定义回调），本阶段不修正，记 BACKLOG。well-formed 输入（data 是 ArrayBuffer/TypedArray/array）100% 等价。
  - **`getCustomData` 在 `ITileParserCFG` 声明为必填（非可选）**：core interface `getCustomData: (...) => void` 无 `?`，但 `Partial<ITileParserCFG>` 令所有字段可选（loader 构造用 `Partial`）。mvt-loader 用 `if (getCustomData)` guard；raster-tile-loader 用 cast 构造（见设计取舍）。两者与迁移前 `cfg?.getCustomData` optional-chain 等价。
  - **provider 无 `tile.xhrCancel`**：用户 `getCustomData` 回调自取数无 xhr 句柄，与 mvt `getArrayBuffer` / raster IMAGE/ARRAYBUFFER 的 `tile.xhrCancel` 不同 —— provider 不设置，与迁移前等价（三处的 getCustomData 路径本就不设 xhrCancel）。
- **遗留**：→ 阶段 3.2.2 `RasterTileLoader` 6 分支拆 4 小 loader（边际收益，CUSTOM\* 已下沉私有方法，拆分主要是 interface 化 + 分文件）；阶段 3 整体收尾完成，下一价值高地是阶段 4 异步生命周期（`Source.create` async 工厂 / `await source.ready`）；reject 值 null-vs-undefined 微差异 + raster-buffer `cb(null,undefined)` async 挂起隐患记 BACKLOG；阶段 2.x `Transform<TIn,TCfg,TOut>` 契约 / 领域错误 `errors.ts` / 消费方按需子集注册（BACKLOG 既有）。**阶段 3.4 完成 —— 阶段 3（Parser 与 Loader 解耦）渐进收尾。**

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

## [阶段 3.2.1] RasterTileLoader 分发器抽取（commit 7649fbf）

- **改了什么**：
  - 新增 `src/loader/raster-tile-loader.ts`（76 行）：`export class RasterTileLoader`。构造器持 `data`（`string | string[] | ITileBand[]`）/ `tileDataType`（已 RGB→ARRAYBUFFER 归并后的 `RasterTileType`）/ `cfg`（`Partial<ITileParserCFG>`）。`loadTile(tileParams, tile)` 内含原 `getTileData` 的 6 分支 switch（机械搬运，**零行为改动**：保留 `// @ts-ignore`、`data as string | string[]` 向下转型、`cfg?.format || defaultFormat`、`cfg?.operation`）。**不实现 `TileLoader` 接口** —— 因 raster 与矢量瓦片本质不同：① 返回影像/缓冲/栅格数据（非 `ITileSource`）；② 失败 **reject**（非 mvt 的 resolve `undefined`）。经核消费层 `SourceTile.loadData`（`@antv/l7-utils`）把 `getData` 包在 try/catch，**reject 与 resolve 空值都走 `onError`**（`if (error || !tileData) → onError`），故 raster 的 reject 在消费层与「resolve 空」等价 —— 但本类机械保留 reject 以零行为变化。**第 4 种 tile/tileParams 混用形态保留**：IMAGE/ARRAYBUFFER 双用 `tileParams`（URL 模板 / `getTileUrl`）+ `tile`（xhrCancel 经 `getImage`/`getRasterFile`→`bindCancel` 在 utils 内部设置）；CUSTOMIMAGE/CUSTOMTERRAINRGB/CUSTOMARRAYBUFFER/CUSTOMRGB 只用 `tile`（`{x,y,z}` 传用户 `getCustomData` 回调），不传 tileParams。
  - 重写 `src/parser/raster-tile.ts`（90 → 70 行，-20 行）：删 `getTileData` switch + 4 个取数 utils import（`getCustomData`/`getCustomImageData`/`defaultFormat`/`getTileBuffer`/`getTileImage` 全下沉 loader）；`import { RasterTileLoader } from '../loader/raster-tile-loader'`；构造 `loader`，`getTileData = (tileParams, tile) => loader.loadTile(tileParams, tile)`。**保留 parser 职责**：① `isUrlError` guard（空数组 / 非字符串非数组抛 `tile server url is error`）；② **RGB→ARRAYBUFFER 归并**（`if (tileDataType === RGB) tileDataType = ARRAYBUFFER`，在构造 loader 前完成，loader 收到的已是归并后值 —— 归并是 config 形状解析，留 parser）；③ `DEFAULT_CONFIG`（含 `warp: true`，与 geojsonvt 不同）；④ `extent = [Inf,Inf,-Inf,-Inf]` 默认 + `coordinates` 经 `extentToCoord` 转 `rasterTileCoord`；⑤ 组装 `IParserData`（`data` / `dataArray:[{_id:1, coordinates}]` / `tilesetOptions` / `isTile:true`）。default export 签名 `rasterTile(data, cfg?): IParserData` 不变，`builtins.ts` 的 `registerParser('rasterTile', rasterTile)` 零影响。
  - 新增 `__tests__/loader/raster-tile-loader.spec.ts`（146 行 / 6 tests）：文件级双模块 mock —— ① `jest.mock('../../src/utils/tile/getRasterTile')`（`getTileImage`/`getTileBuffer`/`defaultFormat` 桩）；② `jest.mock('../../src/utils/tile/getCustomData')`（`getCustomData`/`getCustomImageData` 桩）。**关键测试设计**：`tileParams={x:10,y:20,z:30}` 与 `tile={x:1,y:2,z:3}` 故意取不同值，锁死「IMAGE/ARRAYBUFFER 双用、CUSTOM* 只用 tile」第 4 种混用形态。6 case：① IMAGE → `getTileImage(DATA, tileParams, tile, {})` 透传返回值；② ARRAYBUFFER → `getTileBuffer(DATA, tileParams, tile, {})`；③ CUSTOMIMAGE + CUSTOMTERRAINRGB 同路由到 `getCustomImageData(tile, getCustomDataFunc)`，断言「不传 tileParams」；④ CUSTOMARRAYBUFFER + CUSTOMRGB 同路由到 `getCustomData(tile, getCustomDataFunc, defaultFormat, operation)`；⑤ `cfg.format` 提供时传 `format`，否则传 `defaultFormat`（与 mocked 模块同一 ref）；⑥ 未知 dataType（`TERRAINRGB` 既非 CUSTOM* 也非 ARRAYBUFFER/IMAGE）走 default → `getTileImage` 兜底。
- **设计取舍**：
  - **不共用矢量 `TileLoader` 接口，raster 类独立**：raster 返回影像/缓冲/栅格数据（非 `ITileSource`），失败 reject（非 resolve undefined），与矢量瓦片契约根本不同。强行共用会让接口签名退化为 `Promise<any>` 或引入 `| undefined` 虚假分支。独立类诚实地表达差异 —— 3.2.2 将引入**独立的** `RasterTileLoader` 接口（不与矢量 `TileLoader` 合并），由 4 个小 loader 实现。
  - **`loadTile` 不加返回类型注解（推断）**：switch 4 个分支返回不同 Promise 类型（`getTileImage`/`getTileBuffer` 显式 `Promise<HTMLImageElement|ImageBitmap>`，`getCustomImageData`/`getCustomData` 无注解 → `Promise<unknown>`），强加单一注解会因 `Promise<unknown>` 不可赋 `Promise<HTMLImageElement|ImageBitmap>` 而 TS 报错；不注解则推断与原 parser switch 逐字一致，赋给 `tilesetOptions.getTileData` 零类型回归（baseline 31 / layers 229 不变）。
  - **类（`RasterTileLoader`）vs 函数（`getTileData`）**：选类。与 3.1.x 三矢量 loader 同构（持 `data`/`dataType`/`cfg` 状态 + `loadTile` 方法），parser 构造一次 loader、`getTileData` 委托多次。若用闭包函数（parser 内 `const getTileData = (p,t) => switch...`）与迁移前等价但未推进解耦目标 —— class 形态为 3.2.2 小 loader 拆分留扩展点（构造器可注入子 loader）。
  - **取数 utils 暂留 `utils/tile/`，不迁 loader 目录**：3.2.1 只搬 switch 进 loader，`getRasterTile.ts`/`getCustomData.ts` 保持原位。它们已是模块化函数，3.2.2 拆小 loader 时仅包一层（`loadTile() => getTileImage(...)`），不必迁移 utils。搬 utils 到 loader 目录属过度重构，YAGNI。
  - **RGB→ARRAYBUFFER 归并留 parser 不下沉 loader**：归并是「根据 cfg 决定走哪条取数路径」的 config 解析，与 mvt parser 解析 `url = data[0]` 同一职责层级。loader 收到归并后的 `dataType=ARRAYBUFFER`，不感知 RGB 概念 —— loader 类型表面对外更窄。
- **怎么验证**：
  - `tsc --noEmit -p packages/source/tsconfig.json`：source 总 31 错基线不变（全 core `.glsl` 噪音，0 非 glsl）—— `RasterTileLoader` 类 + `raster-tile.ts` 委托对类型检查零回归；`loadTile` 推断返回类型赋 `tilesetOptions.getTileData` 合法。
  - `tsc --noEmit -p packages/layers/tsconfig.json`：229 pre-existing 不变 —— layers 经 registry 拿到的 `rasterTile` parser default export 签名 + `tilesetOptions` 结构（含 `DEFAULT_CONFIG` + `data`/`dataArray`/`isTile` + `rasterDataTypes` 导出）全不变，零回归。
  - `eslint --max-warnings 0`：3 文件 0 错 0 警（raster-tile-loader / raster-tile parser / raster-tile-loader.spec）。
  - `prettier --check`：通过（spec 经 `prettier --write` 重排，纯 whitespace）。
  - `jest packages/source/__tests__`：11 suites / 69 tests 全通过（旧 63 + 新 6 `RasterTileLoader`）；新 loader spec 经双模块 mock 注入桩，断言 6 分支分发路由 + `format`/`defaultFormat` 切换 + default 兜底 + 返回值透传。
  - `jest packages/source/__tests__ + packages/layers/__tests__`：123 passed / 1 skipped / 0 failed（旧 117 + 新 6）—— 瓦片图层运行时路径覆盖，rasterTile parser 经 registry 透明委托 RasterTileLoader，`RasterTile`/`RasterRGBTile`/`RasterTerrainRGBTile` 读 `sourceTile.data.data.rasterData` 行为等价。
- **风险/注意**：
  - **⚠️ raster 是「tile/tileParams 混用」第四种形态**：IMAGE/ARRAYBUFFER 双用 tileParams+tile、CUSTOM* 只用 tile。与 mvt（URL 用 tileParams/其余用 tile）、jsonTile（全用 tile.xyz）、geojsonvt（索引查表用 tile/投影用 tileParams/Source 构造用 tile）又不同。**绝不可统一**。spec 的 `tileParams vs tile` 差异化取值是锁死此契约的关键。3.2.2 拆小 loader 时各小 loader 须显式声明其参数需求（IMAGE/ARRAYBUFFER 两个参数、CUSTOM* 仅 tile）。
  - **raster 失败 reject vs 矢量 resolve undefined**：消费层 `SourceTile.loadData` 的 try/catch 令两者等价（都 → `onError`），但本类机械保留 reject 以零行为变化。若未来统一瓦片生命周期想在 loader 层标准化错误语义（全 resolve 空值 或 全 reject），需同时改 mvt（3.1.2 的 resolve undefined）与 raster —— 跨阶段评估，本阶段不动。
  - **`RasterTileType.TERRAINRGB`（非 custom）走 default 兜底**：enum 有 `TERRAINRGB` 但 switch 无 case，落 default → `getTileImage`。这是既有行为，loader 机械保留。spec case ⑥ 覆盖此兜底（用 TERRAINRGB 作「未知 dataType」样本）。若用户传 `dataType: 'terrainRGB'`（非 CUSTOMTERRAINRGB），实际走 IMAGE 取数 —— 既有行为，不在 3.2.1 修正范围。
  - **`rasterDataTypes` 导出保留 parser**：`export const rasterDataTypes = [ARRAYBUFFER, RGB]` 是 parser 模块级导出，layers 可能消费（类型枚举常量数组）。保留在 parser 不下沉 loader（它不是取数逻辑，是公开 API 导出）。
  - **取数 utils mock 的局限**：spec 不覆盖 `getRasterFile`/`processRasterData`/`formatImage` 真实解码（mock 在 `getRasterTile`/`getCustomData` 模块层截断），那部分由 utils 自身 + layers 集成测试兜底。loader spec 只保证「按 dataType 路由到正确取数 utils + 入参正确」。若未来补取数 utils 单测，应在 `utils/tile/__tests__/` 独立建立。
- **遗留**：→ 阶段 3.2.2 `RasterTileLoader` 6 分支拆成 4 小 loader + 引入 `RasterTileLoader` 接口（评估收益边际，可合并 3.2 收尾或推迟）；阶段 3.3 `image.ts` parser 去 fetch（更高价值 —— image.ts 仍自取数，未抽 loader）；阶段 2.x `Transform<TIn,TCfg,TOut>` 契约抽取 / 领域错误抽 `errors.ts` / 消费方按需子集注册文档化（BACKLOG 既有）；BACKLOG 瓦片 parser/loader 单测覆盖缺口剩 image 待补。**阶段 3.2 渐进第一步完成**。

## [阶段 3.3] ImageLoader 抽取 — image.ts parser 去 fetch（commit 20afaf9）

- **改了什么**：
  - 新增 `src/loader/image-loader.ts`（86 行）：`export class ImageLoader`。构造器持 `data`（`string | string[] | HTMLImageElement | ImageBitmap`）/ `requestParameters`（`Omit<RequestParameters,'url'>`）。`load(): Promise<Array<HTMLImageElement | ImageBitmap>>` 内含原 `image()` top-level 的 `images = new Promise(...)` 体（机械搬运）：① `HTMLImageElement | isImageBitmap(data)` → `resolve([data])` 同步短路（不走 getImage）；② 否则 `fetchUrls(data, rp, resolve)` —— 私有方法搬自原 `loadData`（string 走单次 `getImage`、string[] 走 `forEach`+计数 `imageindex`/`imageCount`）。**变量名原样保留**（`imageDatas` / `imageindex` 原拼写非 imageIndex / `imageCount`）。**死代码 `return image;` 丢弃**（原 `loadData` 末尾引用模块级 hoisted 默认导出函数名，调用方 `loadData(data, rp, resolve)` 不取返回值 → 死代码；迁入类方法后该引用消失，机械丢弃零行为变化）。
  - 重写 `src/parser/image.ts`（55 → 35 行，-20 行）：删 `getImage` / `isImageBitmap` import + `loadData` 函数；`import { ImageLoader } from '../loader/image-loader'`；`const images = new ImageLoader(data, requestParameters).load()`。**parser 源码不再 import `getImage`** —— 满足 PLAN 3.3「image.ts parser 不再自己 getImage() fetch」字面目标。`images` Promise 字段形状**不变**（`Promise<Array<HTMLImageElement|ImageBitmap>>` 赋给 `IParserData.images`），4 处消费方零改动。parser 只剩「extent 默认 `[121.168,...]` / coordinates → imageCoord / 组装 IParserData({originData, images, _id, dataArray})」。default export 签名 `image(data, cfg): IParserData` 不变，`builtins.ts` 的 `registerParser('image', image)` 零影响。
  - 新增 `__tests__/loader/image-loader.spec.ts`（117 行 / 7 tests）：文件级 `jest.mock('@antv/l7-utils')`（`getImage`/`isImageBitmap`）。**坑修复**：① `jest.resetAllMocks()`（非 `clearAllMocks`）—— 清 `mockReturnValue` 避免跨 case 泄露（case 2 `isImageBitmap.mockReturnValue(true)` 泄露到 case 3 让 string 输入误走 isImageBitmap 分支跳过 getImage，初版 5/7 失败）；② 刷微任务用 `setTimeout(0)`（jsdom 无 `setImmediate`，初版 `ReferenceError: setImmediate is not defined`）；③ **TS2352 强转**（post-commit 修复 commit a367265）—— `isImageBitmap` 在 `@antv/l7-utils` 声明为 type guard `(image: any) => image is ImageBitmap`，直接 `(isImageBitmap as jest.Mock)` 报 TS2352（与 geojsonvt spec 的 `geojsonvt as unknown as jest.Mock` 同一坑 —— type guard / namespace 合并类型与 `jest.Mock` 不重叠，需 `as unknown as jest.Mock` 两步转换）。**漏检根因**：写 spec 后未重跑 `tsc source`（仅跑 loader/parser 后的 31 基线），spec 的 TS 错误在 commit 后才由 post-commit tsc 暴露 —— **流程教训：每次写新 spec 后必须重跑 tsc，不能只依赖 loader/parser 抽取时的基线**（3.1.x 之所以未踩此坑因 mvt/jsonTile/geojsonvt 的 mock 对象非 type guard，直 cast 合法）。7 case：① HTMLImageElement 直传 → resolve [data]，不调 getImage/isImageBitmap（锁短路顺序）；② ImageBitmap 直传（isImageBitmap=true）；③ 单 string url 成功 + requestParameters 透传；④ **单 string url 失败 → Promise 永不 resolve**（既存 latent bug 锁定，flag + 刷微任务断言 resolved=false）；⑤ 多 string[] 全部成功；⑥ 多 string[] 部分失败 → resolve 只含成功 img（计数到 imageCount 即 done）；⑦ 多 url 全失败 → resolve []（与单 url 失败「永不 resolve」不对称 —— 既存行为保留）。
- **设计取舍**：
  - **ImageLoader 抽取（零行为变化）vs imageRef 激进变体（parser 返 url、layer 自取数）**：选 ImageLoader 抽取。激进变体需改 4 处消费方（`ImageModel.loadTexture` / `ocean.initImage` / `earth.base` / `rasterTerrainRgb`）从 `await source.data.images` 改为自取数，且破坏 `IParserData.images` 公开契约 —— 违反渐进等价原则。ImageLoader 抽取满足 PLAN「parser 不自己 fetch」字面目标（parser 源码 0 `getImage` import）且零消费方改动。激进变体推迟 BACKLOG。
  - **`images` Promise 在 parser 构造期启动 fetch vs 懒执行**：构造期启动（`new ImageLoader(...).load()` 立即返回 Promise，fetch 在 Promise 内异步进行）—— 与迁移前等价（原 `image()` 函数体内构造 Promise 即触发 fetch 调度）。若改懒执行（`images: () => loader.load()`）会破坏 `IParserData.images` 形状 + 4 消费方，YAGNI。
  - **`loadData` 死代码 `return image;` 丢弃而非保留**：该 return 引用模块级 hoisted `image` 默认导出函数名（TDZ-free hoisting），调用方 `loadData(data, rp, resolve)` 不取返回值 → 死代码。迁入类方法 `fetchUrls` 后 `image` 在作用域消失，强行保留需显式 import parser default export（循环依赖）—— 不可行。机械丢弃零行为变化（返回值从未被读）。spec 不需覆盖（无可观察行为）。
  - **类 vs 函数**：选类，与 3.1.x / 3.2.1 三 loader 同构（持 `data`/`requestParameters` 状态 + `load` 方法）。
  - **失败语义不对称机械保留**：string url 失败 → done 永不调用 → Promise 永挂（消费方 `await` 永卡）；string[] 全失败 → resolve []。这是既存 latent bug，spec case ④/⑦ 锁死「不对称」契约。本阶段不修正（修正需改 fetchUrls 的 string 分支在 err 时也调 done —— 行为变更，违反渐进原则），记 BACKLOG。
- **怎么验证**：
  - `tsc --noEmit -p packages/source/tsconfig.json`：source 总 31 错基线不变（全 core `.glsl` 噪音，0 非 glsl）—— `ImageLoader` 类 + `image.ts` 委托零类型回归；`load()` 返回 `Promise<Array<HTMLImageElement|ImageBitmap>>` 赋 `IParserData.images`（index-signature `[key:string]: any`）合法。
  - `tsc --noEmit -p packages/layers/tsconfig.json`：229 pre-existing 不变 —— layers 经 registry 拿到的 `image` parser default export 签名 + `IParserData.images` Promise 字段不变，4 消费方 `await source.data.images` 零回归。
  - `eslint --max-warnings 0`：3 文件 0 错 0 警（image-loader / image parser / image-loader.spec）。
  - `prettier --check`：通过（spec 经 `prettier --write` 重排）。
  - `jest packages/source/__tests__`：12 suites / 76 tests 全通过（旧 69 + 新 7 `ImageLoader`）；新 loader spec 经 `jest.mock('@antv/l7-utils')` 注入桩，覆盖 HTMLImageElement/ImageBitmap/string/string[] 四类入参 + 成功/失败/部分失败/全失败四类取数结果 + 「永不 resolve」latent bug 锁定 + requestParameters 透传 + 短路顺序。
  - `jest packages/source/__tests__ + packages/layers/__tests__`：130 passed / 1 skipped / 0 failed（旧 123 + 新 7）—— 影像图层运行时路径覆盖，image parser 经 registry 透明委托 ImageLoader，`ImageModel.loadTexture` 的 `await source.data.images` 行为等价。
- **风险/注意**：
  - **⚠️ 既存失败语义不对称（latent bug 保留）**：单 string url `getImage` 失败 → Promise 永挂（消费方 `await source.data.images` 永卡，图层卡在 initModels）。string[] 全失败 → resolve []。本阶段机械保留，spec case ④/⑦ 锁契约。**修正属行为变更**（需在 fetchUrls string 分支 err 时调 `done([])` 或 reject），应单独立项（BACKLOG）不在渐进重构内。若未来修正，需同步更新 image-loader spec case ④ 预期。
  - **`jest.resetAllMocks()` vs `clearAllMocks()`**：本 spec 必须 `resetAllMocks`（清 mockReturnValue/mockImplementation）。`clearAllMocks` 仅清 mock.calls，跨 case 的 `isImageBitmap.mockReturnValue(true)` 会泄露让 string 输入误走 isImageBitmap 短路分支。后续 loader spec 凡涉及「某 case 设 mockReturnValue 影响后续 case 判定分支」的，应用 resetAllMocks。mvt-loader spec 用 clearAllMocks 因 `mockMVTSource()` 每 case 重新 mockImplementation 覆盖，无此坑 —— 但 resetAllMocks 是更安全的默认。
  - **`ImageLoader.load()` 构造期即启动 fetch 调度**：parser 调 `new ImageLoader(data, rp).load()` 时，`load()` 立即构造 Promise 并在 fetchUrls 内同步调用 `getImage`（getImage 异步返回）。与迁移前 `image()` 函数内构造 Promise 等价。若消费方在 parser 返回后、`await images` 前销毁 source，fetch 仍在途 —— 与迁移前同（非本阶段引入）。
  - **4 消费方零改动验证**：`ImageModel.loadTexture`（`image/models/image.ts:50`）/ `ocean.initImage`（`polygon/models/ocean.ts:132`）/ `earth.base`（`earth/models/base.ts:80`）/ `rasterTerrainRgb`（`raster/models/rasterTerrainRgb.ts:62`）全用 `source.data.images` / `.then(...)`，形状不变 → 零回归。layers tsc 229 基线 + 集成测试 130 passed 兜底。
  - **`HTMLImageElement` 短路顺序**：`data instanceof HTMLImageElement || isImageBitmap(data)` —— HTMLImageElement 先判（instanceof 无副作用），命中则 isImageBitmap 不评估。spec case ① 锁死此短路（断言 isImageBitmap 未被调用）。若未来调换顺序，isImageBitmap 对 HTMLImageElement 的返回值会改变行为（ImageBitmap 检查不该误判 Image）。
- **遗留**：→ 阶段 3.2.2 `RasterTileLoader` 6 分支拆 4 小 loader（边际收益，可跳过直奔 3.4）；阶段 3.4 `CustomDataProvider`（`getCustomData`/`getCustomImageData` 跨 mvt/raster 统一到 loader 接口，价值更高）；`image.ts` 激进 imageRef 变体（parser 返 url、layer 自取数）推迟 BACKLOG；image 单 url 失败「永不 resolve」latent bug 修正推迟 BACKLOG；阶段 2.x `Transform<TIn,TCfg,TOut>` 契约抽取 / 领域错误抽 `errors.ts` / 消费方按需子集注册文档化（BACKLOG 既有）。**阶段 3.3 完成**。

## [阶段 3.1.3] GeoJSONVTLoader 抽取（commit 335476d）

- **改了什么**：
  - 新增 `src/loader/geojsonvt-loader.ts`（199 行）：`export class GeoJSONVTLoader implements TileLoader`。构造器持 `data: FeatureCollection` + `options: geojsonvt.Options`，**构造期一次性建索引** `this.tileIndex = geojsonvt(data, options)` + `this.extent = options.extent || 4096`。`loadTile(tileParams, tile): Promise<ITileSource>` 内含原 `getVectorTile` 闭包体（机械搬运，零行为改动）。**4 个投影助手随闭包下沉**：`VectorTileFeatureTypes` / `signedArea` / `classifyRings` / `GetGeoJSON`（仅服务 `loadTile`，parser 不再需要）。**关键等价点全部保留**：① `tileIndex.getTile(tile.z, tile.x, tile.y)` —— **用 `tile`**（SourceTile）做索引查表；② `GetGeoJSON(this.extent, tileParams.x, tileParams.y, tileParams.z, ...)` —— **用 `tileParams`**（TileLoadParams）做坐标投影（`x0 = extent * tileParams.x` 等 Web Mercator 反投影）；③ `new GeoJSONVTTileSource(vectorTile, tile.x, tile.y, tile.z)` —— **用 `tile`** 做数据源构造；④ `getTile` 返回 null 时 `features = []`（空 defaultLayer），**始终 resolve `ITileSource`**（非 undefined —— 与 mvt 失败 resolve undefined 不同，与 jsonTile 同形态）；⑤ **无 `tile.xhrCancel`**（全同步内存切瓦片，无 xhr 句柄）；⑥ 保留 `// @ts-ignore`（`GetGeoJSON` 产出的 feature 含 `relativeOrigin`/`coord` 额外字段，与 `MapboxVectorTile.layers[k].features: GeoJSON.Feature[]` 不完全匹配 —— 原实现即有此 ts-ignore，机械保留）。
  - 重写 `src/parser/geojsonvt.ts`（216 → 75 行，**-141 行**，阶段 3.1 瘦身最显著的 parser）：删 `getVectorTile` 闭包 + 4 个投影助手 + 6 个相关 import（`geojsonvt` value import → `import type`、`GeoJSONVTTileSource` / `SourceTile` 运行时用 / `TileLoadParams` / `MapboxVectorTile` 悉数下沉到 loader，parser 只留 `SourceTile`/`TileLoadParams` 类型 import 作 `getTileData` 形参 + `geojsonvt.Options` 类型作 `getOption` 返回类型 + `FeatureCollection`/`Geometries`/`Properties` 作 default export 签名 + `IGeojsonvtOptions`/`ITileParserCFG` 作 cfg 类型）；`import { GeoJSONVTLoader } from '../loader/geojsonvt-loader'`；构造 `loader`，`getTileData = (tileParams, tile) => loader.loadTile(tileParams, tile)`。**保留 `getOption`**（默认 options 合并，属「parser config 形状组装」，与 mvt parser 解析 `url = data[0]` 同一职责层级）。**保留 `DEFAULT_CONFIG` 不含 `warp`**（geojsonvt 原本就没有，与 mvt 的 `{..., warp: true}` 不同 —— 机械保留，不统一）。default export 签名 `geojsonVTTile(data, cfg): IParserData` 不变，`builtins.ts` 的 `registerParser('geojsonvt', geojsonVTTile)` 零影响。
  - 新增 `__tests__/loader/geojsonvt-loader.spec.ts`（132 行 / 6 tests）：双层 mock —— ① `jest.mock('geojson-vt')`（default export 桩，返回 `{ getTile: jest.fn() }` fake tileIndex）；② `jest.mock('../../src/tile-source/geojsonvt')`（`GeoJSONVTTileSource` 构造器桩，捕获 4 个入参 `(vectorTile, x, y, z)`，返回 `{ getTileData: jest.fn() }`）。**`GetGeoJSON` 投影真实运行**（不 mock），用 LineString feature `{type:2, geometry:[[[0,0]]], tags:{id:1}, id:1}` 喂 fake `getTile` 返回，断言投影后 `coordinates[0][0] ≈ -67.5`（`tileParams.x=10` 投影值）—— **若误用 `tile.x=1` 则 lng = -135，明显可区分**，精确锁死「投影用 tileParams」契约。6 case：① 构造期 `geojsonvt(data, options)` 建索引一次（断言 called once with (data, options)）；② `loadTile` 调 `tileIndex.getTile(tile.z, tile.x, tile.y) = (3,1,2)` 用 tile + `GeoJSONVTTileSource(vectorTile, 1, 2, 3)` 用 tile（锁死「索引查表 + Source 构造用 tile」）；③ `getTile` 返回 null → features=[] 仍 resolve ITileSource（非 undefined，GeoJSONVTTileSource 仍构造）；④ 不设 `tile.xhrCancel`；⑤ 投影用 tileParams（断言 lng ≈ -67.5、lat ≈ -40.9798）；⑥ `options.extent` 入参生效（extent=8192 走独立投影路径，lng 因 extent 同时缩放分子分母仍 -67.5，但证明 extent 入参被 loader 读取使用）。**TS 修复**：`(geojsonvt as jest.Mock)` 因 `geojson-vt` 的 `export =` 合并「函数 + namespace」类型不重叠报 TS2352，改用 `const geojsonvtMock = geojsonvt as unknown as jest.Mock` 别名经 `unknown` 两步转换（TS 推荐），6 处调用全统一用别名。
- **设计取舍**：
  - **构造型（Options Binary `new GeoJSONVTLoader(data, options)` 建索引）vs 注入型（parser 建好 tileIndex 传入 loader）**：选构造型。`geojsonvt(data, options)` 建空间索引是「一次性 decode」工作，属 loader 职责（loader = 数据获取/decode），不应留在 parser。构造期建索引执行时机与迁移前等价（原本 parser 调用 `geojsonVTTile(data, cfg)` 时建索引，现 parser 构造 loader 时 loader 内部建索引 —— 同一调用栈、同一时机）。parser 只剩「config 形状组装（getOption）+ 委托 loader」纯调度。
  - **`getOption` 留 parser vs 下沉 loader**：留 parser。`getOption` 合并 `ITileParserCFG.geojsonvtOptions` 与默认选项，是「parser config 形状解析」（类比 mvt parser 解析 `url = data[0]`），与 loader 的「decode」职责分离。loader 接收已合并的 `geojsonvt.Options`，不感知 `ITileParserCFG` 结构 → loader 类型表面对外只暴露 `geojsonvt.Options`（标准第三方类型），不依赖 `IGeojsonvtOptions`（core 的 parser-cfg 类型）。
  - **投影助手下沉 loader（共 ~120 行）vs 留公共 utils**：下沉 loader。`signedArea`/`classifyRings`/`GetGeoJSON`/`VectorTileFeatureTypes` 仅服务 geojsonvt 的 `getVectorTile`，无其他消费者（grep 确认），下沉到 `loader/geojsonvt-loader.ts` 作模块私有助手最内聚。若未来 mvt/rasterTile 也需要 Web Mercator 反投影可再抽 `utils/`，但当前 YAGNI。
  - **`tile` 与 `tileParams` 混用形态原样保留**：见 loader JSDoc。原本看起来「奇怪」（索引查表用 tile、投影用 tileParams、Source 构造又用 tile），但渐进式重构原则是**零行为变化**，不「修正」此差异 —— `tileParams` 与 `tile` 在 TilesetManager 运行时可能含 zoom-offset 等调整（见 `tile.ts:154` 的 `warpX/warpY/z` 构造 params），投影用 tileParams 是既有行为。spec 用 `tileParams={x:10,y:20,z:5}` vs `tile={x:1,y:2,z:3}` 精确锁死。
  - **保留 `// @ts-ignore` 而非改 `as any`**：原实现即 `// @ts-ignore`（`GetGeoJSON` 产出的 feature 含 `relativeOrigin`/`coord` 额外字段，与 `MapboxVectorTile.layers[k].features: GeoJSON.Feature[]` 不完全匹配）。机械保留 `// @ts-ignore` 注释（迁移前 eslint 已通过，ts-ignore 在本仓库是允许的），避免行为/类型噪音。注释里补了「为何 ignore」说明（原本无注释，属改进）。
- **怎么验证**：
  - `tsc --noEmit -p packages/source/tsconfig.json`：source 总 31 错基线不变（全 core `.glsl` 噪音，0 非 glsl 错）—— `GeoJSONVTLoader implements TileLoader` + `geojsonvt.ts` 委托 loader + 投影助手下沉对类型检查零回归；spec 的 `(geojsonvt as unknown as jest.Mock)` 两步转换解决 TS2352。
  - `tsc --noEmit -p packages/layers/tsconfig.json`：229 pre-existing 不变 —— layers 经 registry 拿到的 `geojsonvt` parser default export 签名 + `tilesetOptions` 结构（含 `DEFAULT_CONFIG` 无 warp + `data`/`dataArray`/`isTile`）全不变，零回归。
  - `eslint --max-warnings 0`：3 文件 0 错 0 警（geojsonvt-loader / geojsonvt parser / geojsonvt-loader.spec）。初版有 1 警（`// eslint-disable-next-line no-new` 在 `no-new` 规则未启用时是 unused directive），删 disable 注释后清。
  - `prettier --check`：通过（3 文件经 `prettier --write` 重排，纯 whitespace）。
  - `jest packages/source/__tests__`：10 suites / 63 tests 全通过（旧 57 + 新 6 `GeoJSONVTLoader`）；新 loader spec 经双层 `jest.mock` + 真实 `GetGeoJSON` 投影运行，断言 `tileIndex.getTile` / `GeoJSONVTTileSource` 调用入参 + 投影坐标 lng≈-67.5（锁 tileParams）+ 空瓦片 / 无 xhrCancel / extent 入参。
  - `jest packages/source/__tests__ + packages/layers/__tests__`：117 passed / 1 skipped / 0 failed —— 瓦片图层运行时路径覆盖，geojsonvt parser 经 registry 透明委托 GeoJSONVTLoader，`tile/core/BaseLayer.ts` 读 `source.tileset` 实例行为等价。
- **风险/注意**：
  - **⚠️ geojsonvt 是「tile / tileParams 混用」的第三种形态**，与 mvt（URL 用 tileParams / 其余用 tile）、jsonTile（全用 tile.xyz）都不同。**绝不可「统一」成单一参数源**。后续 3.2 RasterTileLoader / 3.3 ImageLoader 抽取时需各自厘清 `tile`/`tileParams` 使用契约，不能假设三种瓦片 loader 同构。spec 的 `tileParams vs tile` 差异化取值是锁死此契约的关键，任何「简化」spec 成相同值的改动都会让此差异失去测试覆盖。
  - **构造期 `geojsonvt(data, options)` 建索引可能抛**：若 `data` 不是合法 GeoJSON，`geojson-vt` 在建索引时即抛（与迁移前等价 —— 原本 `geojsonVTTile` 调用时建索引，现 loader 构造时建索引，同一调用栈同抛错时机）。loader 构造器不做 try/catch，让错误原样上抛至 `registParser('geojsonvt', geojsonVTTile)` 调用方（即 `Source` 的 `executeParser`），与迁移前错误处理路径一致。
  - **`GetGeoJSON` 投影真实运行的测试局限**：spec 用极简 LineString feature 验证投影用 tileParams，但不覆盖 Polygon (type 3) 的 `classifyRings` 路径 / Multi* 几何类型分支 —— 那部分由 layers 集成测试兜底。loader spec 只保证「投影坐标源 = tileParams」这一核心契约。
  - **`geojsonvt.Options & IGeojsonvtOptions` cast 留在 parser**：`IGeojsonvtOptions`（core）所有字段必填、`geojsonvt.Options`（@types）所有字段可选，两者交集是「全部必填」。`getOption` 返回的合并对象满足此交集，cast 是迁移前既有，机械保留。loader 只接受 `geojsonvt.Options`（更宽松），不依赖 `IGeojsonvtOptions`，保持 loader 类型表面对外最小。
  - **阶段 3.1 收尾，三个矢量瓦片 loader 全覆盖**：MVTLoader（3.1.2）/ JsonTileLoader（3.1.1）/ GeoJSONVTLoader（3.1.3）三种瓦片 loader 各 6 case 单测，瓦片矢量路径测试网建立完毕。剩余 raster-tile / image 待补（BACKLOG 既有）。
- **遗留**：→ 阶段 3.2 `RasterTileLoader` 大 switch 拆分（6 分支：IMAGE / ARRAYBUFFER / CUSTOMIMAGE / CUSTOMARRAYBUFFER / CUSTOMRGB / CUSTOMTERRAINRGB，建议「先抽分发器、再拆 6 小 loader」两步渐进）；阶段 3.3 `image.ts` parser 去 fetch；阶段 2.x `Transform<TIn,TCfg,TOut>` 契约抽取 / 领域错误抽 `errors.ts` / 消费方按需子集注册文档化（BACKLOG 既有）；BACKLOG 瓦片 parser/loader 单测覆盖缺口剩 raster-tile / image 待补。**阶段 3.1 (Parser 与 Loader 解耦 — 瓦片矢量部分) 全部完成**。

## [阶段 3.1.2] MVTLoader 抽取（commit 0ec0c65）

- **改了什么**：
  - 新增 `src/loader/mvt-loader.ts`（72 行）：`export class MVTLoader implements TileLoader`。构造器持 `url`（单 url，多服务取 `data[0]` 仍在 parser 解析）/ `requestParameters?` / `getCustomData?`；`loadTile(tileParams, tile): Promise<ITileSource | undefined>` 内含原 `getVectorTile` 函数体（机械搬运，零行为改动）。**关键等价点全部保留**：① URL 模板用 `tileParams`（`TileLoadParams`）插值 —— `getURLFromTemplate(this.url, tileParams)`，与 jsonTile 用 `tile.x/y/z` 不同；② `getCustomData` 分支入参用 `tile.x/y/z`（`{x: tile.x, y: tile.y, z: tile.z}`）；③ `MVTSource` 构造用 `tile.x/y/z`（`new MVTSource(data, tile.x, tile.y, tile.z)`）；④ 失败（err/无数据）统一 `resolve(undefined)`（非空 tile），err 永不 reject；⑤ **取消语义**：仅 `getArrayBuffer` 分支在 `loadTile` 内同步设 `tile.xhrCancel = () => xhr.cancel()`（赋值发生在 `getArrayBuffer` 返回后、回调触发前的同步窗口，故任何 fetch 错误到达前 xhrCancel 已就位）；`getCustomData` 分支无 xhr 句柄，保持等价 —— 不设 `xhrCancel`。
  - 重写 `src/parser/mvt.ts`（73 → 53 行，-20 行）：删 `getVectorTile` 闭包 + 6 个相关 import（`getArrayBuffer` / `getURLFromTemplate` / `MVTSource` / `RequestParameters` / `SourceTile` / `TileLoadParams` 悉数下沉到 loader，parser 只留 `SourceTile` / `TileLoadParams` / `TilesetManagerOptions` 类型 import 作 `getTileData` 形参 + `DEFAULT_CONFIG` 类型）；`import { MVTLoader } from '../loader/mvt-loader'`；构造 `loader`，`getTileData = (tileParams, tile) => loader.loadTile(tileParams, tile)`。**保留 `DEFAULT_CONFIG`**（mvt 原有，与 jsonTile 不同 —— jsonTile 原本无 DEFAULT_CONFIG，3.1.1 可直接 `{...cfg, getTileData}`；mvt 必须保留 `{...DEFAULT_CONFIG, ...cfg, getTileData}` 以维持等价）。**顺带删除死导出 `export type MapboxVectorTile`**（包内/跨包均无 import，BACKLOG 既有项 —— 该清理让 parser/mvt 从 73 行里去掉 ~10 行类型定义 + 2 个随之失效的 type import `VectorTileLayer` / `Feature`）。default export 签名 `mapboxVectorTile(data, cfg?): IParserData` 不变，`builtins.ts` 的 `registerParser('mvt', mapboxVectorTile)` 零影响。
  - 新增 `__tests__/loader/mvt-loader.spec.ts`（155 行 / 6 tests）：文件级双层 mock —— ① `jest.mock('@antv/l7-utils')`（`getArrayBuffer` / `getURLFromTemplate`，沿用 3.1.1 模式）；② `jest.mock('../../src/tile-source/mvt')`（`MVTSource` 构造器桩，返回 `{ getTileData: jest.fn(() => features) }`，避免依赖真实 `@mapbox/vector-tile` + `pbf` 解码 ArrayBuffer）。**关键测试设计**：`tileParams={x:10,y:20,z:30}` 与 `tile={x:1,y:2,z:3}` **故意取不同值**，精确锁死「URL 用 tileParams / getCustomData + MVTSource 用 tile.xyz」差异（风险①③）—— 断言 `getURLFromTemplate(url, tileParams)` → `http://t/30/10/20.pbf`，同时 `MVTSource(data, 1, 2, 3)` / `getCustomData({x:1,y:2,z:3})`。6 case：① `getArrayBuffer` 成功（断言 URL 用 tileParams + MVTSource 用 tile.xyz + getTileData 返回 features + xhrCancel 已设）；② `getArrayBuffer` err → resolve undefined + xhrCancel 仍设（赋值先于回调错误）；③ `getArrayBuffer` 空数据 → resolve undefined；④ `getCustomData` 成功（走 getCustomData 不走 getArrayBuffer + 入参用 tile.xyz + xhrCancel 未设）；⑤ `getCustomData` err → resolve undefined + xhrCancel 未设；⑥ `requestParameters` 透传进 getArrayBuffer。**测试隔离**：`tile` 是跨 case 共享的可变对象（`getArrayBuffer` 分支会写 `tile.xhrCancel`），`beforeEach` 内 `jest.clearAllMocks()` + `delete (tile as SourceTile).xhrCancel` 重置，避免 xhrCancel 跨 case 泄露（初版遗漏此重置导致 2 个 getCustomData case 误判失败）。
- **设计取舍**：
  - **`MVTSource` 用 `jest.mock` 构造器桩而非真实 MVT 解码**：jsonTile spec 能用真实 `JSON.parse` 因 jsonTile 只做字符串解析；mvt 的 `MVTSource` 构造器内部 `new VectorTile(new Protobuf(data))` 需真实 MVT 字节流，构造成本高且偏离 loader 测试目的（loader 契约 = fetch + 分发 + 取消，MVT 解码是独立单元）。mock `MVTSource` 让 spec 聚焦 loader 行为，仍能断言 `MVTSource(data, tile.x, tile.y, tile.z)` 构造入参正确，覆盖等价性。
  - **保留 `DEFAULT_CONFIG` 在 parser 而非下沉 loader**：`DEFAULT_CONFIG` 是 tileset 选项默认值（tileSize/minZoom/maxZoom/zoomOffset/warp），属「parser 形状组装」职责，与 fetch 无关，留在 parser 与 jsonTile 3.1.1 的结构对称（jsonTile 无 DEFAULT_CONFIG 因原本就没有，非刻意去掉）。下沉到 loader 会混淆「tileset 选项」与「取数」职责边界。
  - **删除死导出 `MapboxVectorTile` 顺带做**：该导出在 parser/mvt.ts 是死代码（包内/跨包均无 import，BACKLOG 阶段 0.4 项已记），MVTLoader 抽取已让 parser/mvt 大幅瘦身，顺手清理成本极低且避免「死导出苟延残喘到下一阶段」。注意：只删 mvt.ts 一处，testTile.ts 的本地 `MapboxVectorTile` 仍待统一（BACKLOG 保持 open）。
  - **`tile.xhrCancel` 同步赋值窗口是等价关键**：原实现 `const xhr = getArrayBuffer(...); tile.xhrCancel = () => xhr.cancel();` 两语句同步执行，xhrCancel 在 `getArrayBuffer` 返回后立即赋值，**早于任何异步回调**。loader 机械保留此顺序，spec case ② 验证「err 到达时 xhrCancel 已就位」。若未来重构把 xhrCancel 赋值移进回调，会破坏「瓦片被 cancel 时仍能取消进行中的 fetch」语义 —— 阶段 3.x 评估。
- **怎么验证**：
  - `tsc --noEmit -p packages/source/tsconfig.json`：source 总 31 错基线不变（全 core `.glsl` 噪音，0 非 glsl 错）—— `MVTLoader implements TileLoader` + `mvt.ts` 委托 loader + 删死导出对类型检查零回归；`getTileData` 返回 `Promise<ITileSource | undefined>` 经 3.1.1 已扩宽合法。
  - `tsc --noEmit -p packages/layers/tsconfig.json`：229 pre-existing 不变 —— layers 经 registry 拿到的 `mvt` parser default export 签名 + `tilesetOptions` 结构全不变（含 `DEFAULT_CONFIG` + `data`/`dataArray`/`isTile` 字段），`getTileData` 返回 `| undefined` 与迁移前同处理路径零回归。
  - `eslint`：通过（3 文件 mvt-loader / mvt / mvt-loader.spec）。
  - `prettier --check`：通过（mvt-loader.ts 与 spec 经 `prettier --write` 重排，纯 whitespace）。
  - `jest packages/source/__tests__`：9 suites / 57 tests 全通过（旧 51 + 新 6 `MVTLoader`）；新 loader spec 经双层 `jest.mock` 注入桩，断言 `getURLFromTemplate` / `getArrayBuffer` / `getCustomData` / `MVTSource` 调用入参 + `src.getTileData('sourceLayer')` 返回值 + `tile.xhrCancel` 设/未设，覆盖 fetch 成功/失败/空 + 自定义数据成功/失败 + 参数透传 + 取消语义 7 类路径。
  - `jest packages/source/__tests__ + packages/layers/__tests__`：111 passed / 1 skipped / 0 failed —— 瓦片图层运行时路径覆盖，mvt parser 经 registry 透明委托 MVTLoader，`tile/core/BaseLayer.ts` 读 `source.tileset` 实例行为等价。
- **风险/注意**：
  - **⚠️ `tileParams` vs `tile.x/y/z` 差异是 mvt 与 jsonTile 的核心区别**：mvt 用 `tileParams`（`TileLoadParams`）做 URL 模板插值（支持 `{z}/{x}/{y}` 等模板字段），但用 `tile.x/y/z` 做 `getCustomData` 入参与 `MVTSource` 构造（瓦片坐标）；jsonTile 两者都用 `tile.x/y/z`。本次 spec 用 `tileParams={x:10,y:20,z:30}` vs `tile={x:1,y:2,z:3}` 精确锁死此差异 —— 后续 3.1.3 GeoJSONVTLoader 抽取时切勿「统一」成相同参数源（geojsonvt 应与 jsonTile 同侧：都用 tile.x/y/z）。
  - **⚠️ `tile.xhrCancel` 同步赋值时机**：见上「设计取舍」。任何把 xhrCancel 赋值移进异步回调的重构都会破坏取消语义。
  - **`MVTSource` 构造器 mock 的局限**：spec 不覆盖真实 MVT 字节流解码（`VectorTile` / `Protobuf`），那部分由 `MVTSource` 自身 + layers 集成测试兜底。loader spec 只保证「fetch 成功 → 用正确 (data, x, y, z) 构造 MVTSource」。若未来要补 MVT 解码单测，应在 `tile-source/mvt.spec.ts` 独立建立（不在 loader 职责内）。
  - **死导出删除的跨包影响为零**：`export type MapboxVectorTile` 是 type-only 导出，`isolatedModules: true` 下编译期擦除，无运行时；跨包 grep 确认无 import（layers 的 `lib/es` 编译产物里的 `./parser/mvt` require 是 layers 自身编译输出，非 source 的导出消费）。
- **遗留**：→ 阶段 3.1.3 `GeoJSONVTLoader` 抽取（阶段 3.1 收尾，geojsonvt 是内存切瓦片非网络 fetch，无 xhrCancel，URL 插值用 tile.x/y/z）；阶段 3.2 `RasterTileLoader` 大 switch 拆分；阶段 3.3 `image.ts` parser 去 fetch；阶段 2.x `Transform<TIn,TCfg,TOut>` 契约抽取 / 领域错误抽 `errors.ts` / 消费方按需子集注册文档化（BACKLOG 既有）；BACKLOG 瓦片 parser/loader 单测覆盖缺口剩 geojsonvt / raster-tile / image 待补。BACKLOG `MapboxVectorTile` 4 处重复剩 testTile.ts 本地定义待统一。

## [阶段 3.1.1] JsonTileLoader 抽取（commit 2b4728a）

- **改了什么**：
  - 新增 `src/loader/tile-loader.ts`（26 行）：`export interface TileLoader { loadTile(tileParams: TileLoadParams, tile: SourceTile): Promise<ITileSource | undefined>; }` —— 瓦片加载器契约。接口签名 `undefined` 化以兼容 mvt 失败时 `resolve(undefined)` 的既有路径（jsonTile/geojsonvt 始终 resolve `ITileSource`，`undefined` 是合法但不使用的值）。JSDoc 说明 parser=形状转换 / loader=数据获取解耦思想、返回 undefined 语义、取消语义（mvt 需设 `tile.xhrCancel`，jsonTile/geojsonvt 不设，保持等价）。
  - 新增 `src/loader/json-tile-loader.ts`（84 行）：`export class JsonTileLoader implements TileLoader`。构造器持 `url` / `requestParameters?` / `getCustomData?`；`loadTile(_tileParams, tile): Promise<ITileSource>` 内含原 `getVectorTile` 函数体（机械搬运，零行为改动）。保持 jsonTile 历史行为：① 忽略 `TileLoadParams`（第一参 `_`），用 `SourceTile.x/y/z` 生成 url 模板参数 + `getCustomData` 入参；② `getCustomData` 优先（err/无数据 resolve 空 defaultLayer），否则 `getData` 回调（err/无数据 resolve 空 defaultLayer，成功 `JSON.parse` 入 defaultLayer）；③ err 永不 reject；④ 不设 `tile.xhrCancel`（原 jsonTile 无取消逻辑）。
  - 重写 `src/parser/jsonTile.ts`（83 → 30 行，-53）：删 `getVectorTile` 闭包 + 5 个相关 import（`getData` / `getURLFromTemplate` / `GeoJSONVTTileSource` / `MapboxVectorTile` / `RequestParameters` 悉数下沉到 loader）；`import { JsonTileLoader } from '../loader/json-tile-loader'`；构造 `loader`，`getTileData = (_, tile) => loader.loadTile(_, tile)`。default export 签名 `jsonTile(url, cfg): IParserData` 不变，`builtins.ts` 的 `registerParser('jsonTile', jsonTile)` 零影响。
  - 新增 `__tests__/loader/json-tile-loader.spec.ts`（110 行 / 6 tests）：文件级 `jest.mock('@antv/l7-utils')`（`getData` / `getURLFromTemplate`）—— 首次为瓦片加载器建立单元测试网（source 包此前 0 瓦片 parser/loader 单测）。6 case：① `getData` 成功（断言 `getURLFromTemplate` 入参 `{x:1,y:2,z:3}` + `getData` 收到模板插值后的 url `http://t/3/1/2.json` + `src.getTileData('defaultLayer') === features`）；② `getData` err → 空 defaultLayer；③ `getData` 空数据 → 空 defaultLayer；④ `getCustomData` 成功（断言走 `getCustomData` 不走 `getData` + features）；⑤ `getCustomData` err → 空 defaultLayer；⑥ `requestParameters` 透传（headers 进 `getData` 入参）。
- **设计取舍**：
  - **接口签名 `Promise<ITileSource | undefined>` 而非 `Promise<ITileSource>`**：mvt 的 `getVectorTile` 失败时 `resolve(undefined)`（与迁移前等价，tileset-manager 状态机已处理 undefined）。强制 `ITileSource` 会让 mvt loader 被迫改 resolve 空 tile —— 行为变更，违反渐进等价原则。jsonTile loader 始终 resolve `ITileSource`，`Promise<ITileSource>` 协变赋值给 `Promise<ITileSource | undefined>`，零类型回归（mvt 已是 `| undefined` 且 layers tsc 229 基线不变）。
  - **`jest.mock('@antv/l7-utils')` 文件级 mock 而非 DI 注入 fetch**：保持 loader 生产代码与抽取前 100% 字面等价（直接 `import { getData, getURLFromTemplate }`），测试通过 jest 模块 mock 注入桩。避免 DI 让 loader 构造签名多一个 fetch 参数、偏离「机械抽取」原则。mock 文件级隔离（jest.mock 默认 per-test-file scope），不影响其他 spec。
  - **`getTileData` 返回类型从 `Promise<ITileSource>` 扩宽到 `Promise<ITileSource | undefined>`**：经 mvt 已验证 `| undefined` 是 `tilesetOptions.getTileData` 合法返回值；扩宽后 layers tsc 229 基线不变。运行时 jsonTile loader 始终 resolve 非 undefined，0 行为变化。
  - **下沉 5 个 import 到 loader，parser 只留类型 import + JsonTileLoader**：`parser/jsonTile.ts` 职责收敛为「组装 `tilesetOptions` 指向 loader」，纯调度，从 83 行降到 30 行。
- **怎么验证**：
  - `tsc --noEmit -p packages/source/tsconfig.json`：source 总 31 错基线不变（全 core `.glsl` 噪音，0 非 glsl 错）—— `TileLoader` 接口 + `JsonTileLoader implements` + `jsonTile.ts` 委托 loader 对类型检查零回归；`getTileData` 返回类型扩宽 `| undefined` 经 mvt 既有路径已验证合法。
  - `tsc --noEmit -p packages/layers/tsconfig.json`：229 pre-existing 不变 —— layers 经 registry 拿到的 `jsonTile` parser default export 签名 + `tilesetOptions` 结构全不变，`getTileData` 返回 `| undefined` 与 mvt 同处理路径零回归。
  - `eslint`：通过（4 文件 tile-loader / json-tile-loader / jsonTile / json-tile-loader.spec）。
  - `prettier --check`：通过（spec 经 `prettier --write` 重排，纯 whitespace）。
  - `jest packages/source/__tests__`：8 suites / 51 tests 全通过（旧 45 + 新 6 `JsonTileLoader`）；新 loader spec 经 `jest.mock('@antv/l7-utils')` 注入桩，断言 `getURLFromTemplate` / `getData` / `getCustomData` 调用入参 + `src.getTileData('defaultLayer')` 返回值，覆盖 fetch 成功/失败/自定义数据/参数透传四类路径。
- **风险/注意**：
  - **⚠️ 阶段 3 触及瓦片生命周期**：source 包此前 0 瓦片 parser 单测，本增量首次为 `JsonTileLoader` 建立单元测试网（6 case）。后续 `MVTLoader`（3.1.2）/ `GeoJSONVTLoader`（3.1.3）/ `RasterTileLoader`（3.2）/ `ImageLoader`（3.3）抽取应沿用同 `jest.mock('@antv/l7-utils')` 文件级 mock 模式补 loader 单测（已记 BACKLOG：瓦片 parser/loader 单测覆盖缺口）。
  - **`JsonTileLoader` 不设 `tile.xhrCancel`**：与原 `jsonTile` 等价（`getData` 回调风格未暴露取消句柄）。若未来 jsonTile 需取消能力，需 `getData` 改返回 xhr 句柄 + loader 在 `loadTile` 设 `tile.xhrCancel` —— 阶段 3.x 评估。
  - **`jest.mock('@antv/l7-utils')` 文件级隔离**：jest.mock 默认 per-test-file scope，`json-tile-loader.spec.ts` 的 mock 不污染其他 spec（`source.spec.ts` / `parser-registry.spec.ts` 等不被 mock）。`beforeEach(jest.clearAllMocks())` 清调用计数，跨 case 独立。
  - **`getTileData(_, tile)` 忽略 `TileLoadParams`**：jsonTile 历史行为，`JsonTileLoader.loadTile` 保留（用 `tile.x/y/z`）。MVTLoader（3.1.2）将改用 `tileParams` 做 URL 插值 —— 两者差异必须在各自 loader 内保留，不可统一。
- **遗留**：→ 阶段 3.1.2 `MVTLoader` 抽取（含 `tile.xhrCancel` 取消语义 + `resolve(undefined)` 路径 + `tileParams` 做 URL 插值）；阶段 3.1.3 `GeoJSONVTLoader` 抽取；阶段 3.2 `RasterTileLoader` 大 switch 拆分；阶段 3.3 `image.ts` parser 去 fetch；阶段 2.x `Transform<TIn,TCfg,TOut>` 契约抽取 / 领域错误抽 `errors.ts` / 消费方按需子集注册文档化（BACKLOG 既有）；**新增 BACKLOG：瓦片 parser/loader 单测覆盖缺口**（本增量首次补 JsonTileLoader 6 case，mvt/geojsonvt/raster-tile/image 待补）。

---

## [阶段 2.5] createSource 工厂 + registry 注入（commit c154d20）

- **改了什么**：
  - 新增 `src/create-source.ts`（33 行）：`export function createSource(data: any | Source, cfg?: ISourceCFG, registry: ParserRegistry = defaultRegistry): Source { return new Source(data, cfg, registry); }` —— `new Source(...)` 的函数式包装，推荐入口，便于未来扩展（默认 cfg 合并 / registry 校验 / 异步初始化钩子）而不破坏构造器兼容签名。`registry` 省略走 `defaultRegistry` 单例（`index.ts` 经 `registerBuiltins()` 自动注册全 13 内置 parser），与迁移前 `new Source(data, cfg)` 完全等价；注入自定义 `new ParserRegistry()` 可隔离注册表（按需子集 tree-shaking / 测试隔离 / 多源异构 parser 集合）。
  - 重写 `src/base-source.ts`（+13 行）：
    - import 块：`import { getParser, getTransform } from './factory'` → `import type { ParserRegistry } from './parser-registry'` + `import { defaultRegistry } from './parser-registry'`（不再依赖 factory 的旧全局函数）。
    - 新增 `private readonly registry: ParserRegistry = defaultRegistry` 字段（JSDoc 说明注入语义）。
    - 构造器签名 `constructor(data, cfg?)` → `constructor(data, cfg?, registry: ParserRegistry = defaultRegistry)`，构造体首行 `this.registry = registry`，并把 `registry` 透传给 `new ClusterManager(getExtent, getInvalidExtent, registry)`。
    - `executeParser`：`getParser(type)` → `this.registry.getParser(type)`（line ~280）。
    - `executeTrans`：`getTransform(type)(...)` → `this.registry.getTransform(type)(...)`（line ~302）。
  - 重写 `src/cluster-manager.ts`（+9 行）：import 同 base-source 切换；构造器增第 3 参 `private readonly registry: ParserRegistry = defaultRegistry`；`getParser('geojson')({...})` → `this.registry.getParser('geojson')({...})`（聚合 re-parse 经注入 registry 而非旧全局函数，与 Source 共用同一 registry 实例）。
  - `src/index.ts`（+1 行）：新增 `export { createSource } from './create-source'`，包入口暴露 `createSource` 工厂。
  - 新增 `__tests__/create-source.spec.ts`（71 行 / 5 tests）：① factory 返 `Source` 实例 + extent 正确；② `createSource(Polygon)` ≡ `new Source(Polygon)`（extent + dataArray.length 等价）；③ 默认 registry 下 cluster `updateClusterData(2)` 端到端（110 聚合点）；④ **关键**：`jest.spyOn(customRegistry, 'getParser')` 证明 Source 构造期 `executeParser` 拉 geojson parser 从注入的 `customRegistry`（非单例），且 `updateClusterData(2)` 后 spy 调用次数增加（ClusterManager 共用同一注入 registry）；⑤ 自定义 registry 注册 `custom-only` parser 后 `defaultRegistry.getParser('custom-only')` 抛 `ParserNotFoundError`（注册表状态隔离，不污染单例）。
- **设计取舍**：
  - **构造器增可选第 3 参而非新子类**：`registry = defaultRegistry` 默认参让所有既有 `new Source(data, cfg)` 调用零行为变化。`createSource` 仅函数式包装，无新类继承。monorepo grep 仅 1 处 `new Source(data, options)` 在 `packages/layers/src/plugins/DataSourcePlugin.ts:15` + 9 处测试，全 `new Source(data, cfg?)` 无第 3 参 —— 100% 向后兼容。
  - **cluster-manager 共享同一注入 registry**：base-source 构造 cluster-manager 时传 `registry`，保证 cluster re-parse 也走注入的 registry（不仅仅是 `executeParser`/`executeTrans`）。spec 用 `jest.spyOn(customRegistry, 'getParser')` 验证 `updateClusterData(2)` 后 spy 调用次数增加，证明全链路注入闭环。
  - **`create-source.ts` 独立文件不并入 `factory.ts`**：`factory.ts` 是 `@deprecated` wrapper 入口（4 函数 `getParser`/`registerParser`/`getTransform`/`registerTransform` 均弃用转发）；`createSource` 是新推荐入口，职责分离让 factory.ts 保持 thin wrapper 定位、create-source.ts 独立演进。
  - **`factory.ts` 4 个 `@deprecated` wrapper 不动**：阶段 2.5 后 `getParser`/`registerParser`/`getTransform`/`registerTransform` 全局函数仍 re-export（外部可能 `registerParser('custom', fn)` 注册自定义 parser 到 `defaultRegistry`）；base-source/cluster-manager 不再用它们但保留兼容出口，留给未来 major 版本评估移除。
- **怎么验证**：
  - `tsc --noEmit -p packages/source/tsconfig.json`：source 总 31 错基线不变（全 core `.glsl` 噪音，0 非 glsl 错）—— `Source` 构造器增 optional 第 3 参 + registry 字段 + `this.registry.getParser/getTransform` 对类型检查零回归；新 `create-source.ts` 纯转发签名对调用方零影响。
  - `tsc --noEmit -p packages/layers/tsconfig.json`：229 pre-existing 不变 —— layers 经 `import Source from '@antv/l7-source'` 拉 `index.ts`，`registry` 默认参零影响；`DataSourcePlugin.ts:15 new Source(data, options)` 2 参调用对增参构造器零类型回归。
  - `eslint`：通过（5 文件 base-source / cluster-manager / create-source / index / create-source.spec）。
  - `prettier --check`：通过（4 文件经 `prettier --write` 重排 import 顺序 + 多行 extent，纯 whitespace）。
  - `jest packages/source/__tests__`：7 suites / 45 tests 全通过（旧 40 + 新 5 `createSource`）；spec 经 `import '../src'` 触发 `index.ts` 副作用注册全 13 内置 parser，验证默认 registry 路径 + 自定义 registry 注入路径双通，spy 断言证明 parser + cluster re-parse 全链路走注入的 registry。
- **风险/注意**：
  - **`registry` 是构造期注入、运行期不可变**：`private readonly registry` 仅在构造器赋值，构造后不可替换。若运行期需切 registry，需重建 Source（与既有 bounds/cluster 状态一致 —— 均构造期定型）。未来若有热切换需求，阶段 4 异步生命周期再评估。
  - **字段初始化器 `= defaultRegistry` 与构造器赋值 `this.registry = registry` 略冗余但必要**：`readonly` 字段需声明初始化器（TS 要求），构造器再赋注入值。默认参 `registry = defaultRegistry` 保证构造器传入值恒等价于字段初始化器，无语义分歧。
  - **`defaultRegistry` 单例在测试间共享**：spec ④⑤ 用 `new ParserRegistry()` 创建独立实例避免污染单例；spec ⑤ 在 `customRegistry` 注册 `custom-only` 后断言 `defaultRegistry.getParser('custom-only')` 抛错 —— 验证隔离但不写入单例。`defaultRegistry` 只读断言，0 写入。
  - **`cluster-manager` 默认参 `registry = defaultRegistry`**：若未来消费方直接 `new ClusterManager(getExtent, getInvalidExtent)` 不传 registry，走 defaultRegistry 单例（与迁移前等价）。当前 ClusterManager 仅由 Source 内部构造，无外部直接 new，0 风险。
- **遗留**：→ 阶段 3 Parser 与 Loader 解耦（触及瓦片生命周期）；阶段 2.x `Transform<TIn,TCfg,TOut>` 契约抽取（BACKLOG 既有）；阶段 2.x 领域错误抽 `errors.ts`（BACKLOG 既有，条件触发）；阶段 2.x 消费方按需子集注册 README/CHANGELOG 文档化（BACKLOG 既有，2.5 工厂落地后对外能力正式成型，文档可统一补）。

---

## [阶段 2.4] registerBuiltins() 抽取 + sideEffects 收紧白名单（commit dd39acd）

- **改了什么**：
  - 新增 `src/builtins.ts`（74 行）：`export function registerBuiltins(registry: ParserRegistry = defaultRegistry): void`，把原 `index.ts` 顶层 13 个 `registerParser(...)` + 6 个 `registerTransform(...)` 收敛为单一函数。参数默认 `defaultRegistry` 单例；传入自定义 `new ParserRegistry()` 可隔离注册表（按需子集化 / 测试隔离）。模块头注释明确两种消费方使用方式（默认零改动 vs 按需子集 tree-shaking 友好）。
  - 重写 `src/index.ts`（57 → 29 行，-28 行）：
    - 删除 13 个 parser default import + 6 个 transform named import（全部下沉到 `builtins.ts`），仅保留 `rasterDataTypes` named import（包公共 re-export `export { rasterDataTypes }`）。
    - 删除 `registerParser, registerTransform` 从 `./factory` 的本地 import（不再直接调用）。
    - 新增 `import { registerBuiltins } from './builtins'` + `export { registerBuiltins } from './builtins'`（包入口暴露给消费方）。
    - 模块底部 19 行 `registerParser(...)`/`registerTransform(...)` 收敛为单行 `registerBuiltins();`（默认参数注入 `defaultRegistry`，行为完全等价）。
    - 注释说明 `sideEffects: ["./es/index.js"]` 与子路径 tree-shaking 的契约。
  - `packages/source/package.json`：`"sideEffects": true` → `"sideEffects": ["./es/index.js"]`。沿用 `packages/layers` 既有约定（layers 同样在 `index.ts` 自动注册全部图层类型）。仅在 `es/index.js` 标记副作用，其余子路径（`es/parser-registry.js`、`es/builtins.js`、`es/parser/*.js` 等）对 bundler 视作 tree-shakeable。
  - `__tests__/parser-registry.spec.ts`（100 → 152 行，+3 tests）：
    - import 块新增 `registerBuiltins`（从 `'../src'`）。
    - 新增 `describe('registerBuiltins')` 3 tests：① fresh `new ParserRegistry()` 经 `registerBuiltins(registry)` 注册全部 13 parser + 6 transform；② `registerBuiltins()` 无参默认走 `defaultRegistry`，幂等不抛；③ fresh registry 与 `defaultRegistry` 单例独立（`not.toBe`）。
- **设计取舍**：
  - **偏离 PLAN 字面 `sideEffects: false`，改用白名单 `["./es/index.js"]`**：PLAN 写「设 `sideEffects: false`」，但 `index.ts` 模块顶层仍调用 `registerBuiltins()` 对 `defaultRegistry` 单例产生写入副作用 —— 设 `false` 是对 bundler 撒谎，会致 bundler 误判 `index.ts` 无副作用而 tree-shake 掉 `registerBuiltins()` 调用，最终 `new Source({type:'csv'})` 在消费方抛 `ParserNotFoundError: csv`（致命回归）。白名单 `["./es/index.js"]` 既保 `index.ts` 副作用被尊重（零行为回归），又明示其余子路径 tree-shakeable（消费方经 `@antv/l7-source/es/parser-registry` 等子路径 import 可 tree-shake 不用的 parser 实现）。沿用 `packages/layers` 既有约定（同场景同方案），repo 内一致。严格 `sideEffects: false` 需把 `registerBuiltins()` 调用从 `index.ts` 移除（改由消费方显式调用），破坏「`import { Source } from '@antv/l7-source'` 即可用」的零配置契约，与「对外 API 完全兼容」核心原则相悖 —— 留给未来 major 版本评估（BACKLOG）。
  - **`registerBuiltins` 独立 `builtins.ts` 而非并入 `parser-registry.ts`**：`parser-registry.ts` 当前 97 行（registry class + 2 错误类）保持「registry 机制」单一职责；`builtins.ts` 是「内置注册目录」依赖全部 13 parser + 6 transform 实现，职责分离让 `parser-registry.ts` 不被 19 个 import 污染、保持可被 bundler tree-shake 友好（消费方经子路径 import `ParserRegistry` 时不被迫拉满 13 parser）。
  - **`registerBuiltins` 不放 `factory.ts`**：`factory.ts` 是「`defaultRegistry` 薄转发 wrapper」的弃用入口（4 函数均 `@deprecated`），把依赖 13 parser 实现的 `registerBuiltins` 放进去会破坏「thin wrapper」定位、且让 factory.ts 不再 tree-shakeable。从 `index.ts` 直接 re-export `./builtins` 更清晰。
  - **保留 `export { registerParser, registerTransform } from './factory'`**：阶段 2.5 `createSource` 工厂落地前，外部仍可能通过 `registerParser('custom', fn)` 注册自定义 parser 到 `defaultRegistry`（旧 API 路径），保留兼容入口。`factory.ts` 4 个 `@deprecated` wrapper 不在本阶段动。
  - **`rasterDataTypes` re-export 保留在 `index.ts`**：阶段 0.x 曾评估移出，但它是包公共 export（虽 monorepo 内 grep 仅 source 自身使用，跨包外部下游可能消费）；本阶段不动以缩窄 diff。后续若确认无外部消费，可独立小项移入 BACKLOG。
- **怎么验证**：
  - `tsc --noEmit -p packages/source/tsconfig.json`：source 自身 0 错，总 31 基线不变 —— `index.ts` 删 19 import + `builtins.ts` 加 19 import 的搬迁对类型检查零影响；`registerBuiltins(registry=defaultRegistry)` 默认参数与 `void` 返回签名对调用方零回归。
  - `tsc --noEmit -p packages/layers/tsconfig.json`：229 pre-existing 不变 —— layers 经 `import Source from '@antv/l7-source'` 拉的是 `index.ts`，`registerBuiltins()` 副作用照常触发，运行期注册全 13 内置 parser。
  - `tsc --noEmit -p packages/l7/tsconfig.json`：346 pre-existing 不变 —— l7 入口经 `import Source from '@antv/l7-source'` 同上。grep 确认 346 错全为 core `.glsl` 模块噪音，无 `source/src/{index,builtins,factory,parser-registry}.ts` 新错。
  - `eslint`：通过（3 文件 `builtins.ts` / `index.ts` / `parser-registry.spec.ts`）。
  - `prettier --check`：通过（`index.ts` 长注释块经 `prettier --write` 重排，纯 whitespace）。
  - `jest packages/source/__tests__`：6 suites / 40 tests 全通过（旧 37 + 新 3 `registerBuiltins`）；spec 通过 `import '../src'` 触发 `index.ts` 副作用，验证 `defaultRegistry` 自动注册路径 + `registerBuiltins(newRegistry)` 显式注册路径双通。
- **风险/注意**：
  - **`sideEffects` 白名单仅声明 `es/index.js`**：bundler（webpack 5+/rollup）按 `package.json` `module` 字段（`es/index.js`）+ sideEffects 白名单联合判断。commonjs `lib/index.js` 路径不在白名单但不影响 —— Node/ssr 通用保留全部副作用，sideEffects 主要服务 bundler tree-shaking（走 module 字段）。father 构建产物若改输出路径（如未来加 `dist/`），需同步更新白名单。
  - **`registerBuiltins` 是 idempotent**：重复调用对同一 registry 等价于覆盖注册（`this.parsers[type] = parser`），无副作用累积。消费方 `registerBuiltins(myRegistry)` 多次安全。但若 registry 已注册自定义同名 type，会被内置实现覆盖 —— 阶段 2.5 `createSource` 工厂建议消费方先 `registerBuiltins` 再 `registerParser('custom', fn)` 覆盖，或完全自定义不经 `registerBuiltins`。
  - **消费方子路径 import 需自行注册**：如果下游未来改用 `import { Source, ParserRegistry } from '@antv/l7-source/es/parser-registry'`（绕开 index），则 `defaultRegistry` 不会被自动注册，`new Source({type:'csv'})` 会抛 `ParserNotFoundError`。当前 monorepo grep 6 处 `@antv/l7-source` import 全走默认入口（无子路径），0 风险。外部下游若误用子路径需文档提示 —— 留 BACKLOG 评估 README/CHANGELOG 说明。
  - **`builtins.ts` 依赖全部 13 parser + 6 transform**：消费方 `import { registerBuiltins } from '@antv/l7-source'` 仍拉满全部实现（与原 `index.ts` 等价）。真正 tree-shaking 收益仅在消费方完全不走 `index.ts` / `builtins.ts`，自行 `new ParserRegistry()` + 手工 `myRegistry.registerParser('csv', csv)` 子集注册时获得。阶段 2.5 `createSource(data, cfg, registry?)` 工厂落地后，此模式才成为「对外正式能力」。
- **遗留**：→ 阶段 2.5 `createSource(data, cfg, registry?)` 工厂 + `Source` 构造器可选注入 registry；阶段 2.x 评估「消费方按需子集注册」README/CHANGELOG 文档化（BACKLOG 新增）；阶段 2.x `Transform<TIn,TCfg,TOut>` 契约抽取（BACKLOG 既有）；阶段 2.x 领域错误抽 `errors.ts`（BACKLOG 既有，条件触发）。未来 major 版本可评估严格 `sideEffects: false`（移除 `index.ts` 自动注册，破坏性变更）。

---

## [阶段 2.3] ParserNotFoundError + getParser/getTransform 未注册改抛错（commit 6ffdcf5）

- **改了什么**：
  - `src/parser-registry.ts`（45 → 97 行）新增两个 Error 子类 + `getParser` / `getTransform` 改抛错：
    - `ParserNotFoundError extends Error`：含 `readonly type: string` 字段；`constructor(type)` 设 `this.name = 'ParserNotFoundError'`，消息 `ParserNotFoundError: parser not registered for type "<type>"`。仿 `packages/utils/src/ajax.ts` 的 `AJAXError` 风格（target es6 下 `extends Error` 原型链无需 `Object.setPrototypeOf` 修补）。
    - `TransformNotFoundError extends Error`：与 `ParserNotFoundError` 对称，覆盖 transform 注册表的等价错误路径。
    - `getParser(type)`：内部取 `Record<string, Parser>[type]`（运行期可能 `undefined`），`undefined` 即抛 `ParserNotFoundError(type)`；签名保持 `: Parser`（不带 `| undefined`）—— 抛错路径由 Error 表达，调用方仍可链式 `getParser('geojson')({...})` 无 null 守卫。
    - `getTransform(type)`：对称抛 `TransformNotFoundError(type)`，签名保持 `: TransformFn`。
  - `src/factory.ts`（37 → 45 行）：`export { ... } from './parser-registry'` 块新增 `ParserNotFoundError` / `TransformNotFoundError`，4 个 `@deprecated` wrapper 函数无改动 —— 经 `defaultRegistry.getParser/getTransform` 转发自动享受抛错语义。模块头注释更新到阶段 2.3 错误治理。
  - `src/index.ts`（55 → 57 行）：`export { ... } from './factory'` 块新增 `ParserNotFoundError` / `TransformNotFoundError`，包入口暴露这两个新错误类（消费方可 `catch (e instanceof ParserNotFoundError)`）。
  - 新增 `__tests__/parser-registry.spec.ts`（100 行 / 10 tests）：
    - fresh `new ParserRegistry()` 抛 `ParserNotFoundError` / `TransformNotFoundError`，含 `name` / `type` / `message` / `instanceof Error` 断言。
    - `registerParser` / `registerTransform` 后 `getParser` / `getTransform` 返回原引用。
    - `defaultRegistry`（`import '../src'` 触发 `index.ts` 副作用注册）含全部 13 parser + 6 transform，未注册 type 抛对应命名错误。
- **设计取舍**：
  - **偏离 PLAN / 上一步「下一步」字面方案**：原方案「`getParser` 返 `Parser | undefined` 配合 `orThrow`」会要求调用方加 null 守卫，破坏 `cluster-manager.ts:102 getParser('geojson')({...})` 与 `base-source.ts:266/288 getParser(type)(...) / getTransform(type)(...)` 的直接链式调用 —— 与「严格行为等价」相悖。改为「`getParser` 直接抛错、签名保持 `Parser`」：未注册路径由 Error 表达（替代旧 `undefined → TypeError`），已注册路径 0 影响，调用方签名零变更，对 IDE 自动补全与 tsc 链式推断全友好。`Parser | undefined` + `tryGet*` 变体若后续真有「探测是否注册」需求再加，本阶段不预留 API surface（YAGNI）。
  - **`TransformNotFoundError` 单独定义而非复用 `ParserNotFoundError`**：transform 与 parser 是两条独立注册表，错误类型隔离便于 `catch (e)` 精确分支处理（消费方分别 catch parser 缺失 vs transform 缺失），不牺牲任何复杂度。
  - **`ParserNotFoundError` 放 `parser-registry.ts` 而非新 `errors.ts`**：当前 source 包仅此一个领域错误，独立 `errors.ts` 过度分层；与 `ParserRegistry` class 同文件就近维护。若后续 `Source` 层引入更多领域错误，再抽 `errors.ts` 收口（BACKLOG: 跨阶段评估）。
  - **向后兼容性**：迁移前未注册 parser 在 `base-source`/`cluster-manager` 调用链下表现为 `undefined(...)` → `TypeError: xxx is not a function`（运行期延迟报错）；迁移后改抛命名 `ParserNotFoundError`（注册表边界即时报错）。正常使用（已注册 13 个内置 type）0 影响 —— `jest 27/27` 既有测试全过即证。外部消费方若曾依赖 `getParser(unknown)` 返 `undefined` 做能力探测（grep `packages/layers/src` / `packages/core/src` 无此用法）则需改为 `try/catch`，但无此存在用例。
- **怎么验证**：
  - `tsc --noEmit -p packages/source/tsconfig.json`：source 自身 0 错，总 31 基线不变（全 core `.glsl` 噪音）—— `ParserNotFoundError` / `TransformNotFoundError extends Error` 在 target es6 下原型链稳；`getParser`/`getTransform` 签名保持 `Parser`/`TransformFn` 不破调用方 tsc 链式推断。
  - `tsc --noEmit -p packages/layers/tsconfig.json`：229 pre-existing 不变 —— layers 不直接 import registry error 类，经包出口 `export * from './interface'` 与 `./factory` re-export 全透明。
  - `eslint`：通过（4 文件 `parser-registry.ts` / `factory.ts` / `index.ts` / `parser-registry.spec.ts`）。
  - `prettier --check`：通过（spec 长行 import 经 `prettier --write` 重排为多行 import，纯 whitespace）。
  - `jest packages/source/__tests__`：6 suites / 37 tests 全通过（旧 27 + 新 10）；新 spec 含「fresh registry 抛错」「defaultRegistry 内置全注册」「instanceof Error + name/type/message」三类断言。
- **风险/注意**：
  - **错误语义从「延迟 TypeError」改为「即时命名 Error」**：虽然对正常路径 0 影响，但理论上若有第三方代码 `try { getParser(x) } catch (e if TypeError)` 做兜底分支，现在 `e` 变成 `ParserNotFoundError`（仍 `extends Error`/`instanceof Error` 真，但 `instanceof TypeError` 假）。grep l7 monorepo 无此用法，外部下游风险记 BACKLOG。
  - **`defaultRegistry` 单例在测试间共享**：jest 同 worker 内同模块图共用单例，`parser-registry.spec.ts` 的「fresh registry 抛错」用 `new ParserRegistry()` 而非篡改 `defaultRegistry`，避免污染其他 spec。`defaultRegistry` 只读断言（取已注册 type），不写入。
  - **`import '../src'` 副作用触发整包图**：spec 顶部 bare import 触发 `index.ts` 全量注册 + 拉 `base-source`/`tile-source` 子图，测试初始化开销 ↑ 但验证的是真实注册路径。ts-jest `isolatedModules` 下模块图在每个 spec 文件独立求值，跨 spec 无干扰。
  - **`ParserNotFoundError` / `TransformNotFoundError` 现已进入包公共 API**：阶段 2.4+ 若抽 `errors.ts`，需保留 `parser-registry.ts` / `factory.ts` / `index.ts` 的 re-export 不删（向后兼容）。
- **遗留**：→ 阶段 2.4 `sideEffects: false` + `registerBuiltins()` 抽取；阶段 2.5 `createSource(data, cfg, registry?)` 工厂；阶段 2.x 抽 `errors.ts` 收口领域错误（若 Source 层引入更多错误类型）；阶段 2.x `Transform<TIn,TCfg,TOut>` 契约抽取（BACKLOG 既有项）。

---

## [阶段 2.2] ParserRegistry class + defaultRegistry 单例（commit c27b598）

- **改了什么**：
  - 新增 `src/parser-registry.ts`（45 行）：定义 `ParserRegistry` class + `defaultRegistry` 单例。
    - class 持有 `parsers: Record<string, Parser>` 与 `transforms: Record<string, TransformFn>` 两个私有字典（替代旧 `PARSERS` / `TRANSFORMS` 模块级可变对象）。
    - 公开方法：`registerParser(type, p)` / `registerTransform(type, t)` / `getParser(type)` / `getTransform(type)`。
    - `getParser` 返回 `Parser`（不带 `| undefined`）：与迁移前 `PARSERS[type]` 在 `noUncheckedIndexedAccess: false` 下的类型语义一致 —— 调用方仍可链式 `getParser('geojson')({...})`，无 null 守卫回归。
    - `defaultRegistry` 单例：模块初始化时由 `index.ts` 通过 `registerParser('csv', csv)` 等填入内置 parser/transform。
  - 重写 `src/factory.ts`（阶段 2.1 后的 47 → 37 行）：
    - 删除内部 `PARSERS` / `TRANSFORMS` 字典与字面量私有类型。
    - `getParser` / `registerParser` / `getTransform` / `registerTransform` 4 函数保留为 `defaultRegistry` 的薄转发 wrapper，加 `@deprecated` JSDoc 指向 `defaultRegistry.xxx`。
    - 转出口 `export { ParserRegistry, defaultRegistry } from './parser-registry'`，让消费者可从 `'./factory'` 入口拿到 class 与单例（与 `index.ts` re-export 也对齐）。
  - `src/index.ts`（46 → 55 行）：替换单行 export 为多行 export 块，显式 re-export `ParserRegistry` 与 `defaultRegistry`（外部消费者可从 `@antv/l7-source` 包入口拿到这两个新 API）。
- **设计取舍**：
  - **`ParserRegistry` 用对象字典而非 `Map`**：`Map.get()` 返回 `T | undefined`，会让现有 `getParser(type)(arg)` 链式调用失效（TS 强制 null 守卫）。用 `Record<string, X>` 在 `noUncheckedIndexedAccess: false` 下保持原 `X`（不带 undefined），行为完全等价。`Map` 的迭代/size 优势对当前消费无价值。
  - **TRANSFORMS 与 PARSERS 合并到一个 class**：CLI/registry 边界统一 — 阶段 2.5 `createSource(data, cfg, registry?)` 工厂可注入单个 registry 同时承载 parser/transform。PLAN 2.2 字面是「`PARSERS/TRANSFORMS` 全局 Map → `ParserRegistry` class」，两者合并是正向执行。
  - **`TransformFn` 类型暂未抽 `Transform<TIn, TCfg, TOut>` 契约**：PLAN 2.1 仅定义 `Parser`，未定义 `Transform`。本阶段保持 `TransformFn = (data: IParserData, cfg?: any) => IParserData` 字面量，避免 scope 蔓延。`Transform` 契约抽取留阶段 2.x further split（BACKLOG 跟进）。
  - **wrapper 函数加 `@deprecated` 但不开 lint 规则**：保留兼容入口直至阶段 2.5 工厂落地，外部消费者（layers/core 无人直接 import，但 `index.ts` re-export 了给 SDK）可平滑迁移。lint-level deprecation 警告留 PLAN 2.x。
  - **保留 `getParser(type): Parser` 不返 `| undefined`**：阶段 2.3 才改抛 `ParserNotFoundError`，本阶段严格「行为等价」。
- **怎么验证**：
  - `tsc --noEmit -p packages/source/tsconfig.json`：source/src 自身 0 错，总错误 31 基线不变（全 core `.glsl` 噪音）—— `base-source.ts:267 sourceParser(...)` / `cluster-manager.ts:102 getParser('geojson')({...})` / `base-source.ts:288 getTransform(...)` 经 wrapper 转发 + Record<string, Parser> 字典均零类型回归。
  - `tsc --noEmit -p packages/layers/tsconfig.json`：229 pre-existing 不变 —— layers 包不直接 import factory 的项，只通过 `'./factory'` 的外部 re-export 拿 `getParser` 等，wrapper 转发对它全透明。
  - `eslint`：通过（3 文件 `parser-registry.ts` / `factory.ts` / `index.ts`）。
  - `prettier --check`：通过。
  - `jest packages/source/__tests__`：5 suites / 27 tests 全通过 —— factory 在运行期通过 `index.ts` 仍正确注册内置 parser/transform 到 `defaultRegistry` 单例，cluster/source 实际调用路径不变。
- **风险/注意**：
  - **回归测试覆盖弱**：`__tests__` 仅覆盖 geojson/csv/json/statistics，未直接覆盖 factory 的「未注册时 undefined」行为。本阶段未加入 factory 单测（与现状一致），新增 `createParserRegistry.spec.ts` 留阶段 2.3（与 `ParserNotFoundError` 一起，方便用抛错新语义做断言）。
  - **`defaultRegistry` 单例被多次模块导入**：ES module 模块图保证单例稳定（每个 import 引用同一实例），与原 `PARSERS`/`TRANSFORMS` 模块级 dict 语义等价。
  - **wrapper 名 `getParser` 与 class 方法 `getParser` 同名**：是设计意图 —— `export const getParser = (type) => defaultRegistry.getParser(type)`，对外保留函数式调用 vs 类方法调用两种风格。不冲突。
  - **消费者迁移路径**：外部消费者（若存在）从直接调 `getParser('xxx')` 逐步迁移到 `defaultRegistry.getParser('xxx')` 或注入 `new ParserRegistry()`，由阶段 2.5 `createSource(data, cfg, registry?)` 工厂收口。
- **遗留**：→ 阶段 2.3 `ParserNotFoundError` + `getParser` 未注册改抛错；阶段 2.4 `sideEffects: false` + `registerBuiltins()` 抽取 index.ts 副作用；阶段 2.5 `createSource` 工厂；阶段 2.x `Transform<T>` 契约抽取（BACKLOG）+ `INDIParseCfg` 独立命名（BACKLOG）。

---

## [阶段 2.1] 定义 Parser 契约 + 去重栅格 parser 类型（commit 9f11ef6）

- **改了什么**：
  - `interface.ts`（102 → 200 行，+98）新增 Parser 契约与去重栅格类型：
    - 新增 `export type Parser<TData = any, TCfg = any, TResult extends IParserData = IParserData>`：统一 parser 函数契约 `(data, cfg?) => TResult`，3 泛型参数对应「原始数据 / 配置 / 返回」。
    - 新增 `export interface KnownParsers`：13 个内置 parser 的「注册键名 → Parser 契约」映射（csv/geojson/geojsonvt/image/json/jsonTile/mvt/ndi/raster/rasterTile/rasterRgb/rgb/testTile），shape 取各 parser default export 的实际签名。
    - 新增 `export type KnownParserType = keyof KnownParsers`：注册键名联合类型。
    - **去重**：把 `RasterDataType` 与 `IRGBParseCfg` 从 `parser/rgb.ts` / `parser/ndi.ts`（两文件各定义一份、形状完全相同）收敛到 `interface.ts` 单一来源 —— 闭环 BACKLOG 项「独立小项 RasterDataType / IRGBParseCfg 重复定义」。
    - **去重**：把 `IImageCfg` 从 `parser/image.ts` 收敛到 `interface.ts`（前无外部使用，单一来源）。
    - 新增 import：`{ IJsonData, IParserCfg, ITileParserCFG }` from `@antv/l7-core`、`{ ITileBand, RequestParameters }` from `@antv/l7-utils`、`{ FeatureCollection, Geometries, Properties }` from `@turf/helpers`（`import type`，无运行时副作用）。
  - `factory.ts`（18 → 47 行，+29）：
    - `type ParserFunction = Parser`（替代字面量 `(data: any, cfg?: any) => IParserData`），导入 `Parser` 契约。是契约的「类型擦除」版本（`Parser<any, any, IParserData>`），用于按 string 分发的可变注册表。
    - 新增模块头注释，指明阶段 2.2/2.3/2.4 的演进路径。
  - `parser/rgb.ts`（27 → 6 行，-21）：删本地 `RasterDataType` / `IRGBParseCfg` / `IRasterCfg` import，改为 `import type { IRGBParseCfg, RasterDataType } from '../interface'`。
  - `parser/ndi.ts`（26 → 5 行，-21）：同上。
  - `parser/image.ts`（先删本地 `IImageCfg` 后补回 `RequestParameters` import）：本地 `IImageCfg` 定义删，改 `import type { IImageCfg } from '../interface'`；`RequestParameters` 因 `loadData` 仍用而保留 type import。
  - `BACKLOG.md`：将「RasterDataType / IRGBParseCfg 重复定义」状态从 `open` 改为「部分 done（阶段 2.1 已抽到 interface.ts 单一定义）」，剩余：ndi 用 `IRGBParseCfg` 名不副实（仅用 bands），独立命名 `INDIParseCfg` 留阶段 2.x 进一步拆分。
- **设计取舍**：
  - **`Parser` 用 `type` 而非 PLAN 字面的 `interface`**：PLAN 写「定义统一 `interface Parser`」，但函数契约用 `type` 别名更地道且对 `cfg?` 可选更简洁。语义等价（call signature），PLAN 文案以「统一 Parser 契约」为准。
  - **`cfg?` 在契约里是 optional**：与现状 `ParserFunction = (data: any, cfg?: any) => IParserData` 一致。预先验证「TS 允许 required-cfg 的具名 parser（如 `csv(data: string, cfg: IParserCfg)`）赋值到 optional-cfg 类型当 cfg 形参是 any」（隔离 TS 严格模式实测通过），所以所有现有 parser 可作 `Parser<KnownParserType>` 兼容赋值，无需改 13 个 parser 文件。
  - **`KnownParsers` 是弱契约，不参与 tsc 检查 parser 实现**：本接口仅作「注册键名 → 契约」的查表入口，**不强制** parser 文件实现形态与本接口一致（实现仍由本地签名保证正确）。强制对齐留阶段 2.2 `ParserRegistry<K>` 用 `KnownParserType` 泛型约束的 getParser / registerParser 签名时再做。
  - **去重 `IImageCfg` / `RasterDataType` / `IRGBParseCfg` 是顺手闭环**：阶段 0.1 列了 GAP-3 的「各定义一处」，本阶段才真正抽考对应类型（之前只动了 `MapboxVectorTile` 一部分）。scope 控制在「类型搬移，行为不动」，无运行时改动。
  - **`ndi` 的 `IRGBParseCfg` 名不副实但保留**：`ndi.ts` 只用 `IRGBParseCfg.bands`（2 元素），但本阶段不做 cfg 命名细分（避免触碰 parser 内部实现），留 BACKLOG 标记「`INDIParseCfg` 独立命名」候选。
- **怎么验证**：
  - 隔离 TS 严格模式实测：`(data: string, cfg: IParserCfg) => IParserData` 可赋值为 `Record<string, (data: any, cfg?: any) => IParserData>` 的值 —— `Parser<any, any>` 契约的「类型擦除」对具名 parser 兼容。
  - `tsc --noEmit -p packages/source/tsconfig.json`：source/src 自身 0 错，总错误 31 基线不变（全 core `.glsl` 噪音）。
  - `tsc --noEmit -p packages/layers/tsconfig.json`：229 pre-existing 不变 —— layers 包不见直接 import `IImageCfg`/`RasterDataType`/`IRGBParseCfg`，去重无跨包影响。
  - `eslint`：通过（`factory.ts` + `interface.ts` + 3 parser 文件）。
  - `prettier --check`：通过（5 文件）。
  - `jest packages/source/__tests__`：5 suites / 27 tests 全通过。
- **风险/注意**：
  - **`Parser` 的 cfg 是 `optional`，与个别 parser 实际 cfg `required` 不完全一致**：契约是「上层分发的擦除类型」，不是「下游实现的强约束」。具名 parser 函数内部签名仍按其真实 cfg 形态声明（required/optional 都允许），赋值到 `Parser<any, any>` 时 TS 通过 bivariant 语义接受（已验证）。这是「兼容擦除」式的演进路径，不是「严格统一」，阶段 2.2 引入 `ParserRegistry<K>` 才会使 cfg 形状参与类型推导。
  - **`KnownParsers` 的 `geojson` cfg 用 `IParserCfg`**（core），不与 `parser/geojson.ts` 的本地 `IParserCFG`（`{ idField?; featureId?; [key]: any }`）逐字对齐 —— 这是文档型的弱契约，本地签名保留。
  - **`geojson` 的 TData 用 `FeatureCollection<Geometries, Properties>`**：与 `parser/geojson.ts` signature 一致。但 Source 执行期 `executeParser` 的 `this.originData` 是 `any`（用户传任意对象经结构化面向后端类型擦除入库）。KnownParsers 仅约束「按 name 字符串配 cfg 形状」的下游类型推导，不约束运行时入参 polymorphism。
  - **去重是低风险**：`RasterDataType` / `IRGBParseCfg` 仅在 rgb/ndi 内部使用，`IImageCfg` 仅在 image.ts 内部使用 —— grep 确认无外部 importers，单一化定义不会破坏其他包消费。
- **遗留**：→ 阶段 2.2 `ParserRegistry` class（`defaultRegistry` 单例 + 旧 `getParser`/`registerParser`/`getTransform`/`registerTransform` 作 wrapper 保留）；剩余 `INDIParseCfg` 命名细分公司 BACKLOG。

---

## [阶段 1.4] 抽 Bounds value object（commit ff55e85）

- **改了什么**：
  - 新增 `src/bounds.ts`（50 行）从 `base-source.ts` 抽出数据范围 / 中心点计算职责：
    - `public extent: BBox` / `public center: [number, number]` / `public invalidExtent: boolean` 三字段
    - `public update(bbox: BBox): void` 原子写入 —— 合并原 `executeParser` 末尾三行（`extent` 计算 + `setCenter` + `invalidExtent` 判定）
    - `private setCenter(bbox)` 含 NaN→大地原点兜底（保留原行为）
  - `base-source.ts`（290 → 292 行，+2 行净增但语义收敛）：
    - 删除 `public extent: BBox`、`public center: [number, number]`、`private invalidExtent: boolean = false` 三字段
    - 删除 `private setCenter(bbox)` 方法（整段搬到 Bounds）
    - 新增 `private readonly bounds: Bounds = new Bounds()` + 3 个 getter（`extent`/`center`/`invalidExtent`）转发 `bounds.*`
    - `executeParser` 末尾 `this.extent = ...; this.setCenter(...); this.invalidExtent = ...` 三行收敛为 `this.bounds.update(extent(...))` 一行
    - `ClusterManager` 构造闭包：`() => this.extent` → `() => this.bounds.extent`、`() => this.invalidExtent` → `() => this.bounds.invalidExtent`
    - import 增加 `Bounds`（value import）
- **设计取舍**：
  - **三 getter 转发保留 `ISource.extent`/`.center` 可读语义**：外部直读 `source.extent` / `source.center` 不变（layers 包未见直接写 extent，但 ISource 字段契约保留 getter）。
  - **`invalidExtent` 同样 getter 转发**：原为 `private`，仅 `ClusterManager.calcExtent` 经闭包读。getter 是 public（TS 需要外部访问），但无 setter 实质只读，与原 private 字段语义等价。
  - **行数微增的原因**：新增 3 个 getter（每个 3 行）+ import + 字段块注释 + bounds 字段，合计 +14 行；移除实现部分（3 字段 + setCenter 7 行 + executeParser 3 行 = ~12 行）→ 净 +2 行。但**状态写入从 3 处分散赋值收敛为 1 处原子 `bounds.update`**，且语义封装到 value object。
  - **`Bounds` 是 value object 而非 delegate**：与 1.1-1.3 的 delegate 不同，Bounds 没有对 Source 状态的访问需求（不读 parser/cluster/data），它自己持有 extent/center，`update` 是纯写入。这是 stage 1 里第一个「自洽状态对象」，为阶段 2 状态机类（ParserRegistry 等）铺路。
- **偏离 PLAN 的说明**：PLAN 估算阶段 1 完成后 `base-source.ts` ~120 行「协调者」目标。实际阶段 1.1-1.4 完成后 292 行（起点 358，-66 行）。原因：各 delegate 的 getter/转发占大量行（84 行 accessor 转发 + 7 方法转发 + 构造期 4 delegate 实例化），而 PLAN 只估算了「搬走」的净收益。阶段 2 抽 ParserRegistry 后 base-source 的 `executeParser`/`executeTrans` 本身可进一步收敛，届时再评估。
- **怎么验证**：
  - `tsc --noEmit -p packages/source/tsconfig.json`：source/src 自身 0 错误，总错误 31（基线不变，全 core `.glsl` 噪音）。
  - `tsc --noEmit -p packages/layers/tsconfig.json`：229 个 pre-existing 错误（基线不变），ClusterManager 闭包改读 `bounds.extent`/`.invalidExtent` 后 `calcClusterExtent` 链路仍 work。
  - `eslint`：通过（`bounds.ts` + `base-source.ts` 干净，`Bounds` 作 statement-scope value import 不违反 `consistent-type-imports`）。
  - `prettier --check`：通过。
  - `jest packages/source/__tests__`：5 suites / 27 tests 全通过。
- **风险/注意**：
  - **`extent` 同名歧义**：`@antv/l7-utils` 导出的 `extent()` 函数与 `Source.extent` getter 同名。getter 里 `this.bounds.extent` 是 Bounds 实例的 public 字段，不调用 l7-utils 函数；`executeParser` 里 `extent(this.data.dataArray)` 是 l7-utils 函数。闭包 `() => this.bounds.extent` 也走 getter 路径，无递归。验证后 tsc 无歧义报错。
  - **NaN 兜底中心点保留**：`[108.92361111111111, 34.54083333333]` 大地原点（原代码默认值）原样搬到 `Bounds.setCenter`，与迁移前 `Source.setCenter` 数值精度一致。
  - **`cancelExtent` 早返回路径**：`executeParser` 在 `parser.cancelExtent` 时 `return`，`bounds.update` 不被调用 —— `bounds` 三字段保持 `undefined`/`false` 初值。原代码同样不赋值 extent/center/invalidExtent，语义等价。
- **遗留**：→ 阶段 2.1 定义统一 `interface Parser<TData, TCfg, TResult>`，给每个 parser 标注泛型。阶段 1 God Class 拆解完赛（4 delegate + 1 value object），下一步转入 Parser 注册机制现代化。

---

## [阶段 1.3] 拆 FeatureIndex delegate（commit 755becf）

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
