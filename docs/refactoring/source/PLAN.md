# @antv/l7-source 重构路线图

> 起始：2026-07-20 ｜ 工作分支：`refactor/source-progressive`

## 1. 现状诊断

### 1.1 包结构（`packages/source/src/`，约 3900 行）

```
base-source.ts   (358) — 主 Source 类（God class）
factory.ts       ( 18) — parser/transform 全局可变注册表
index.ts         ( 48) — 入口 + 副作用注册（sideEffects: true）
interface.ts     (103) — 类型（与 l7-core 重复）
parser/          csv/geojson/geojsonvt/image/json/jsonTile/mvt/
                 raster/raster-tile/rasterRgb/testTile + raster/{ndi,rgb}
source/          baseSource.ts(12) + vector.ts + geojsonvt.ts      ← 「瓦片数据源」抽象
transform/       cluster/filter/grid/hexagon/join/map
utils/           bandOperation/ tile/ csv/hexbin/relative-coordinates/statistics/util
```

### 1.2 核心问题（按严重度排序）

| #   | 严重度 | 问题                                      | 证据                                                                                                                                                                                                                                                                                    |
| --- | ------ | ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | P0     | `base-source.ts` 是 God Class             | 一个 358 行类同时承担：配置合并、解析调度、transform 执行、**全部 cluster 状态机**、tileset 管理（7 个 reload/get 方法）、feature 查询、extent/center、EventEmitter                                                                                                                     |
| 2   | P0     | Parser 与 Fetch 耦合                      | `mvt.ts`/`jsonTile.ts`/`geojsonvt.ts`/`raster-tile.ts`/`image.ts` 在 parser 里发 xhr、绑定 `tile.xhrCancel`、返回 Promise。parser 不再是纯函数，不可在 Worker/单测中复用                                                                                                                |
| 3   | P1     | 类型重复、混乱                            | `IParserData/IParseDataItem/IFeatureKey/IRasterCfg/DataType/IDictionary` 在 `source/interface.ts` 与 `core/ISourceService.ts` 完全重复；`MapboxVectorTile` 在 4 个文件分别定义；`parser/rasterRgb.ts` 与 `parser/raster/rgb.ts` 是**两个同名 function `rasterRgb`**                     |
| 4   | P1     | Factory 全局可变单例                      | `PARSERS/TRANSFORMS` 模块级可变对象 + `index.ts` 通过副作用注册 → `sideEffects: true`，无法 tree-shake；`getParser` 返回 `any`，未注册时 `undefined` 直接 call 报 TypeError                                                                                                             |
| 5   | P1     | `src/source/` 目录名实为「瓦片数据源」    | 与 `src/parser/` 概念重叠；`source/vector.ts` 和 `source/geojsonvt.ts` **都 `export default class VectorSource`**（同名冲突）；`source/baseSource.ts` 抽象类定义后**无人继承**                                                                                                          |
| 6   | P2     | Cluster 逻辑分裂                          | `transform/cluster.ts` 既是 transform（注册）又是 index 工厂；`base-source` 的 `initCluster/updateClusterData/getClusters*` 绕过 transform 机制直接 `getParser('geojson')` 重解析；`cluster: boolean` 与 `transforms:[{type:'cluster'}]` 两个开关并存；`clusterOptions.enable` 是死字段 |
| 7   | P2     | 异步模型不可靠                            | 构造函数里 `init().then(...)` fire-and-forget，使用者读 `source.data` 可能 undefined；`processData` 用 `new Promise` 包同步代码无意义；`excuteParser` 拼写错误且同步                                                                                                                    |
| 8   | P2     | `ITransform` 全 `any`                     | `ITransform { type: string; [key:string]: any }` → 所有 transform cfg 完全无类型推导                                                                                                                                                                                                    |
| 9   | P3     | `relative-coordinates.ts`（179 行）放错包 | 文件注释明确写「用于在 Layer 层实现高精度坐标转换」，却被 `BaseLayer.ts` 跨包调用，source 包承担了渲染层关注点                                                                                                                                                                          |
| 10  | P3     | 测试覆盖薄                                | 仅 cluster/filter/grid/hexagon + 3 parser 有 spec；`image/raster/raster-tile/mvt/geojsonvt/jsonTile` 无测试；`expect(length).toEqual(110)` 是脆弱快照断言                                                                                                                               |
| 11  | P3     | `testTile` parser 注册到生产              | dev/test 代码通过 `index.ts` 进了生产 bundle                                                                                                                                                                                                                                            |
| 12  | P3     | 命名/拼写                                 | `excuteParser`、`caculClusterExtent`、`transFunction`、`Satistics`(l7-utils)                                                                                                                                                                                                            |

---

## 2. 重构路线图

### 阶段 0 — 低风险清理（无行为变更）

| 步骤 | 动作                                                                                                                                                        | 状态 |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- |
| 0.1  | `source/interface.ts` 改为从 `@antv/l7-core` re-export，删重复定义；`MapboxVectorTile`/`RasterDataType`/`IRGBParseCfg` 各定义一处                           | ☑    |
| 0.2  | 修正拼写 `excuteParser→executeParser`、`caculClusterExtent→calcClusterExtent`、`transFunction→transformFunction`（私有方法，安全）                          | ☑    |
| 0.3  | 给每个 transform 加严格 cfg interface（`IFilterCfg/IJoinCfg/IGridCfg/...`），保留 `ITransform` 的 index signature 作过渡兼容                                | ☑    |
| 0.4  | 合并 `parser/rasterRgb.ts` ↔ `parser/raster/rgb.ts`（同名 function），ndi 同理；统一为 `parser/rgb.ts`、`parser/ndi.ts`                                     | ☑    |
| 0.5  | `testTile` 移出生产 entry — **wontfix**（TileDebugLayer 合法默认 parser，非 dev 代码）                                                                      | ✗    |
| 0.6  | 重命名 `src/source/` → `src/tile-source/`；两个 `VectorSource` 改名 `MVTSource` / `GeoJSONVTTileSource`；删除未被使用的 `BaseSource` 抽象类或让其被真实继承 | ☑    |

### 阶段 1 — 拆解 God Class（内部 delegate，对外透明）

`Source` 通过持有 delegate 拆分职责，**所有公开成员保留**（getter/方法别名转发），`ISource` 接口不动：

- 1.1 `ClusterManager`：封装 Supercluster + `clusterOptions` + `updateClusterData` + `getClusters*` + `calcClusterExtent`，搬出 ~150 行 ☑
- 1.2 `TilesetAdapter`：包 `initTileset` + 7 个 `reload*/getTile*` 方法 ☑
- 1.3 `FeatureIndex`：`getFeatureById/getFeatureId/updateFeaturePropertiesById` + `dataArrayChanged` 状态 ☑
- 1.4 `Bounds` value object：`extent/center/setCenter/invalidExtent` ☑

收益：`base-source.ts` 从 358 行降到 ~120 行的「协调者」。

### 阶段 2 — Parser 接口标准化 + 注册机制现代化

- 2.1 定义统一 `interface Parser<TData, TCfg, TResult extends IParserData>`，逐步给每个 parser 标注泛型 ☑
- 2.2 `PARSERS/TRANSFORMS` 全局 Map → `ParserRegistry` class。默认导出 `defaultRegistry`（已注册内置 parser），同时导出 class。旧的全局 `getParser/registerParser` 作为 `defaultRegistry` 的 deprecation wrapper 保留 ☑
- 2.3 `getParser(type)` 未注册时抛 `ParserNotFoundError(type)`（替代当前 undefined 直接 call 的 TypeError） ☑
- 2.4 `package.json` 设 `sideEffects` 白名单 `["./es/index.js"]`（替代字面 false：保留 index.ts 自动注册副作用），副作用注册显式化为 `registerBuiltins()`，验证 tree-shaking ☑
- 2.5 提供工厂 `createSource(data, cfg, registry?)`，旧 `new Source(data, cfg)` 内部用 defaultRegistry，行为等价 ☑

### 阶段 3 — Parser 与 Loader 解耦（⚠️触及瓦片生命周期）

核心思想：**parser = 数据形状转换（纯函数）；loader = 数据获取（fetch/decode）**。

- 3.1 抽象 `TileLoader` 接口 `loadTile(params, tile): Promise<ITileSource | undefined>`。把 `mvt.ts`/`jsonTile.ts`/`geojsonvt.ts` 里的 `getVectorTile` 闭包抽成 `MVTLoader`/`JsonTileLoader`/`GeoJSONVTLoader`，parser 只组装 `tilesetOptions.getTileData = (p,t) => loader.loadTile(p,t)`（3.1.1 jsonTile ☑ — 接口签名 undefined 化以兼容 mvt 失败 resolve undefined 路径；3.1.2 mvt ☑ — `MVTLoader` 保留 `tileParams` 做 URL 插值 + `tile.x/y/z` 做 getCustomData/MVTSource + xhrCancel 取消语义 + 失败 resolve undefined，parser/mvt 瘦身 73→53 行并删死 export `MapboxVectorTile`）
- 3.2 `RasterTileLoader` 把 `raster-tile.ts` 的大 switch（IMAGE / ARRAYBUFFER / CUSTOMIMAGE / CUSTOMARRAYBUFFER / CUSTOMRGB / CUSTOMTERRAINRGB 6 分支）拆成分发器 + 6 个小 loader
- 3.3 `image.ts` parser 不再自己 `getImage()` fetch；返回 `imageRef`（url/template），由 layer 侧或独立 ImageLoader 异步取数（保留 `images` Promise 字段作兼容）
- 3.4 `getCustomData/getCustomImageData` 作为 `CustomDataProvider` loader 统一到 loader 接口

收益：parser 全部纯函数可单测，loader 可 mock，`tile.xhrCancel` 取消逻辑收敛到 loader。

### 阶段 4 — 异步生命周期与状态

- 4.1 推荐 `Source.create(data, cfg): Promise<Source>` async 工厂；保留 `new Source` 走旧路径并 `console.warn`
- 4.2 标准化 `await source.ready` / `source.once('inited')`，消除 layers 侧 `source.data` race
- 4.3 `setData/updateFeaturePropertiesById` 引入「版本号 + 增量」机制；同 schema 的 `setData` 不重新 parse
- 4.4 删 `clusterOptions.enable` 死字段；合并 `cluster: boolean` 与 `transforms:[{type:'cluster'}]` 两条路径为一条（推荐 `cluster` cfg，transform 内 cluster 标 deprecated）

### 阶段 5 — 包边界修复

- 5.1 `relative-coordinates.ts` 迁到 `@antv/l7-layers` 或 `@antv/l7-utils`；从 `@antv/l7-source` 公开导出移除（保留 type re-export 过渡一个 minor）
- 5.2 source 只关心「数据结构 + 坐标语义」，`processRelativeCoordinates` 改由 layer 拿到 dataArray 后自行调用

### 阶段 6 — 测试 & 性能 & 不可变（持续）

- 6.1 parser/transform 改不可变（`filter/map/join` 当前直接改入参对象，不利缓存/diff），返回新对象
- 6.2 补单测：`image/raster/raster-tile/mvt/geojsonvt/jsonTile` 用 mock loader 各加 happy + error case
- 6.3 把 `expect(length).toEqual(110)` 这类脆弱断言改为 `> X` + 形状断言
- 6.4 `Source.stats()` 暴露行数/bbox/parser 类型/tile 数，便于调试与 size 监控

### 阶段 7（可选, 长期）— API 演进

- 7.1 显式 class 层级 `VectorSource/RasterSource/TileSource` 与现有 `Source` 并存，旧 `new Source(data,cfg)` 内部分发
- 7.2 引入 source pipeline 概念（raw → parser → transforms → output，每步可插拔），为未来 Worker 化/流式数据预留
- 7.3 `parser/geojsonvt.ts` 内联的 216 行 tile→GeoJSON 转换（`GetGeoJSON/classifyRings/signedArea`）抽出独立 `geojson-vt-decoder.ts`，可单测、可替换实现

---

## 3. 优先级矩阵

| 阶段           | 风险                 | 收益                  | PR 数 | 建议周期 |
| -------------- | -------------------- | --------------------- | ----- | -------- |
| 0 清理         | 极低                 | 类型/命名一致         | 3–4   | 1 周     |
| 1 拆 God Class | 低（内部 delegate）  | 可读性 / 可维护性     | 3     | 1–2 周   |
| 2 注册机制     | 中                   | tree-shake + 类型安全 | 2–3   | 1–2 周   |
| 3 Loader 解耦  | 中高（瓦片生命周期） | 可测性飞跃            | 3–4   | 2–3 周   |
| 4 异步生命周期 | 中                   | 异步正确性            | 2     | 1 周     |
| 5 包边界       | 低                   | 边界清晰              | 1     | 2–3 天   |
| 6 测试/性能    | 低                   | 覆盖率                | 持续  | 持续     |
| 7 API 演进     | 高                   | 长期扩展              | 多    | 季度级   |

---

## 4. 风险与缓解

1. **API 兼容**：阶段 0–2 全程保留 `export default Source`、`new Source(data, cfg)`、全局 `registerParser/getParser`，内部重构用 delegate + getter 别名对外透明。每个 PR 加 `@deprecated` 注释而非直接删。
2. **行为等价**：每阶段先补/跑现有 spec 再改行为；阶段 3 引入 loader 后用 mock loader 复跑 mvt/jsonTile 单测验证等价。
3. **跨包改动**：阶段 5 涉及 layers 包，PR 控制在 source + layers 两包，changeset 标 minor。
4. **CI/Size**：每 PR 跑 `test:unit` + `lint:ts` + `check-format` + size（`l7.js` 1.7 Mb 上限）。阶段 2 的 `sideEffects:false` 要专门验证 size 不增反降。
5. **Changeset 策略**：阶段 0–1 为 patch（无行为变化、内部重构）；阶段 2–4 为 minor（新增 API、保留旧 API）；阶段 5 为 minor；阶段 7 才考虑 major。

---

## 5. 关键文件清单（重构主战场）

| 文件                                                   | 当前行数 | 主要问题                       | 涉及阶段 |
| ------------------------------------------------------ | -------- | ------------------------------ | -------- |
| `src/base-source.ts`                                   | 358      | God Class                      | 1, 4     |
| `src/factory.ts`                                       | 18       | 全局可变单例                   | 2        |
| `src/index.ts`                                         | 48       | 副作用注册                     | 0.5, 2   |
| `src/interface.ts`                                     | 103      | 与 core 重复                   | 0.1      |
| `src/parser/geojsonvt.ts`                              | 216      | 216 行内联解码 + fetch         | 3        |
| `src/parser/raster-tile.ts`                            | 91       | 6 分支 switch + fetch          | 3        |
| `src/parser/mvt.ts`                                    | 91       | parser 里发 xhr                | 3        |
| `src/parser/rasterRgb.ts` + `src/parser/raster/rgb.ts` | 35 + 62  | 同名 function 重复             | 0.4      |
| `src/source/`                                          | 12+58+34 | 目录命名 + 同名 class          | 0.6      |
| `src/transform/cluster.ts`                             | 47       | 既是 transform 又是 index 工厂 | 4        |
| `src/utils/relative-coordinates.ts`                    | 179      | 放错包                         | 5        |
