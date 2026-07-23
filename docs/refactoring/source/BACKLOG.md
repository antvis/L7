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

### [阶段 4.3b 原构想] setData 同 schema skip re-parse — 勘探判定 dead-end（wontfix）

- **位置**：`packages/source/src/base-source.ts` `setData` / `executeParser` / `clusterManager.init` / `executeTrans`
- **原构想**：setData 每次全量 re-parse + 重建 cluster index + 重跑 transforms；「同 schema 换数据行」场景可能浪费，设想 skip re-parse。
- **勘探结论（4.3b 完成 setData 失败 surfacing 时一并完成）**：**dead-end，不实施**。逐一分类 executeParser / clusterManager.init / executeTrans 的 data-vs-schema 依赖：
  - `executeParser`：① `registry.getParser(type)` 查表 = **schema-dependent**（微秒级，skip 无收益）；② `this.data = sourceParser(this.originData, parser)` = **data-dependent**（originData 变了必须重 parse）；③ `tilesetAdapter.init(this.data)` = **data-dependent**；④ `bounds.update(extent(this.data.dataArray))` = **data-dependent**。
  - `clusterManager.init`：未启用早返回（no-op）；启用则 `cluster(data)` 重建 Supercluster 索引 = **data-dependent**。
  - `executeTrans`：transforms 作用于 `this.data` = **data-dependent**。
  - 结论：昂贵步骤**全 data-dependent**。setData 本质即换 `originData`——「同 schema + 不同 data」仍须全量 re-parse（data 变了）；「同 schema + 同 data」是退化 no-op。skip re-parse 无收益，dead-end。
- **4.3b 实际切片**：改为 `setData` 失败 surfacing（swallow/hang → `'error'` 事件，strictly-better），见 PROGRESS [阶段 4.3b]。
- **状态**：wontfix（已勘探判定 dead-end，结案记档避免重复考据）
- **发现于**：阶段 4.3a，结案于阶段 4.3b

### [阶段 4.3a review] `updateClusterData` 不 bump `dataVersion` 的语义选择

- **位置**：`packages/source/src/base-source.ts` `updateClusterData`(L~210) / `dataVersion` 契约 doc
- **问题**：4.3a 定义 `dataVersion` bump 点为 `setData` + `updateFeaturePropertiesById`，**不** bump `updateClusterData`。理由：cluster 下 `source.data` 随 zoom 变（`updateClusterData` 重算聚合视图），但这是 originData 的*派生视图*而非数据源变更；bump 会令 version 混入 zoom 噪音，掩盖真正 setData 变更。
- **风险**：若未来下游缓存按 `source.data` 引用 + version 判过期，cluster 场景下 zoom 变化 `source.data` 实际变了但 version 不变 → 缓存 miss 判 stale 失败。当前无消费方读 version（4.3a 纯叠加），无实际影响。
- **建议**：未来若下游需区分「聚合视图变」，另设 `clusterViewVersion`（bump on updateClusterData）而非污染 `dataVersion`。4.3b/后续消费方接入时 review 此选择。
- **状态**：open（低优先，待消费方接入时 review）
- **发现于**：阶段 4.3a

### [阶段 4.3b 后续] setData 失败后 stale-data / inited / dataVersion recovery 未做

- **位置**：`packages/source/src/base-source.ts` `setData`（4.3b 加 `.catch(emit 'error')`）
- **问题**：4.3b 仅 surface 失败（emit `'error'`），不做 recovery。setData 失败后source 状态：① `originData` 已换为新 data（reseat 已发生）；② `dataVersion` 已 bump（4.3a reseat 语义，与 parse 成败无关）；③ `this.data` 为**旧 parse 结果**（stale —— executeParser 抛错前未赋值成功，或 tilesetAdapter/bounds 未更新）；④ `inited` 留 `false`（`init()` 首行置 false，失败未恢复 true）；⑤ `this.parser` 可能已被 initCfg 改为坏 type。
- **影响**：失败后 source 处于半坏状态，后续读 `source.data` 得 stale、`inited===false`。当前无消费方监听 `'error'`（4.3b 纯 additive），实际触发面小；但消费方接入 `'error'` 后需知 recovery 未做。
- **建议**：未来若要 recovery，须定义回滚策略——至少恢复 `inited` 语义 + 决定 `dataVersion` 是否 un-bump（reseat 已发生但 data 未变，语义两难）+ 是否回滚 `originData`/`parser`。复杂且语义需斟酌，非 strictly-better，留待消费方实际接入 `'error'` 后按需评估。
- **状态**：open（低优先，待 `'error'` 消费方接入后评估）
- **发现于**：阶段 4.3b

### [阶段 0.4] MapboxVectorTile 4 处重复定义需统一

- **位置**：
  - `packages/source/src/interface.ts:106`（基础定义，`{ features: GeoJSON.Feature[] }`，阶段 0.1 后行号移到 106）
  - ~~`packages/source/src/parser/mvt.ts:21`（`VectorTileLayer & { features: Feature[] }`，死 export）~~ —— **阶段 3.1.2 已删**（MVTLoader 抽取时 parser/mvt 瘦身，死 export 一并清理）
  - `packages/source/src/parser/testTile.ts:14`（local 使用，同原 mvt.ts 形态）
  - `packages/source/src/parser/geojsonvt.ts` / `jsonTile.ts` / `tile-source/geojsonvt.ts` 均 import 自 interface
- **问题**：原 4 个定义形态不一致（interface 用 `GeoJSON.Feature[]`，mvt/testTile 用 `VectorTileLayer & { features: Feature[] }`），存在类型语义漂移。mvt.ts 的死导出已在阶段 3.1.2 清理；剩 testTile.ts 本地定义与 interface 形态不一致。
- **建议**：统一到 interface.ts 的定义（或更精确的 union），删 testTile.ts 的本地重复定义。处理时需注意 `VectorTileLayer` 来自 `@mapbox/vector-tile`，与 `GeoJSON.Feature` 结构不同，可能需调整 tile-source/geojsonvt.ts 的消费方式。
- **状态**：部分 done（mvt.ts 死 export 已删，阶段 3.1.2）；testTile.ts 本地定义仍待统一
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

### [阶段 3.x] 瓦片 parser / loader 单元测试覆盖缺口

- **位置**：
  - `packages/source/__tests__/loader/json-tile-loader.spec.ts`（阶段 3.1.1 首次补，6 case，`jest.mock('@antv/l7-utils')` 文件级 mock 模式）
  - `packages/source/src/parser/mvt.ts` / `geojsonvt.ts` / `raster-tile.ts` / `image.ts`（4 个瓦片/影像 parser 此前 0 单测）
  - 后续 `MVTLoader` / `GeoJSONVTLoader` / `RasterTileLoader` / `ImageLoader` 抽取（阶段 3.1.2 / 3.1.3 / 3.2 / 3.3）
- **问题**：source 包 `jest packages/source/__tests__` 在阶段 3.1.1 前仅 7 suites 覆盖非瓦片路径（`source` / `create-source` / `parser-registry` / `parser/{csv,geojson,json}` / `utils/statistics`）—— **瓦片解析/加载路径（mvt / jsonTile / geojsonvt / raster-tile / image）0 单元测试**。阶段 3「Parser 与 Loader 解耦」触及 ⚠️ 瓦片生命周期，无测试网时 refactors 靠类型检查 + layers 集成测试兜底，回归风险高。
- **建议**：每个 loader 抽取增量（3.1.2 MVTLoader / 3.1.3 GeoJSONVTLoader / 3.2 RasterTileLoader / 3.3 ImageLoader）必须配套补 loader 单测，沿用阶段 3.1.1 建立的 `jest.mock('@antv/l7-utils')` 文件级 mock 模式：
  - mock `getData` / `getArrayBuffer` / `getImage` / `getURLFromTemplate` 等 fetch 函数；
  - 注入成功/失败/空数据/自定义数据（`getCustomData`）四类桩；
  - 断言 fetch 调用入参（url 模板插值、`requestParameters` 透传、`getCustomData` 入参）+ `src.getTileData('defaultLayer')` 返回值 + 取消语义（`tile.xhrCancel` 被设）；
  - `jest.mock` 默认 per-test-file scope，不污染其他 spec，`beforeEach(jest.clearAllMocks())` 清计数。
  - 影像 parser（`image.ts`）的 `getImage` / `getCustomImageData` 同模式 mock。
- **状态**：部分 done（阶段 3.1.1 `JsonTileLoader` 6 case、阶段 3.1.2 `MVTLoader` 6 case、阶段 3.1.3 `GeoJSONVTLoader` 6 case —— 阶段 3.1 收尾，三个瓦片矢量 loader 全覆盖；阶段 3.2.1 `RasterTileLoader` 6 case —— raster 分发器单测建立；阶段 3.3 `ImageLoader` 7 case —— image.ts parser 去 fetch，含「永不 resolve」失败语义锁定）；阶段 3.2.2 6 分支 switch 拆 4 独立小 loader + `IRasterTileLoader` 接口 —— 拆分完成，4 小 loader 行为由现有 raster-tile-loader.spec 16 case 间接锁定（分发路由 + 各分支 empty/decode 语义），不做新增 spec（边际收益低）；4 小 loader 的直接 per-loader 单测留作低优先（行为已间接锁，无回归缺口）
- **发现于**：阶段 3.1.1（JsonTileLoader 抽取时首次建立瓦片 loader 单测，暴露此前 0 覆盖）

### [阶段 3.x / 测试] jest.mock spec 的 TS2352 type-guard 强转坑

- **位置**：
  - `packages/source/__tests__/loader/geojsonvt-loader.spec.ts`（阶段 3.1.3）—— `geojson-vt` default export 是「函数 + namespace」合并类型，`(geojsonvt as jest.Mock)` 报 TS2352，用 `as unknown as jest.Mock` 两步转换（已记录于该 spec 注释）
  - `packages/source/__tests__/loader/image-loader.spec.ts`（阶段 3.3）—— `isImageBitmap` 在 `@antv/l7-utils` 声明为 type guard `(image: any) => image is ImageBitmap`，`(isImageBitmap as jest.Mock)` 报 TS2352，同样需 `as unknown as jest.Mock`（post-commit 修复）
- **问题**：mock type-guard 函数 / namespace-合并类型时，直接 `as jest.Mock` 触发 TS2352（「neither type sufficiently overlaps」）。规律：**凡 mock 对象的源类型是 type guard（`x is T`）或 namespace 合并类型，cast 必须两步 `as unknown as jest.Mock`**；普通函数 / class 直 cast 合法（`MVTSource as jest.Mock` / `getArrayBuffer as jest.Mock` OK）。
- **建议**：后续 loader spec mock `@antv/l7-utils` 的函数时，先查其 `.d.ts` 声明是否 type guard —— 是则用 `as unknown as jest.Mock`。可在 spec 顶部建别名（如 `const isImageBitmapMock = isImageBitmap as unknown as jest.Mock`）统一引用。
- **状态**：open（规律已记，3.1.3 geojsonvt + 3.3 image 两案例；后续 loader spec 需沿用）
- **发现于**：阶段 3.3（image-loader spec post-commit tsc 暴露；漏检根因 = 写 spec 后未重跑 tsc，流程教训已记 PROGRESS 3.3 坑修复③）

---

---

### [阶段 2.x / 文档] 消费方按需子集注册的 README / CHANGELOG 文档化

- **位置**：`packages/source/README.md`（若有）/ monorepo `CHANGELOG` / `docs/refactoring/source/` 重构存档。
- **问题**：阶段 2.4 把 `sideEffects` 收紧为白名单 `["./es/index.js"]` + 抽出 `registerBuiltins(registry = defaultRegistry)`，让「`new ParserRegistry()` + 手工 `registerParser` 子集 / `registerBuiltins(myRegistry)`」成为消费方按需 tree-shaking 的合法姿势。但当前无文档明示：
  - 默认 `import { Source } from '@antv/l7-source'` 自动注册全 13 内置 parser（零配置）。
  - 若消费方经子路径 `import { ParserRegistry } from '@antv/l7-source/es/parser-registry'` 绕开 `index.ts`，则 `defaultRegistry` 不会被自动注册，`new Source({type:'csv'})` 会抛 `ParserNotFoundError`。
  - 阶段 2.5 `createSource(data, cfg, registry?)` 工厂落地后，按需子集注册成为对外正式能力的推荐入口。
- **建议**：在源包 README 或重构存档新增「注册表使用姿势」小节，对照说明三种模式（默认全量 / 自定义 registry 全量 / 自定义 registry 子集）与对应 tree-shaking 收益。CHANGELOG 在 2.4 / 2.5 落地后统一说明「sideEffects 白名单 + registerBuiltins + createSource 工厂」三项彼此配合的对外能力。
- **状态**：open（不阻塞代码进度，文档可在 2.5 落地后统一补）
- **发现于**：阶段 2.4（commit dd39acd）

### [阶段 2.x] 领域错误抽 `errors.ts` 收口（条件触发）

- **位置**：`packages/source/src/parser-registry.ts`（`ParserNotFoundError` / `TransformNotFoundError` 当前与 `ParserRegistry` class 同文件）。
- **问题**：阶段 2.3 把两个领域错误类就近放 `parser-registry.ts`，因为当前 source 包仅此一个领域错误场景，独立 `errors.ts` 过度分层。但若后续 `Source` 层（如 `base-source.ts` 的数据加载 / extent 计算 / cluster 生命周期）引入更多领域错误，`parser-registry.ts` 会逐渐变成「registry + 错误大杂烩」。
- **建议**：当领域错误类 ≥3 个时，抽 `packages/source/src/errors.ts` 收口统一导出；`parser-registry.ts` / `factory.ts` / `index.ts` 改为 re-export（保持公共 API 向后兼容）。同步评估是否引入 `SourceError` 抽象基类（统一 `name` / `code` 字段约定）。
- **触发条件**：Source 层新增第 3 个领域错误类时启动。
- **状态**：open（条件触发，当前不急）
- **发现于**：阶段 2.3（commit 6ffdcf5）

### [阶段 2.x] Transform 函数契约 `Transform<TIn, TCfg, TOut>` 抽取

- **位置**：
  - `packages/source/src/parser-registry.ts`（内部 `type TransformFn = (data: IParserData, cfg?: any) => IParserData`）
  - `packages/source/src/factory.ts`（同名 `TransformFn` 字面量类型，与 parser-registry 内部等价）
  - `packages/source/src/transform/*.ts`（13 个 transform 实现，各自具名签名，未对齐到统一契约）
- **问题**：阶段 2.1 抽了 `Parser<TData, TCfg, TResult>` 契约但未抽 `Transform` —— transform 仍是字面量 `(data, cfg?) => IParserData`，缺少泛型推导支持。阶段 2.2/2.3 在 `parser-registry.ts` / `factory.ts` 各保留一份 `TransformFn` 字面量（重复定义）。
- **建议**：仿 `Parser` 在 `interface.ts` 抽 `export type Transform<TIn = IParserData, TCfg = any, TOut extends IParserData = IParserData> = (data: TIn, cfg?: TCfg) => TOut`；新增 `KnownTransforms` 弱契约（`cluster` / `filter` / `join` / `map` / `grid` / `hexagon` 6 个键名 -> Transform 契约映射）+ `KnownTransformType` 联合类型；`parser-registry.ts` / `factory.ts` 的 `TransformFn` 改 import；transform 实现文件签名可渐进对齐（实现由本地签名保证，契约是弱保留，与 `KnownParsers` 同策略）。
- **状态**：open（不阻塞当前阶段，PLAN 阶段 2.x further split）
- **发现于**：阶段 2.2（首次记入 BACKLOG）

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

<!-- 倒序追加：阶段 3.4 新增遗留项 -->

### [阶段 3.4 / 流程教训] l7-utils mock + l7-core 值导入共存须 requireActual 展开

- **位置**：
  - `packages/source/__tests__/loader/raster-tile-loader.spec.ts`（阶段 3.4 重写后用 `jest.mock('@antv/l7-utils', () => ({ ...jest.requireActual('@antv/l7-utils'), formatImage: jest.fn() }))`）
  - 对比 `packages/source/__tests__/loader/mvt-loader.spec.ts`（`jest.mock('@antv/l7-utils', () => ({ getArrayBuffer, getURLFromTemplate }))` 窄 mock 合法）
- **问题**：raster spec 经 `import { RasterTileType } from '@antv/l7-core'`（**值**导入，非 type）拉起 `packages/core/src/index.ts` → `BasePostProcessingPass.ts:13` `const { camelCase, isNil, upperFirst } = lodashUtil;` 从 l7-utils 解构。若 `jest.mock('@antv/l7-utils')` 只导 formatImage（窄 mock），core 侧 `lodashUtil` undefined → `TypeError: Cannot destructure property 'camelCase'`，spec suite failed to run。mvt spec 不踩此坑：mvt-loader 仅 type-import l7-core（`ITileParserCFG` type），不拉起 core/index。
- **建议**：任何 spec 若 **既** mock l7-utils **又** 值导入 l7-core（或经其他路径拉起 core/index），必须 `jest.mock('@antv/l7-utils', () => ({ ...jest.requireActual('@antv/l7-utils'), <overridden>: jest.fn() }))` 展开 —— 保留真实 l7-utils（lodashUtil/gl/getImage 等）仅覆盖 loader 直接消费的导出。与阶段 3.3 `jest.resetAllMocks` 教训同档，列入新 spec 流程检查清单。
- **状态**：done（阶段 3.4 已用 requireActual 展开修复）；教训记录供后续 spec 参考
- **发现于**：阶段 3.4

### [阶段 3.4 / 边缘] CustomDataProvider empty-no-err 路径 reject 值 null-vs-undefined 微差异

- **位置**：
  - `packages/source/src/loader/raster-tile-loader.ts` `loadCustomRasterData`（`data.length===0` 时 `reject(undefined)`）/ `loadCustomImageData`（`!data` 时 `reject(undefined)`）
  - 对比迁移前 `packages/source/src/utils/tile/getCustomData.ts`（`if (err || data.length===0) reject(err)` —— empty-no-err 时 err 为用户 cb 传的 falsy 值，常为 `null`）
- **问题**：provider 路径下 consumer `.then` 内 `reject(undefined)` 是固定值；迁移前 `reject(err)` 的 err 是用户 cb 传入的 falsy（`cb(null, [])` → err=null / `cb(undefined, [])` → err=undefined）。故 `cb(null, [])`（Node 风格成功回调最常见）时迁移前 reject(null)、新路径 reject(undefined) —— **reject 值有 null-vs-undefined 差异**。err-passthrough 路径（err 真值）reject 值字字等价（provider reject(err) → catch → reject(err)）。
- **影响评估**：经核消费链 `SourceTile.loadData`（`tile.ts:154` try/catch）→ `onTileError`（`tileset-manager.ts:326`）→ `emit(TileEventType.TileError, { error, tile })`。error 值仅 emit 给 layers 订阅者，**无 layer 做 `error === null` vs `=== undefined` 区分**（结构性行为 TileError 触发 / loadFinished / loadStatus=Failure 完全一致）。故此差异**不可观测**。
- **建议**：保持现状（reject undefined 固定值更简洁）；若未来某 layer 显式区分 null/undefined error 值，再回头让 consumer 透传 err（需 provider 额外暴露 err 给 empty 路径，如 resolve `{err, data}` —— 代价是 provider Promise 模型变脏，不推荐）。
- **状态**：wontfix（不可观测 + 修正代价 > 收益）
- **发现于**：阶段 3.4

### [阶段 3.4 / 边缘] raster-buffer `cb(null, undefined)` async 路径「挂起」隐患

- **位置**：`packages/source/src/loader/raster-tile-loader.ts` `loadCustomRasterData`（`(data as any).length === 0` 判定）
- **问题**：CUSTOMARRAYBUFFER/CUSTOMRGB 的 `getCustomData` 回调若用户传 `cb(null, undefined)`（无 err 也无 data），`(data as any).length` = `undefined.length` 抛 TypeError。迁移前 `utils/tile/getCustomData.ts` 同样 `data.length` 抛 TypeError —— **sync cb**（Promise executor 内同步调用）两者都 reject(TypeError) 等价；**async cb**（setTimeout/fetch 后异步调用）迁移前 throw 在异步任务中 uncaught → Promise 永不 settle（挂起），新路径 `.then` 回调抛错 → reject(TypeError)（不挂起）。故 async 路径有「迁移前挂起 / 新路径 reject」差异。属既存隐患（用户传 undefined 给 raster-buffer 自定义回调本就是用法错误）。
- **建议**：保持现状（well-formed 输入 100% 等价；malformed 输入既已 broken/nondeterministic，不修正）。若未来想稳健化，raster-buffer consumer `.then` 可加 `if (!data) reject(undefined)` 前置 guard 防 `.length` 抛 —— 但会改变 empty-no-err 行为（与「零行为变化」相悖），应单独立项不在渐进重构内。
- **状态**：wontfix（既存 latent bug，well-formed 等价）
- **发现于**：阶段 3.4

### [阶段 4.1b] `new Source` 的 `console.warn` deprecation — 勘探结案 wontfix

- **位置**：`packages/source/src/base-source.ts` `constructor`
- **原计划**：PLAN 阶段 4.1 原含「保留 `new Source` 走旧路径并 `console.warn` deprecation」。4.1a 纯叠加切片**不加** warn（违反纯叠加零行为变化纪律），推迟到 4.1b 评估实施。
- **勘探结论（4.1b 评估，git grep 全仓 `new Source(` / `Source.create(` / `createSource(` —— `-- packages`）**：
  - 生产代码 `new Source(` 仅 1 处：`packages/layers/src/plugins/DataSourcePlugin.ts:15` —— 正是 4.2 确立的合法 `new Source` + `await source.ready` race-free 模式（`if (source.inited)` fast-path + `else await source.ready`）。非 `Source.create`，而是借 4.1 `ready` getter 消除 race。
  - `Source.create(` / `createSource(` 生产零消费（仅 spec + source 包内定义/doc）；source 包内其余 `new Source(` 命中均为工厂内部；examples/demos 经 layer 包装非直接 race。
- **wontfix 五条理由**：① 自相矛盾 —— warn 会 nag 唯一生产消费方 `DataSourcePlugin`，而它正是 4.2 合法的 `new Source` + `await ready` 模式；② 零 bad-pattern call site —— 4.2 已清掉唯一真实 race（旧 `'update'` 手写 Promise premature-resolve + init 失败 hang），全仓无 `new Source` + 同步读 `source.data`/`inited` race 残留；③ `Source.create`/`createSource` 生产零采用 → 无迁移可「推」，deprecation 无对象；④ `new Source` 是公开构造器（doc + examples 大量用，主流入口），deprecate 属 major 级 API 劝退，不该 minor 推；⑤ race 已由 4.1 `ready` getter 在消费侧解决（`new Source` + `await source.ready`），非 await 路径 unhandled rejection 是 4.1 明确保留现状，`Source.create` 仅 sugar 非必需。
- **结论**：**wontfix，不实施 deprecation**。`new Source` 保持公开主流入口地位；`Source.create` / `ready` getter 作为 opt-in 增强 infra 留存（4.1/4.2 已落地），不强制退役 `new Source`。阶段 4 deprecation 主题收敛。
- **状态**：wontfix（已勘探结案，记档避免重复考据）
- **发现于**：阶段 4.1，评估结案于阶段 4.1b

### [阶段 4.x cleanup] `init()` 内 `this.inited = true` 与构造器 `.then` cb 双设冗余

- **位置**：`packages/source/src/base-source.ts` —— `private async init()` 末尾 `this.inited = true` + 构造器 `this.initPromise = this.init().then(() => { this.inited = true; ... })`
- **问题**：`init()` 内 `await this.processData()` 后设 `inited=true`，构造器 `.then` cb 又设一次。双设冗余（无害，第二次是 no-op）。迁移前既有。**注意** `setData` 调 `init()` 但不经 `.then` cb（setData 用自己的 `.then` type:'update'），故 `init()` 内的 `inited=true` **不可删**（setData 路径依赖）。
- **建议**：4.1 保留不动（改之会动 `init()` 内部时序，违反零行为变化）。未来清理仅删构造器 `.then` cb 内的 `this.inited = true`（保留 emit），保留 `init()` 内的 true。低优先。
- **状态**：open（低优先清理，需同时验 setData 路径）
- **发现于**：阶段 4.1

### [阶段 4.x cleanup] `processData` 的 `new Promise` 同步包装无意义

- **位置**：`packages/source/src/base-source.ts` `private async processData()` —— `return new Promise((resolve, reject) => { try { this.executeParser(); this.clusterManager.init(this.data); this.executeTrans(); resolve({}); } catch (err) { reject(err); } })`
- **问题**：PLAN 诊断 #7 标「`processData` 用 `new Promise` 包同步代码无意义」—— executor 同步跑，executeParser/cluster init/executeTrans 全同步，Promise 包装把同步 throw 转 reject（异步化一拍）。4.1 不动（改之改变微任务时序：当前 `await this.processData()` 至少等一拍微任务；若去 Promise 直 sync，`init()` 的 `inited=true` 时序提前，可能影响 `'inited'` 事件相对其他微任务的顺序）。
- **建议**：未来清理需先核所有 `await init()` / `initPromise` / `.then` 消费方对「init 在微任务边界完成」的隐式依赖（layers 听 'inited' 事件 + 同 tick 其他 Promise）。若安全可改 `processData` 为直 sync throw 或 `async` + 直执行。低优先，收益小（去掉无意义包装），风险中（时序）。
- **状态**：open（低优先，需时序审计）
- **发现于**：阶段 4.1

### [流程] 新写 spec 文件须 `prettier --write` 预格式化

- **位置**：新增 `__tests__/**.spec.ts` 流程
- **问题**：4.1 `create-async.spec.ts` 写后 `prettier --check` 报 code style issues（行宽/缩进）。lint-staged pre-commit 会自动 `prettier --write` 修（无需手动 re-add，lint-staged 自动 re-stage），但提前 `--write` 可避免 commit 时「Applying modifications」的隐形改动、保持 pre-commit 验证与提交内容一致。
- **建议**：写完新 spec 后 `npx prettier --write <spec>` 再跑 jest/tsc/eslint，而非依赖 lint-staged 兜底。与 3.3「写 spec 后须重跑 tsc source」并列。
- **状态**：done（4.1 已实践，记档供后续）
- **发现于**：阶段 4.1

### [阶段 4.2] init 失败 hang→reject 行为变化（已实施，需发布说明）

- **位置**：`packages/layers/src/plugins/DataSourcePlugin.ts` init else 分支 `await source.ready`
- **问题**：4.2 把 source init 失败的 layer 行为从「静默 hang（`layer.init()` 永不 resolve）」改为「reject（`layer.init()` 抛错）」。这是 **strictly better**（hang 是最坏静默失败，reject 让错误 surface），但属 minor 级行为变化：若有上游 `await layer.init()` 不 catch 的点，会从「卡住」变「unhandled rejection」。
- **建议**：changeset 标 minor；发布说明提及「source init 失败不再静默 hang 而是 reject」。若后续发现上游不 catch 导致 regression，可在调用方加 catch + 日志（而非回退到 hang）。
- **状态**：done（4.2 已实施，记档供发布/changeset 参考）
- **发现于**：阶段 4.2

### [阶段 4.2 后续] BaseLayer.ts:1070 `layerSource.on('update')` — 评估结论：保持现状，不迁 `ready`

- **位置**：`packages/layers/src/core/BaseLayer.ts:1070`（`setSource` 内）—— `this.layerSource.on('update', ({ type }) => { ... if (type === 'update') this.sourceEvent() / tileLayer.reload(); if (type === 'inited') this.processRelativeCoordinates(); })`
- **评估结论**：**保持现状，不迁移 `source.ready`**。`ready` 是一次性 await 原语，不适合替换本处的双语义事件监听。三条具体理由：
  1. **同步 ordering 是 load-bearing**：`processRelativeCoordinates`（就地把 `data.dataArray` 转相对坐标）在 `'inited'` emit 时**同步**执行（EventEmitter 同步派发）。而 `base-source` 的 `initPromise = init().then(cb)` 中 cb 依次 `inited=true → emit('update',{type:'inited'}) → cb 返回 → initPromise resolve`。故 `DataSourcePlugin` 的 `await source.ready` 恢复（→ `updateClusterData`）严格**晚于** `processRelativeCoordinates`。改成 `ready.then(processRelativeCoordinates)` 会把 `processRelativeCoordinates` 推迟到 ready resolve 后的微任务 —— 在 DSP 路径虽依赖 `.then` 挂载序（setSource@16 先于 await@else），但**预 inited 路径**（外部 `data.type==='source'` 经 `source(:584)→setSource`，source 已 inited，走 `if(source.inited) sourceEvent()` 同步 fast-path）会从同步变异步，破坏 `sourceEvent` 内 autoFit/autoRender 的同步预期。同步 emit 保证不变量，`.then` 打破之。
  2. **双语义监听器不可拆**：`'inited'`（一次性）与 `'update'`（`setData` 反复触发）共用同一 attached handler。`ready` 一次性无法承接反复 `'update'`；只把 `'inited'` 拆出会变成「listener 听 update + ready.then 听 inited」两套机制，复杂度增、收益零。
  3. **`setSource` 是同步方法**：改 `await ready` 需异步化级联所有调用方（DSP:16、`source(:584)`）。
- **建议**：保持现状。若未来要统一，应先抽 source 生命周期抽象（one-shot `inited` + recurring `dataUpdate` 分离为两个明确事件），而非用 `ready` 混搭。
- **状态**：wontfix（已评估，保持现状）—— 评估完成记档，避免后续重复考据
- **发现于**：阶段 4.2，评估于阶段 4.2 后续

### [阶段 4.x cleanup] `setSource`/`destroy` 的 `off('update', this.sourceEvent)` 是空操作

- **位置**：
  - `packages/layers/src/core/BaseLayer.ts:1002`（destroy 前）—— `this.layerSource.off('update', this.sourceEvent)`
  - `packages/layers/src/core/BaseLayer.ts:1056`（`setSource` 替换旧 source 时）—— `this.layerSource.off('update', this.sourceEvent)`
  - 挂载点 `BaseLayer.ts:1070` —— `this.layerSource.on('update', ({ type }) => {...})` 是**inline arrow**，引用 ≠ `this.sourceEvent`
- **问题**：两处 `.off('update', this.sourceEvent)` 试图移除 `sourceEvent` handler，但 1070 实际挂的是 inline arrow（`(({type}) => {...})`），引用不匹配 → **off 永不命中，均为空操作**。inline listener 从不被显式移除，仅靠 source 被 GC 回收清掉。pre-existing refactor 残留（listener 曾是 `sourceEvent`，被内联后 off 引用未同步更新）。`'update'` 分支内部调 `this.sourceEvent()` 提示该内联曾是 `sourceEvent` 本体。
- **影响**：低风险 —— source 通常在 layer 销毁/替换时一并丢弃，listener 随之 GC；旧 source 被外部保留 + 继续 emit update 时才会触发已分离 layer 的 handler（边界场景）。非 4.2 引入，pre-existing。
- **建议**：cleanup 时① 把 1070 inline arrow 提取为 `this.onSourceUpdate = ({type}) => {...}` 实例方法，on/off 统一引用；或② 若内联逻辑确需保留，把 off 改为移除实际引用。低优先，需确认无其他代码依赖现状。
- **状态**：open（低优先清理）
- **发现于**：阶段 4.2 后续评估

### [阶段 4.5 / 未来 major] 移除 `cluster` transform 注册（`clusterTransform` wrapper 退役）

- **位置**：`packages/source/src/builtins.ts:68` `registry.registerTransform('cluster', clusterTransform)` + `packages/source/src/transform/cluster.ts` 的 `clusterTransform` wrapper
- **问题**：4.4 把 broken 的 `cluster` transform（Path B，`Object.assign` 腐蚀 `source.data`）改注册为 `clusterTransform` deprecation wrapper（warn + delegate 旧行为），保留向后兼容。但旧行为本身是 broken 的（delegate 仍腐蚀 data），wrapper 只是加 warn 不改 broken 本质。
- **建议**：未来 major 版本直接移除 `registerTransform('cluster', ...)` —— 届时 `transforms:[{type:'cluster'}]` → `TransformNotFoundError`（2.3 显式错误），彻底消灭 Path B。需同步更新 `parser-registry.spec.ts` 3 处断言（L92/130/141 的 'cluster' 从 transform 列表移除）。changeset 标 major，发布说明提及。
- **前置**：4.4 的 deprecation warn 已给消费方迁移信号（`transforms:[{type:'cluster'}]` → `cluster: true` cfg）。观察 1-2 个 minor 周期无人申诉后再 major 移除。
- **状态**：open（待 major 周期）
- **发现于**：阶段 4.4

### [阶段 5.1 scoping] relative-coordinates 迁出 source — Approach B 类型设计待决

- **位置**：`packages/source/src/utils/relative-coordinates.ts`（待迁出）→ 目标
  `@antv/l7-utils/src/relative-coordinates.ts`；消费方 `packages/layers/src/core/BaseLayer.ts:42`。
- **问题**：5.1 原 PLAN「迁 layers/utils + source type re-export 过渡」经依赖图勘探
  **部分推翻**（详见 PROGRESS [阶段 5.1 scoping]）：source↔layers 循环令 layers 目标 +
  re-export 过渡不可能；utils 目标须解耦 `IParseDataItem`（utils 无 l7 依赖、`core→utils`
  故 utils→core 循环）。推荐 **Approach B**：迁 utils + 解耦类型 + source re-export 过渡
  （minor-safe）。
- **待决（执行前须定）**：解耦后 4 函数 + `IRelativeCoordinateResult` 的类型设计 ——
  泛型 `<T extends {coordinates?: unknown}>` 还是本地 `IRelativeDataItem` minimal interface。
  `IRelativeCoordinateResult.dataArray` 现为 `IParseDataItem[]`，迁 utils 后变 `T[]` /
  `IRelativeDataItem[]`（公开 type 涟漪）—— `IRelativeCoordinateResult<T>` 默认值选取
  （无 core 依赖下无天然默认）或接受 `dataArray` type 收窄。须 tsc 验证 `IParseDataItem`
  与 minimal interface 结构兼容（IParseDataItem 无 index signature，minimal interface 须不含
  冲突必填字段，否则 `IParseDataItem[] → IRelativeDataItem[]` 赋值失败）。
- **建议**：执行 Approach B 时，先用本地 `IRelativeDataItem { coordinates?: unknown }`
  minimal interface（非泛型，ripple 最小），`IRelativeCoordinateResult.dataArray: IRelativeDataItem[]`。
  BaseLayer 消费 `result.dataArray`/`relativeOrigin`/`originalExtent` 均结构访问不受影响。
  source re-export `export { ... } from '@antv/l7-utils'` + `export type { ... }` 过渡一个 minor，
  未来 major 可移除 re-export（届时 `@antv/l7-source` 不再导出 relative-coordinates）。
- **状态**：scoping done（方案修订记 PLAN/PROGRESS）；执行待下一「继续」
- **发现于**：阶段 5.1 scoping
