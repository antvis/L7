# 重构进度记录

> 倒序排列（最新在最上）。每完成一步重构追加一条记录。

---

## 📍 下一步

**阶段 3.2**：`RasterTileLoader` 抽取（阶段 3 「Parser 与 Loader 解耦」继续）。把 `parser/raster-tile.ts` 的 `getTileData` 大 switch（`RasterTileType` × 6 分支：IMAGE / ARRAYBUFFER / CUSTOMIMAGE / CUSTOMARRAYBUFFER / CUSTOMRGB / CUSTOMTERRAINRGB）拆成**分发器 + 6 个小 loader**。关键注意：① 6 分支当前分散在 `utils/tile/getRasterTile.ts`（`getTileImage` / `getTileBuffer` / `defaultFormat`）+ `utils/tile/getCustomData.ts`（`getCustomData` / `getCustomImageData`）—— 抽取需先厘清每分支的取数路径（IMAGE 走 `getTileImage` URL 取影像、ARRAYBUFFER 走 `getTileBuffer` 取二进制 + `defaultFormat` 解码、CUSTOM* 走 `getCustomData`/`getCustomImageData` 回调）；② RGB 与 ARRAYBUFFER 共用取数（`tileDataType === RasterTileType.RGB` 被归并成 ARRAYBUFFER），分发器需保留此归并；③ `extent`/`coordinates` 从 cfg 读，属「parser 形状组装」留 parser；`dataType` 决定分支，分发器按 `dataType` 选 loader；④ 沿用 `jest.mock` 文件级 mock 模式补每个小 loader 单测（分影像 / 二进制 / 自定义三类），复用 3.1.1–3.1.3 建立的 `jest.mock('@antv/l7-utils')` + mock 取数 + `tile.xhrCancel` 断言模式。⚠️raster-tile 是阶段 3 里最复杂的 parser（6 分支 + 多 utils 模块），建议**先做只抽分发器 + 把 6 分支搬进 loader 目录但不拆**的「第一步」，再在第 2 增量里把 6 分支拆成独立小 loader —— 渐进式，避免一次性大爆炸。详见 [PLAN.md § 阶段 3.2](./PLAN.md)。
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
