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
- **状态**：部分 done（阶段 3.1.1 `JsonTileLoader` 6 case、阶段 3.1.2 `MVTLoader` 6 case、阶段 3.1.3 `GeoJSONVTLoader` 6 case —— 阶段 3.1 收尾，三个瓦片矢量 loader 全覆盖；阶段 3.2.1 `RasterTileLoader` 6 case —— raster 分发器单测建立；阶段 3.3 `ImageLoader` 7 case —— image.ts parser 去 fetch，含「永不 resolve」失败语义锁定）；剩余 raster-tile 的 4 小 loader 拆分（3.2.2，边际收益）待配套各自单测
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
