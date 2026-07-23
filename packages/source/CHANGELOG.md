# Change Log

## 2.30.0-beta.0

### Minor Changes

- [#2882](https://github.com/antvis/L7/pull/2882) [`cd654c1`](https://github.com/antvis/L7/commit/cd654c1c16610636a2986e0ffd4ed2224930fc7f) Thanks [@lzxue](https://github.com/lzxue)! - refactor(source): extract ParserRegistry class + defaultRegistry singleton (stage 2.2)

  将 factory.ts 模块级 PARSERS/TRANSFORMS 可变对象抽到
  ParserRegistry class + defaultRegistry 单例. 对外 API 完全等价,
  旧 getParser/registerParser/getTransform/registerTransform
  4 函数保留为 defaultRegistry 薄转发 wrapper (加 @deprecated).

  - 新增 parser-registry.ts (45 行):
    - ParserRegistry class 持有 parsers/transforms 两个
      Record<string, X> 私有字典 (替代旧模块级可变对象)
    - 公开方法: registerParser / registerTransform /
      getParser / getTransform
    - getParser 返回 Parser (不带 | undefined): 与迁移前
      PARSERS[type] 在 noUncheckedIndexedAccess: false 下语义一致
      调用方仍可链式 getParser('geojson')({...}), 无 null 守卫回归
    - 导出 defaultRegistry: ParserRegistry = new ParserRegistry()
      单例, 由 index.ts 模块初始化时注册内置 parser/transform
  - 重写 factory.ts (47 -> 37 行):
    - 删除内部 PARSERS/TRANSFORMS 字典与字面量私有类型
    - 4 函数保留为 defaultRegistry 的 @deprecated 转发 wrapper
    - export { ParserRegistry, defaultRegistry } from
      './parser-registry' 让消费者从 factory 入口也可拿到 class
  - index.ts (46 -> 55 行): 单行 export 改多行 export 块,
    显式 re-export ParserRegistry 与 defaultRegistry, 外部可从
    @antv/l7-source 包入口拿到这两个新 API

  设计取舍:

  - 用对象字典而非 Map: Map.get() 返 T | undefined 会破坏
    getParser(type)(arg) 链式调用, Record<string, X> 在
    noUncheckedIndexedAccess: false 下保持原 X 不带 undefined
  - PARSERS 与 TRANSFORMS 合并到一个 class: registry 边界统一,
    阶段 2.5 createSource(data, cfg, registry?) 工厂可注入单个
    registry 同时承载 parser/transform
  - TransformFn 保持字面量类型 (data, cfg?) => IParserData,
    Transform<TIn,TCfg,TOut> 契约抽取留阶段 2.x (BACKLOG)
  - 保留 getParser(type): Parser 不返 | undefined: 阶段 2.3 才
    改抛 ParserNotFoundError, 本阶段严格行为等价

  验证: source tsc 31 基线不变 (全 core .glsl 噪音),
  layers tsc 229 不变, eslint/prettier 通过,
  source jest 27/27 通过 (factory 运行期经 index.ts 仍正确注册
  内置 parser/transform 到 defaultRegistry 单例, 调用路径不变).

  详见 docs/refactoring/source/PROGRESS.md 阶段 2.2. 下一步阶段 2.3
  ParserNotFoundError + getParser 未注册改抛错.

- [#2882](https://github.com/antvis/L7/pull/2882) [`cd654c1`](https://github.com/antvis/L7/commit/cd654c1c16610636a2986e0ffd4ed2224930fc7f) Thanks [@lzxue](https://github.com/lzxue)! - refactor(source): extract registerBuiltins() + tighten sideEffects whitelist (stage 2.4)

  把 index.ts 顶层 13 registerParser + 6 registerTransform 收敛为
  单一 registerBuiltins(registry = defaultRegistry) 函数; package.json
  sideEffects 从 true 收紧为白名单 ["./es/index.js"] (沿用 packages/layers
  约定). 对外 API 完全等价, 默认 import { Source } 仍自动注册全 13 内置
  parser, 运行期 0 行为变化.

  - 新增 builtins.ts (74): export function registerBuiltins(registry:
    ParserRegistry = defaultRegistry): void, 13 parser + 6 transform
    集中注册; 参数默认 defaultRegistry 单例, 传自定义 new ParserRegistry()
    可隔离注册表 (按需子集化 / 测试隔离)
  - index.ts (57 -> 29, -28): 删 13 parser default import + 6 transform
    named import (下沉 builtins.ts), 保留 rasterDataTypes named import
    (包公共 re-export); 19 行 registerParser/registerTransform 收敛为
    单行 registerBuiltins(); export 块新增 registerBuiltins
  - package.json: "sideEffects": true -> ["./es/index.js"]. 仅 index
    入口标副作用, 其余子路径 (es/parser-registry.js, es/builtins.js,
    es/parser/*.js 等) 对 bundler 视作 tree-shakeable
  - **tests**/parser-registry.spec.ts (+3 tests): registerBuiltins
    在 fresh registry 上注册全 13 + 6; 无参默认走 defaultRegistry 幂等;
    fresh registry 与单例独立 (not.toBe)

  设计取舍:

  - 偏离 PLAN 字面 sideEffects: false, 改用白名单 ["./es/index.js"]:
    index.ts 模块顶层仍调 registerBuiltins() 写入 defaultRegistry 单例,
    设 false 是对 bundler 撒谎, 会致 registerBuiltins() 被 tree-shake,
    new Source({type:'csv'}) 在消费方抛 ParserNotFoundError (致命回归).
    白名单既保 index.ts 副作用被尊重 (零行为回归), 又明示其余子路径
    tree-shakeable. 沿用 packages/layers 既有约定 (同场景同方案).
    严格 sideEffects: false 需移除 index.ts 自动注册, 破坏
    import { Source } 零配置契约, 与对外 API 完全兼容原则相悖,
    留未来 major 版本评估 (BACKLOG)
  - registerBuiltins 独立 builtins.ts 而非并入 parser-registry.ts:
    parser-registry.ts 保持 registry 机制单一职责 (97 行: class +
    2 错误类); builtins.ts 依赖全部 13 parser + 6 transform 实现,
    职责分离让 parser-registry.ts 不被 19 import 污染, 保持子路径
    import 时 tree-shake 友好 (消费方经 @antv/l7-source/es/parser-registry
    拿 ParserRegistry 时不被迫拉满 13 parser)
  - registerBuiltins 不放 factory.ts: factory.ts 是 defaultRegistry
    薄转发 wrapper 弃用入口 (4 函数均 @deprecated), 把依赖 13 parser
    实现的 registerBuiltins 放进去破坏 thin wrapper 定位且让 factory.ts
    不再 tree-shakeable. 从 index.ts 直接 re-export ./builtins 更清晰
  - 保留 export { registerParser, registerTransform } from './factory':
    阶段 2.5 createSource 工厂落地前, 外部仍可能 registerParser('custom',
    fn) 注册自定义 parser 到 defaultRegistry (旧 API), 保留兼容入口

  向后兼容: 默认 import { Source } from '@antv/l7-source' 触发 index.ts
  副作用调用 registerBuiltins() 自动注册全 13 内置 parser, 与迁移前
  等价. monorepo grep 6 处 @antv/l7-source import 全走默认入口 (无子路径),
  0 风险. tree-shaking 真正收益仅在消费方不走 index.ts/builtins.ts,
  自行 new ParserRegistry() + 手工 registerParser 子集时获得; 阶段 2.5
  createSource(data, cfg, registry?) 工厂落地后此模式成为对外正式能力.

  验证: source tsc 31 / layers tsc 229 / l7 tsc 346 全基线不变 (全 core
  .glsl 噪音, 无 source/src/{index,builtins,factory,parser-registry}.ts
  新错), eslint/prettier 通过, source jest 40/40 通过 (旧 37 + 新 3).

  详见 docs/refactoring/source/PROGRESS.md 阶段 2.4. 下一步阶段 2.5
  createSource(data, cfg, registry?) 工厂可选注入 registry.

- [#2882](https://github.com/antvis/L7/pull/2882) [`cd654c1`](https://github.com/antvis/L7/commit/cd654c1c16610636a2986e0ffd4ed2224930fc7f) Thanks [@lzxue](https://github.com/lzxue)! - refactor(source): add createSource factory + registry injection (stage 2.5)

  新增 createSource(data, cfg, registry?) 工厂 + Source 构造器可选注入
  registry 第 3 参 (默认 defaultRegistry 单例). base-source 的 executeParser /
  executeTrans 与 ClusterManager 改走注入的 registry.getParser/getTransform
  而非旧全局 getParser/getTransform 函数 —— 全链路 registry 注入闭环.
  对外 API 完全兼容: 所有既有 new Source(data, cfg) 调用零行为变化.

  - create-source.ts (新, 33 行): export function createSource(data:
    any | Source, cfg?, registry = defaultRegistry): Source, 函数式
    包装 new Source(data, cfg, registry). 推荐入口, 便于未来扩展 (默认
    cfg 合并 / registry 校验 / 异步初始化钩子) 而不破坏构造器兼容签名
  - base-source.ts (+13): 加 parser-registry import (替 factory 的
    getParser/getTransform); 加 private readonly registry 字段
    (默认 defaultRegistry); 构造器增第 3 参 registry = defaultRegistry
    注入并传给 ClusterManager; executeParser/executeTrans 改
    this.registry.getParser/getTransform
  - cluster-manager.ts (+9): 同 parser-registry import; 构造器第 3 参
    registry = defaultRegistry; getParser('geojson') 改
    this.registry.getParser('geojson'). 聚合 re-parse 与 Source 共用
    同一注入 registry
  - index.ts (+1): export { createSource } from './create-source'
  - **tests**/create-source.spec.ts (新, 71 行, 5 tests): factory 返
    Source 实例; factory ≡ new Source 等价; 默认 registry cluster
    端到端; jest.spyOn(customRegistry,'getParser') 证明 Source +
    ClusterManager 全链路走注入的 registry (parser + cluster re-parse);
    自定义 registry 状态与单例隔离 (custom-only type 不污染 default)

  设计取舍:

  - 构造器增可选第 3 参而非新子类: registry = defaultRegistry 默认参
    让所有既有 new Source(data, cfg) 调用零行为变化. createSource 仅
    函数式包装, 无新类继承. monorepo grep 仅 1 处 new Source(data,
    options) in packages/layers/src/plugins/DataSourcePlugin.ts:15 +
    9 处测试, 全 new Source(data, cfg?) 无第 3 参, 100% 向后兼容
  - cluster-manager 共享同一注入 registry: base-source 构造 cluster-manager
    时传 registry, 保证 cluster re-parse 也走注入的 registry (不仅
    executeParser/executeTrans). spec 用 spy 验 updateClusterData(2)
    后 spy 调用次数增加
  - create-source.ts 独立文件不并入 factory.ts: factory.ts 是 @deprecated
    wrapper 入口 (4 函数均弃用); createSource 是新推荐入口, 职责分离
  - factory.ts 4 个 @deprecated wrapper 不动: getParser/registerParser/
    getTransform/registerTransform 全局函数仍 re-export (外部可能
    registerParser('custom', fn) 注册自定义 parser), base-source/
    cluster-manager 不再用但保留出口

  向后兼容: registry 省略走 defaultRegistry 单例 (index.ts 经
  registerBuiltins() 自动注册全 13 内置 parser), 与迁移前 new Source(data,
  cfg) 完全等价. 注入自定义 new ParserRegistry() 可隔离注册表 (按需子集
  tree-shaking / 测试隔离 / 多源异构 parser 集合), 阶段 2.4 抽出的
  registerBuiltins(myRegistry) 全量注册 或 手工 registerParser 子集注册
  均可用.

  验证: source tsc 31 / jest 45/45 (旧 40 + 新 5) / eslint / prettier
  全通过. 无 layers/l7 tsc 回归 (registry 默认参对调用方零影响).

  详见 docs/refactoring/source/PROGRESS.md 阶段 2.5. 下一步阶段 3
  Parser 与 Loader 解耦 (触及瓦片生命周期).

- refactor(source): async lifecycle 新公开 API — Source.create / ready / dataVersion / error 事件（阶段 4）

  阶段 4 异步生命周期重构引入 4 个新公开 API，纯叠加，旧 new Source(data, cfg) 路径零行为变化：

  - `Source.create(data, cfg?)` 异步工厂（4.1）：内部 await init 完成后返回，消除 `source.data` 可能为
    undefined 的竞态。旧 `new Source` fire-and-forget 初始化保留不变。
  - `source.ready: Promise<void>` 只读属性（4.1）：resolve 时 `inited === true` 且数据已解析；init 失败
    时 reject。消费方可 `await source.ready` 取代手写 `'update' {type:'inited'}` 监听。
  - `source.dataVersion: number`（4.3a）：单调递增数据 generation 计数器，setData /
    updateFeaturePropertiesById 后 +1，updateClusterData 不 bump，构造期首次解析为 0。
  - `'error'` 事件（4.3b）：setData 触发的 re-parse / cluster / transform 失败时 emit，payload 为错误
    对象。旧版本失败静默 hang，现为显式 surfacing（无监听即静默，eventemitter3 无 Node error 抛错语义）。

  行为修复（strictly-better，非回归）：

  - 4.2 修复 premature-resolve bug：DataSourcePlugin 迁移 `await source.ready`，消除旧
    `'update' {type:'inited'}` 监听器因 emit 时序可能错过的竞态。
  - 4.4 `transforms: [{ type: 'cluster' }]` 标 `@deprecated`（运行时 warn 一次但仍工作）；
    `cluster: true` 顶层配置走 ClusterManager 直调路径，零 warning。

  详见 docs/refactoring/source/PROGRESS.md 阶段 4.1 / 4.2 / 4.3a / 4.3b / 4.4。

- refactor(source): Source.stats() 只读快照 + ISourceStats 类型（阶段 6.4）

  新增 `Source.stats(): ISourceStats` 只读快照方法，收敛原本分散在 `data.dataArray.length` /
  `extent` getter / `getParserType()` / `tileset.currentTiles` 四处的调试与 size 监控信息为一次调用：

  - `ISourceStats` 7 字段：`rows` / `bbox` / `parserType` / `tileCount` / `isTile` / `cluster` /
    `dataVersion`。类型经 `export * from './interface'` 由包入口透出。
  - 纯只读，不改 Source 状态；init 未完成 / 取数未触发时用 `?? 0` / `|| 'geojson'` 兜底，仅返回默认值。
  - 纯增量 API，未触及 ISource 核心契约，未加 deprecation，对 new Source / Source.create / setData
    路径零行为变化。

  详见 docs/refactoring/source/PROGRESS.md 阶段 6.4。

### Patch Changes

- [#2882](https://github.com/antvis/L7/pull/2882) [`cd654c1`](https://github.com/antvis/L7/commit/cd654c1c16610636a2986e0ffd4ed2224930fc7f) Thanks [@lzxue](https://github.com/lzxue)! - refactor(source): dedupe interface types with @antv/l7-core via re-export

  将 source/interface.ts 中与 @antv/l7-core 重复的 7 个类型改为 re-export，
  单一来源收敛到 core。纯 type-only 变更，运行时无影响。

  - 重复类型：DataType / IDictionary / IFeatureKey / IJsonData / IJsonItem /
    IParseDataItem / IParserData
  - 保留 source 专有类型原地定义（栅格波段运算、瓦片数据源等）
  - IRasterCfg 因 core 版本不完整暂保留，后续统一

  详见 docs/refactoring/source/PROGRESS.md 阶段 0.1。

- [#2882](https://github.com/antvis/L7/pull/2882) [`cd654c1`](https://github.com/antvis/L7/commit/cd654c1c16610636a2986e0ffd4ed2224930fc7f) Thanks [@lzxue](https://github.com/lzxue)! - refactor(source): fix misspellings in private members (stage 0.2)

  私有方法/局部参数重命名，无对外 API 影响：

  - base-source.ts: excuteParser → executeParser (private)
  - base-source.ts: caculClusterExtent → calcClusterExtent (private)
  - factory.ts: registerTransform 参数 transFunction → transformFn
    （改为 transformFn 而非 transformFunction，避免与已有类型别名同名遮蔽）

  详见 docs/refactoring/source/PROGRESS.md 阶段 0.2。

- [#2882](https://github.com/antvis/L7/pull/2882) [`cd654c1`](https://github.com/antvis/L7/commit/cd654c1c16610636a2986e0ffd4ed2224930fc7f) Thanks [@lzxue](https://github.com/lzxue)! - refactor(source): add strict cfg interfaces for transforms (stage 0.3)

  为 5 个内置 transform（filter/map/join/grid/hexagon）新增严格 cfg interface，
  内部 narrow 到具体类型获得推导。运行时零变化，ITransform index signature
  保留作过渡兼容。

  - 新增 src/transform/types.ts: StatMethod + 6 个 cfg interface
  - filter/map/join/grid/hexagon: 内部 const cfg = option as IXxxCfg
  - cluster 已用 Partial<IClusterOptions>, 未动

  详见 docs/refactoring/source/PROGRESS.md 阶段 0.3。

- [#2882](https://github.com/antvis/L7/pull/2882) [`cd654c1`](https://github.com/antvis/L7/commit/cd654c1c16610636a2986e0ffd4ed2224930fc7f) Thanks [@lzxue](https://github.com/lzxue)! - refactor(source): flatten parser/raster subdir and fix function names (stage 0.4)

  扁平化 parser/raster 子目录 + 修正复制粘贴遗留的函数名:

  - parser/raster/rgb.ts -> parser/rgb.ts, 函数名 rasterRgb -> rgb
  - parser/raster/ndi.ts -> parser/ndi.ts, 函数名 rasterRgb -> ndi
  - parser/rasterRgb.ts (注册名 rasterRgb) 保持不变, 功能与 rgb/ndi 各异
  - index.ts 更新 import 路径

  注: 三个 raster*Rgb parser 注册名/功能均不同, 非重复代码,
  本次仅命名/位置整理, 运行时无影响, 27/27 单测通过。

  详见 docs/refactoring/source/PROGRESS.md 阶段 0.4。

- [#2882](https://github.com/antvis/L7/pull/2882) [`cd654c1`](https://github.com/antvis/L7/commit/cd654c1c16610636a2986e0ffd4ed2224930fc7f) Thanks [@lzxue](https://github.com/lzxue)! - refactor(source): rename source/ to tile-source/ and rename classes (stage 0.6)

  重命名 `src/source/` 目录为 `src/tile-source/`（实为「瓦片数据源」)，
  两个同名 `VectorSource` class 拆分为语义清晰的名字，对外 API 完全兼容：

  - `git mv` 保留历史:
    - source/vector.ts -> tile-source/mvt.ts, class VectorSource -> MVTSource
    - source/geojsonvt.ts -> tile-source/geojsonvt.ts, class VectorSource -> GeoJSONVTTileSource
    - source/index.ts -> tile-source/index.ts (重写为兼容别名导出)
  - `git rm source/baseSource.ts`（抽象类死代码, 无继承者）
  - tile-source/index.ts: 导出 MVTSource / GeoJSONVTTileSource，
    保留 `VectorSource` 作 @deprecated 兼容别名 (= MVTSource)
  - src/index.ts: export * from './tile-source/index'
  - 3 个 parser (mvt/geojsonvt/jsonTile) 更新 import 路径与 new 的类名

  兼容性:

  - layers 包 `import type { VectorSource } from '@antv/l7-source'`
    (packages/layers/src/tile/tile/VectorTile.ts) 经兼容别名仍可用, 零改动
  - VectorSource 正式移除留待阶段 7 (届时同步 layers 改用 MVTSource)

  验证: source tsc 0 错(基线 31 不变)、layers tsc 229 pre-existing 无新增、
  prettier 通过、jest 27/27 通过。

  详见 docs/refactoring/source/PROGRESS.md 阶段 0.6。

- [#2882](https://github.com/antvis/L7/pull/2882) [`cd654c1`](https://github.com/antvis/L7/commit/cd654c1c16610636a2986e0ffd4ed2224930fc7f) Thanks [@lzxue](https://github.com/lzxue)! - refactor(source): extract ClusterManager delegate from base-source (stage 1.1)

  从 base-source.ts God Class 抽出 cluster 状态机到独立 ClusterManager
  delegate，对外 API 完全等价（ISource 接口不动）。

  - 新增 src/cluster-manager.ts (138 行): 封装 Supercluster 索引 +
    clusterOptions + init/updateData/getClusters/getClustersLeaves/calcExtent
  - base-source.ts (358 -> 314 行, -44):
    - cluster/clusterOptions 字段 -> accessor 透明转发 delegate
    - 删除 clusterIndex 字段，getClusters*/updateClusterData 改转发
    - initCluster/calcClusterExtent 删除，processData 改调
      clusterManager.init
    - destroy 改调 clusterManager.destroy

  设计要点:

  - 构造期 new ClusterManager 注入 extent/invalidExtent getter 闭包，
    delegate 不拥有 extent 状态 (留待阶段 1.4 抽 Bounds)
  - updateClusterData 拆成 delegate.updateData 返回 IParserData +
    Source 转发赋值并 executeTrans，delegate 与 transform 链解耦
  - 未启用 cluster 时 getClusters/updateClusterData 仍抛 TypeError
    (index 为 null)，与原行为一致，不加额外 guard

  兼容性: layers 包 source.cluster / source.clusterOptions.zoom /
  source.updateClusterData() 零改动继续可用。

  验证: source tsc 0 错 (基线 31 不变)，layers tsc 229 pre-existing
  无新增，eslint/prettier 通过，jest 27/27 通过 (source.spec.ts 的
  cluster case 覆盖 updateClusterData 路径)。

  详见 docs/refactoring/source/PROGRESS.md 阶段 1.1。

- [#2882](https://github.com/antvis/L7/pull/2882) [`cd654c1`](https://github.com/antvis/L7/commit/cd654c1c16610636a2986e0ffd4ed2224930fc7f) Thanks [@lzxue](https://github.com/lzxue)! - refactor(source): extract TilesetAdapter delegate from base-source (stage 1.2)

  从 base-source.ts 抽出瓦片管理职责到独立 TilesetAdapter delegate，
  对外 API 完全等价（ISource 接口不动）。

  - 新增 src/tileset-adapter.ts (88 行): 封装 TilesetManager 实例的
    创建/更新/销毁 + 7 个 reload/getTile 转发方法
  - base-source.ts (314 -> 306, -8):
    - tileset/isTile 字段 -> getter 转发 adapter.manager/.isTile
    - 删除 initTileset(), executeParser 改调 tilesetAdapter.init
    - 7 个 reload*/getTile* 方法实现体改为转发 adapter
    - destroy 改调 tilesetAdapter.destroy

  关键设计: adapter.manager 必须 public —— layers/tile/core/BaseLayer.ts
  直接读 source.tileset as TilesetManager 后自由操作实例 (update/on/
  destroy/tiles.filter/currentTiles)。getter 转发 adapter.manager
  让 layers 拿到同一个 TilesetManager 实例, 行为完全等价。

  tileset/isTile 从字段改 getter only: ISource 接口字段契约由 getter
  满足；Source 内部不再写 this.tileset/this.isTile (改调 adapter.init)。
  isTile 不主动重置, 与原 initTileset 行为一致。reloadTilebyId 沿用
  原小写 b 拼写避免破坏接口。

  验证: source tsc 0 错 (基线 31 不变), layers tsc 229 pre-existing
  无新增, eslint/prettier 通过, source jest 27/27 通过, source+layers
  jest 81 passed/1 skipped/0 failed (瓦片图层运行时路径覆盖)。

  详见 docs/refactoring/source/PROGRESS.md 阶段 1.2。

- [#2882](https://github.com/antvis/L7/pull/2882) [`cd654c1`](https://github.com/antvis/L7/commit/cd654c1c16610636a2986e0ffd4ed2224930fc7f) Thanks [@lzxue](https://github.com/lzxue)! - refactor(source): extract FeatureIndex delegate from base-source (stage 1.3)

  从 base-source.ts 抽出 feature 查询/更新职责到独立 FeatureIndex
  delegate，对外 API 完全等价（ISource 接口不动）。

  - 新增 src/feature-index.ts (115 行): 封装 getFeatureById /
    getFeatureId / updateFeaturePropertiesById + dataArrayChanged 状态
    - 构造期注入 5 个 getter 闭包 (parser/cluster/originData/
      transforms/data) 延迟读取 Source 状态, 不持有 Source 引用
    - dataArrayChanged private 自持, setData 调 reset() 重置
  - base-source.ts (306 -> 290, -16):
    - 删 dataArrayChanged 字段
    - 3 方法体收敛为转发: getFeatureById/getFeatureId 直转,
      updateFeaturePropertiesById 转 delegate + 保留 emit('update')
    - setData 的 dataArrayChanged = false -> featureIndex.reset()
    - import 清理: cloneDeep 移到 feature-index, mergeWith 保留

  设计取舍:

  - emit('update') 留在 Source 转发端, delegate 不持有 EventEmitter
  - getFeatureById 的 cloneDeep 与 'null' 越界占位保留原行为
  - dataArrayChanged 不暴露 getter, delegate 内部闭环

  验证: source tsc 0 错 (基线 31 不变), layers tsc 229 pre-existing
  无新增 (LayerPickService getFeatureById 转发仍 work), eslint/prettier
  通过, source jest 27/27 通过。

  详见 docs/refactoring/source/PROGRESS.md 阶段 1.3。

- [#2882](https://github.com/antvis/L7/pull/2882) [`cd654c1`](https://github.com/antvis/L7/commit/cd654c1c16610636a2986e0ffd4ed2224930fc7f) Thanks [@lzxue](https://github.com/lzxue)! - refactor(source): extract Bounds value object from base-source (stage 1.4)

  从 base-source.ts 抽出数据范围 / 中心点计算职责到独立 Bounds
  value object, 对外 API 完全等价 (ISource 接口不动)。

  - 新增 src/bounds.ts (50 行): 封装 extent / center / invalidExtent
    三态 + update(bbox) 原子写入
    - update 合并原 executeParser 末尾三行 (extent 计算 + setCenter
      - invalidExtent 判定)
    - setCenter 含 NaN -> 大地原点兜底, 保留原行为
  - base-source.ts (290 -> 292, +2 行):
    - 删 public extent / public center / private invalidExtent 三字段
    - 删 private setCenter 方法 (搬到 Bounds)
    - 加 private readonly bounds: Bounds = new Bounds() + 3 getter
      (extent/center/invalidExtent) 转发 bounds
    - executeParser 末尾三行收敛为 this.bounds.update(extent(...))
    - ClusterManager 构造闭包: () => this.extent ->
      () => this.bounds.extent, this.invalidExtent ->
      this.bounds.invalidExtent

  设计取舍:

  - getter 转发保留 ISource.extent/center 可读语义, 外部直读不变
  - invalidExtent 同样 getter 转发 (private 原本就仅 ClusterManager 用)
  - 行数微增 (290 -> 292) 因新增 3 个 getter + import + 字段块注释,
    但原 executeParser/setCenter 的 ~12 行实现搬到 Bounds, base-source
    状态写入从分散 3 处收敛为 1 处原子更新
  - 阶段 1 拆解 base-source.ts: 358 -> 292 行 (含 4 delegate, 未达
    PLAN 估 ~120 协调者目标, 实际阶段 1 收益 -66 行)

  验证: source tsc 0 错 (基线 31 不变, 全是 core .glsl 噪音),
  layers tsc 229 pre-existing 不变 (ClusterManager 闭包转发仍 work),
  eslint/prettier 通过, source jest 27/27 通过。

  详见 docs/refactoring/source/PROGRESS.md 阶段 1.4。阶段 1 拆解
  God Class 完赛, 下一步进入阶段 2 Parser 接口标准化。

- [#2882](https://github.com/antvis/L7/pull/2882) [`cd654c1`](https://github.com/antvis/L7/commit/cd654c1c16610636a2986e0ffd4ed2224930fc7f) Thanks [@lzxue](https://github.com/lzxue)! - refactor(source): define Parser contract + dedupe raster parser types (stage 2.1)

  定义统一 Parser 函数契约, 为阶段 2.2 ParserRegistry class 与
  2.3 ParserNotFoundError 铺路. 对外 API 完全等价 (新增类型, 无运行时改动).

  - interface.ts (102 -> 200, +98):
    - 新增 export type Parser<TData, TCfg, TResult extends IParserData>
      = (data: TData, cfg?: TCfg) => TResult 统一 parser 契约
    - 新增 export interface KnownParsers: 13 内置 parser
      (csv/geojson/.../testTile) 注册键名 -> Parser 契约 映射
    - 新增 export type KnownParserType = keyof KnownParsers
    - 去重: RasterDataType / IRGBParseCfg 从 parser/rgb.ts 与
      parser/ndi.ts (两份完全相同的定义) 收敛到 interface.ts 单一来源
      - 闭环 BACKLOG: 独立小项 RasterDataType / IRGBParseCfg 重复定义
    - 去重: IImageCfg 从 parser/image.ts 收敛到 interface.ts
      (image.ts 改 import 转发, 无外部使用)
    - 新增 import type: IJsonData/IParserCfg/ITileParserCFG (core),
      ITileBand/RequestParameters (utils), FeatureCollection/Geometries/
      Properties (@turf/helpers) - 全 import type 无运行时副作用
  - factory.ts (18 -> 47, +29):
    - type ParserFunction = Parser (替代字面量函数类型), 导入 Parser 契约
      - 契约的类型擦除版本 (Parser<any, any, IParserData>), 按 string 分发
    - 新增模块头注释, 指明阶段 2.2/2.3/2.4 演进路径
  - parser/rgb.ts (27 -> 6, -21): 删本地 RasterDataType/IRGBParseCfg,
    import from interface
  - parser/ndi.ts (26 -> 5, -21): 同上
  - parser/image.ts: 删本地 IImageCfg 定义, import from interface;
    RequestParameters 因 loadData 仍用而保留 type import

  设计取舍:

  - Parser 用 type 别名 而非 PLAN 字面的 interface (call signature 等价)
  - cfg? 在契约里是 optional (与现状一致); 预先隔离 TS 严格模式实测
    required-cfg 的具名 parser (csv) 可赋值到 Parser<any, any>, 兼容
    13 个 parser 文件无需改签名. 这是 "兼容擦除" 演进路径, ParserRegistry<K>
    在阶段 2.2 才使 cfg 形状参与类型推导
  - KnownParsers 是弱契约, 不参与 tsc 检查 parser 实现 (实现由本地签名
    保证). 强制对齐留阶段 2.2 ParserRegistry<K extends KnownParserType>
  - 去重 IImageCfg/RasterDataType/IRGBParseCfg 是顺手闭环: 仅内部使用,
    grep 确认无外部 importers, 单一化定义不破坏跨包消费

  验证: source tsc 31 基线不变 (全 core .glsl 噪音), layers tsc 229
  不变 (layers 不见直接 import 去重类型), eslint/prettier 通过,
  source jest 27/27 通过.

  详见 docs/refactoring/source/PROGRESS.md 阶段 2.1. 下一步阶段 2.2
  ParserRegistry class + defaultRegistry 单例 + 旧 getParser 等
  函数作 wrapper 保留.

- [#2882](https://github.com/antvis/L7/pull/2882) [`cd654c1`](https://github.com/antvis/L7/commit/cd654c1c16610636a2986e0ffd4ed2224930fc7f) Thanks [@lzxue](https://github.com/lzxue)! - refactor(source): getParser/getTransform throw on unregistered (stage 2.3)

  getParser/getTransform 未注册时改抛 ParserNotFoundError /
  TransformNotFoundError (替代迁移前返回 undefined -> 调用方残报
  TypeError 的延迟语义). 对已注册路径 0 影响, 对外签名保持
  Parser / TransformFn 不带 | undefined, 调用方链式调用零变更.

  - parser-registry.ts (45 -> 97):
    - 新增 ParserNotFoundError extends Error (含 readonly type 字段,
      name='ParserNotFoundError'), 仿 utils/ajax.ts 的 AJAXError 风格
      (target es6 下 extends Error 原型链无需 setPrototypeOf 修补)
    - 新增 TransformNotFoundError extends Error: 与 ParserNotFoundError
      对称, 覆盖 transform 注册表等价错误路径
    - getParser(type): 内部取 Record<string,Parser>[type] (运行期可能
      undefined), undefined 即抛 ParserNotFoundError(type); 签名保持
      : Parser (不带 | undefined) - 抛错路径由 Error 表达, 调用方
      仍可链式 getParser('geojson')({...}) 无 null 守卫
    - getTransform(type): 对称抛 TransformNotFoundError(type),
      签名保持 : TransformFn
  - factory.ts (37 -> 45): export 块新增 ParserNotFoundError /
    TransformNotFoundError, 4 个 @deprecated wrapper 经
    defaultRegistry 转发自动享受抛错语义, 无函数体改动
  - index.ts (55 -> 57): export 块新增两个错误类, 包入口暴露
    (消费方可 catch e instanceof ParserNotFoundError)
  - 新增 **tests**/parser-registry.spec.ts (100 行 / 10 tests):
    fresh new ParserRegistry() 抛 ParserNotFoundError /
    TransformNotFoundError (含 name/type/message/instanceof Error
    断言); registerParser/registerTransform 后 getParser/getTransform
    返回原引用; defaultRegistry (import '../src' 触发 index.ts 副作用)
    含全部 13 parser + 6 transform, 未注册 type 抛命名错误

  设计取舍:

  - 偏离 PLAN 字面方案 (getParser 返 Parser | undefined 配合 orThrow):
    或版本会要求调用方加 null 守卫, 破坏 cluster-manager.ts:102
    getParser('geojson')({...}) 与 base-source.ts:266/288 链式调用,
    与严格行为等价相悖. 改为 getParser 直接抛错签名保持 Parser:
    未注册路径由 Error 表达 (替代旧 undefined -> TypeError),
    已注册路径 0 影响, tsc 链式推断全友好. Parser | undefined +
    tryGet* 变体若后续真有探测需求再加, 本阶段不预留 API surface (YAGNI)
  - TransformNotFoundError 单独定义而非复用: parser 与 transform 是
    两条独立注册表, 错误类型隔离便于 catch 精确分支处理, 不牺牲复杂度
  - 错误类放 parser-registry.ts 而非新 errors.ts: 当前 source 包仅
    此一个领域错误, 独立 errors.ts 过度分层; 后续 Source 层引入更多
    领域错误再抽 errors.ts 收口 (BACKLOG 跨阶段评估)

  向后兼容: 迁移前未注册 parser 在 base-source/cluster-manager 调用链
  下表现为 undefined(...) -> TypeError: xxx is not a function
  (运行期延迟报错); 迁移后改抛命名 ParserNotFoundError (注册表边界
  即时报错). 正常使用 (已注册 13 内置 type) 0 影响, jest 27/27 既有
  测试全过即证. grep l7 monorepo 无第三方依赖 getParser(unknown) 返
  undefined 做能力探测的用法.

  验证: source tsc 31 基线不变, layers tsc 229 不变,
  eslint/prettier 通过, source jest 37/37 通过 (旧 27 + 新 10).

  详见 docs/refactoring/source/PROGRESS.md 阶段 2.3. 下一步阶段 2.4
  sideEffects: false + registerBuiltins() 抽取 index.ts 副作用.

- [#2882](https://github.com/antvis/L7/pull/2882) [`cd654c1`](https://github.com/antvis/L7/commit/cd654c1c16610636a2986e0ffd4ed2224930fc7f) Thanks [@lzxue](https://github.com/lzxue)! - refactor(source): extract JsonTileLoader from jsonTile parser (stage 3.1.1)

  阶段 3.1 (Parser 与 Loader 解耦) 第一步增量: 把 jsonTile parser 的
  模块级 getVectorTile 闭包机械抽取为实现 TileLoader 接口的 JsonTileLoader
  类. parser 只组装 tilesetOptions.getTileData = (p, t) => loader.loadTile(p,
  t). 行为与迁移前 100% 等价 (getCustomData 优先, 否则 getData 回调取数;
  err/无数据 resolve 空 defaultLayer 的 GeoJSONVTTileSource, 永不 reject).

  - 新增 src/loader/tile-loader.ts (26 行): TileLoader 接口
    loadTile(params, tile): Promise<ITileSource | undefined>. 接口签名
    undefined 化以兼容 mvt 失败时 resolve undefined 的既有路径 (jsonTile/
    geojsonvt 始终 resolve ITileSource, undefined 是合法但不使用的值)
  - 新增 src/loader/json-tile-loader.ts (84 行): JsonTileLoader implements
    TileLoader. 构造器持 url / requestParameters? / getCustomData?;
    loadTile 内含原 getVectorTile 函数体 (机械搬运, 零行为改动). 保持
    jsonTile 历史行为: 忽略 TileLoadParams (第一参 _), 用 SourceTile.x/y/z
    生成 url 模板参数 + getCustomData 入参. 不设 tile.xhrCancel (原 jsonTile
    无取消逻辑)
  - parser/jsonTile.ts (83 -> 30, -53): 删 getVectorTile 闭包 + 5 个相关
    import (getData / getURLFromTemplate / GeoJSONVTTileSource /
    MapboxVectorTile / RequestParameters 悉数下沉到 loader); import JsonTileLoader,
    构造 loader, getTileData 委托 loader.loadTile. default export 签名
    jsonTile(url, cfg) => IParserData 不变, registry 注册 (registerParser
    ('jsonTile', jsonTile) in builtins.ts) 零影响
  - 新增 **tests**/loader/json-tile-loader.spec.ts (110 行, 6 tests): 文件级
    jest.mock('@antv/l7-utils') (getData / getURLFromTemplate), 首次为瓦片
    加载器建立单元测试网 (source 包此前 0 瓦片 parser/loader 单测). 6 case
    覆盖: getData 成功 (断言 getURLFromTemplate 入参 + getData URL 模板插值 +
    src.getTileData('defaultLayer') === features) / getData err / getData 空
    数据 / getCustomData 成功 (断言走 getCustomData 不走 getData + features) /
    getCustomData err / requestParameters 透传 headers

  设计取舍:

  - 接口签名 Promise<ITileSource | undefined> 而非 Promise<ITileSource>:
    mvt 的 getVectorTile 失败时 resolve undefined (与迁移前等价,
    tileset-manager 状态机已处理 undefined). 用 ITileSource 会让 mvt loader
    被迫改 resolve 空 tile (行为变更, 违反渐进等价原则). jsonTile loader 始终
    resolve ITileSource, Promise<ITileSource> 协变赋值给 Promise<ITileSource
    | undefined>, 零类型回归 (mvt 已是 | undefined 且 layers tsc 229 基线不变)
  - jest.mock('@antv/l7-utils') 文件级 mock 而非 DI 注入 fetch:
    保持 loader 生产代码与抽取前 100% 字面等价 (直接 import getData /
    getURLFromTemplate), 测试通过 jest 模块 mock 注入桩. 避免 DI 让 loader 构造
    签名多一个 fetch 参数, 偏离「机械抽取」原则. mock 文件级隔离, 不影响其他
    spec
  - getTileData 返回类型从 Promise<ITileSource> 扩宽到 Promise<ITileSource
    | undefined>: 经 mvt 已验证 | undefined 是 tilesetOptions.getTileData
    合法返回值, 扩宽后 layers tsc 229 基线不变. 运行时 jsonTile loader 始终
    resolve 非 undefined, 0 行为变化
  - 下沉 5 个 import 到 loader, parser 只留 IParserData / ITileParserCFG /
    TileLoadParams / SourceTile 类型 import + JsonTileLoader:
    parser/jsonTile.ts 职责收敛为「组装 tilesetOptions 指向 loader」, 纯调度

  向后兼容: jsonTile default export 签名 + registry 注册 + tilesetOptions
  结构 ({...cfg, getTileData}) 全不变. 消费方 import { Source } from
  '@antv/l7-source' 走 index.ts 自动注册, new Source({type:'jsonTile', ...})
  行为与迁移前等价.

  风险: 阶段 3.1 触及瓦片生命周期 ⚠️. source 包此前 0 瓦片 parser 单测,
  本增量首次为 JsonTileLoader 建立单元测试网 (6 case 覆盖 fetch 成功/失败/
  自定义数据 + 参数透传). 后续 MVTLoader / GeoJSONVTLoader 抽取 (3.1.2 /
  3.1.3) 应沿用同 jest.mock('@antv/l7-utils') 模式补 loader 单测 (记 BACKLOG:
  瓦片 parser/loader 单测覆盖缺口).

  验证: source tsc 31 / layers tsc 229 / source jest 51/51 (旧 45 + 新 6
  loader) / eslint / prettier 全通过.

  详见 docs/refactoring/source/PROGRESS.md 阶段 3.1.1. 下一步阶段 3.1.2
  MVTLoader 抽取 (含 tile.xhrCancel 取消语义).

- refactor(source): loader 解耦 + relative-coordinates 迁出 + transform 不可变 + 测试补强（阶段 3 / 5 / 6.1-6.3）

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

- Updated dependencies []:
  - @antv/l7-core@2.30.0-beta.0
  - @antv/l7-utils@2.30.0-beta.0

## 2.29.1

### Patch Changes

- chore: upgrade deprecated dependencies and pnpm to v11
- Updated dependencies []:
  - @antv/l7-core@2.29.1
  - @antv/l7-utils@2.29.1

## 2.28.14

### Patch Changes

- Release 2.28.14.

- Updated dependencies []:
  - @antv/l7-core@2.28.14
  - @antv/l7-utils@2.28.14

## 2.28.13

### Patch Changes

- Release 2.28.13.

- Updated dependencies []:
  - @antv/l7-core@2.28.13
  - @antv/l7-utils@2.28.13

## 2.28.12

### Patch Changes

- Updated dependencies []:
  - @antv/l7-core@2.28.12
  - @antv/l7-utils@2.28.12

## 2.25.9

### Patch Changes

- fix: revert to version 2.25.4 and fix text rendering issue

- Updated dependencies []:
  - @antv/l7-core@2.25.9
  - @antv/l7-utils@2.25.9

## 2.25.4

### Patch Changes

- Updated dependencies []:
  - @antv/l7-core@2.25.4
  - @antv/l7-utils@2.25.4

## 2.23.3-beta.3

### Patch Changes

- Updated dependencies []:
  - @antv/l7-core@2.23.3-beta.3
  - @antv/l7-utils@2.23.3-beta.3

## 2.23.3-beta.2

### Patch Changes

- Updated dependencies []:
  - @antv/l7-core@2.23.3-beta.2
  - @antv/l7-utils@2.23.3-beta.2

## 2.23.3-beta.1

### Patch Changes

- 版本更新

- Updated dependencies []:
  - @antv/l7-utils@2.23.3-beta.1
  - @antv/l7-core@2.23.3-beta.1

## 2.23.3-beta.0

### Patch Changes

- [`8248e26`](https://github.com/antvis/L7/commit/8248e264c6cad611547c7f9730540ab0729115ac) Thanks [@lzxue](https://github.com/lzxue)! - patch 版本

- Updated dependencies [[`8248e26`](https://github.com/antvis/L7/commit/8248e264c6cad611547c7f9730540ab0729115ac)]:
  - @antv/l7-utils@2.23.3-beta.0
  - @antv/l7-core@2.23.3-beta.0

## 2.23.2

### Patch Changes

- [`a3e9a44`](https://github.com/antvis/L7/commit/a3e9a440e43030a297ee8dd32aabb32c10624e7d) Thanks [@lzxue](https://github.com/lzxue)! - rename source

- Updated dependencies [[`a3e9a44`](https://github.com/antvis/L7/commit/a3e9a440e43030a297ee8dd32aabb32c10624e7d)]:
  - @antv/l7-core@2.23.2
  - @antv/l7-utils@2.23.2

## 2.23.1

### Patch Changes

- [`7932838`](https://github.com/antvis/L7/commit/79328384d8b1deb547ff2422aaa4366201dfe9b2) Thanks [@lzxue](https://github.com/lzxue)! - 更新demo

- [`4f690b8`](https://github.com/antvis/L7/commit/4f690b837a322bc9923baf2b387ea43d37ba1e5d) Thanks [@lzxue](https://github.com/lzxue)! - 移动端事件

- Updated dependencies [[`7932838`](https://github.com/antvis/L7/commit/79328384d8b1deb547ff2422aaa4366201dfe9b2), [`4f690b8`](https://github.com/antvis/L7/commit/4f690b837a322bc9923baf2b387ea43d37ba1e5d)]:
  - @antv/l7-utils@2.23.1
  - @antv/l7-core@2.23.1

## 2.22.6

### Patch Changes

- [#2726](https://github.com/antvis/L7/pull/2726) [`c357dc8`](https://github.com/antvis/L7/commit/c357dc8520e1d3f53af60e4a325096da2d4e223c) Thanks [@lzxue](https://github.com/lzxue)! - 相对坐标系支持

- Updated dependencies [[`c357dc8`](https://github.com/antvis/L7/commit/c357dc8520e1d3f53af60e4a325096da2d4e223c)]:
  - @antv/l7-core@2.22.6
  - @antv/l7-utils@2.22.6

## 2.22.5

### Patch Changes

- [#2680](https://github.com/antvis/L7/pull/2680) [`42134f3`](https://github.com/antvis/L7/commit/42134f3aac3f2814e167bedca3c84b98766ebd6e) Thanks [@XinyueDu](https://github.com/XinyueDu)! - update version

- Updated dependencies [[`42134f3`](https://github.com/antvis/L7/commit/42134f3aac3f2814e167bedca3c84b98766ebd6e)]:
  - @antv/l7-core@2.22.5
  - @antv/l7-utils@2.22.5

## 2.22.4

### Patch Changes

- [#2631](https://github.com/antvis/L7/pull/2631) [`8a9413f`](https://github.com/antvis/L7/commit/8a9413fa842397d7eb2beae18e896ffddc9abdf4) Thanks [@lzxue](https://github.com/lzxue)! - raster tile extent

- Updated dependencies [[`8a9413f`](https://github.com/antvis/L7/commit/8a9413fa842397d7eb2beae18e896ffddc9abdf4)]:
  - @antv/l7-core@2.22.4
  - @antv/l7-utils@2.22.4

## 2.22.3

### Patch Changes

- Updated dependencies []:
  - @antv/l7-core@2.22.3
  - @antv/l7-utils@2.22.3

## 2.22.2

### Patch Changes

- [#2631](https://github.com/antvis/L7/pull/2631) [`8a9413f`](https://github.com/antvis/L7/commit/8a9413fa842397d7eb2beae18e896ffddc9abdf4) Thanks [@lzxue](https://github.com/lzxue)! - raster tile extent

- Updated dependencies [[`8a9413f`](https://github.com/antvis/L7/commit/8a9413fa842397d7eb2beae18e896ffddc9abdf4)]:
  - @antv/l7-core@2.22.2
  - @antv/l7-utils@2.22.2

## 2.22.1

### Patch Changes

- Updated dependencies []:
  - @antv/l7-core@2.22.1
  - @antv/l7-utils@2.22.1

## 2.22.0

### Patch Changes

- Updated dependencies [[`ce90571`](https://github.com/antvis/L7/commit/ce90571ba77686790b2476936b9466657e187ae8), [`ce90571`](https://github.com/antvis/L7/commit/ce90571ba77686790b2476936b9466657e187ae8)]:
  - @antv/l7-core@2.22.0
  - @antv/l7-utils@2.22.0

## 2.21.11-beta.7

### Patch Changes

- Updated dependencies []:
  - @antv/l7-core@2.21.11-beta.7
  - @antv/l7-utils@2.21.11-beta.7

## 2.21.11-beta.6

### Patch Changes

- Updated dependencies []:
  - @antv/l7-core@2.21.11-beta.6
  - @antv/l7-utils@2.21.11-beta.6

## 2.21.11-beta.5

### Patch Changes

- Updated dependencies []:
  - @antv/l7-core@2.21.11-beta.5
  - @antv/l7-utils@2.21.11-beta.5

## 2.21.11-beta.4

### Patch Changes

- Updated dependencies []:
  - @antv/l7-core@2.21.11-beta.4
  - @antv/l7-utils@2.21.11-beta.4

## 2.21.11-beta.3

### Patch Changes

- Updated dependencies [[`a5f57ed`](https://github.com/antvis/L7/commit/a5f57eda52dab160fe076f252ad52cd51b8f456a)]:
  - @antv/l7-core@2.21.11-beta.3
  - @antv/l7-utils@2.21.11-beta.3

## 2.21.11-beta.2

### Patch Changes

- Updated dependencies []:
  - @antv/l7-core@2.21.11-beta.2
  - @antv/l7-utils@2.21.11-beta.2

## 2.21.11-beta.1

### Patch Changes

- Updated dependencies []:
  - @antv/l7-core@2.21.11-beta.1
  - @antv/l7-utils@2.21.11-beta.1

## 2.21.11-beta.0

### Patch Changes

- Updated dependencies []:
  - @antv/l7-core@2.21.11-beta.0
  - @antv/l7-utils@2.21.11-beta.0

## 2.21.10

### Patch Changes

- Updated dependencies []:
  - @antv/l7-core@2.21.10
  - @antv/l7-utils@2.21.10

## 2.21.9

### Patch Changes

- Updated dependencies []:
  - @antv/l7-core@2.21.9
  - @antv/l7-utils@2.21.9

## 2.21.8

### Patch Changes

- Updated dependencies []:
  - @antv/l7-core@2.21.8
  - @antv/l7-utils@2.21.8

## 2.21.7

### Patch Changes

- [#2420](https://github.com/antvis/L7/pull/2420) [`bb0af05`](https://github.com/antvis/L7/commit/bb0af057acafeeafd7eb52224ff2863c4a1c302a) Thanks [@lzxue](https://github.com/lzxue)! - fix regl bool uniform

- Updated dependencies [[`bb0af05`](https://github.com/antvis/L7/commit/bb0af057acafeeafd7eb52224ff2863c4a1c302a)]:
  - @antv/l7-core@2.21.7
  - @antv/l7-utils@2.21.7

## 2.21.6

### Patch Changes

- [#2412](https://github.com/antvis/L7/pull/2412) [`6c38e3c`](https://github.com/antvis/L7/commit/6c38e3c57b1c1bf876b05199f114f5324cbe070f) Thanks [@lvisei](https://github.com/lvisei)! - fix: 修复 arraybuffer 类型数据自定义请求头参数透传逻辑

- Updated dependencies []:
  - @antv/l7-core@2.21.6
  - @antv/l7-utils@2.21.6

## 2.21.5

### Patch Changes

- Updated dependencies []:
  - @antv/l7-core@2.21.5
  - @antv/l7-utils@2.21.5

## 2.21.4

### Patch Changes

- [#2399](https://github.com/antvis/L7/pull/2399) [`f1b8c29`](https://github.com/antvis/L7/commit/f1b8c295c44d15f75ce0f60401cf03cc79e9d96b) Thanks [@Dreammy23](https://github.com/Dreammy23)! - fix: 修复 rastertile 类型对应请求无法自定义请求头参数

- Updated dependencies []:
  - @antv/l7-core@2.21.4
  - @antv/l7-utils@2.21.4

## [2.1.12](https://github.com/antvis/L7/compare/v2.1.11...v2.1.12) (2020-04-10)

**Note:** Version bump only for package @antv/l7-source

## [2.1.11](https://github.com/antvis/L7/compare/v2.1.10...v2.1.11) (2020-04-07)

**Note:** Version bump only for package @antv/l7-source

## [2.1.8](https://github.com/antvis/L7/compare/v2.1.7...v2.1.8) (2020-03-26)

**Note:** Version bump only for package @antv/l7-source

## [2.1.7](https://github.com/antvis/L7/compare/v2.1.6...v2.1.7) (2020-03-26)

**Note:** Version bump only for package @antv/l7-source

## [2.1.5](https://github.com/antvis/L7/compare/v2.1.4...v2.1.5) (2020-03-20)

**Note:** Version bump only for package @antv/l7-source

## [2.1.3](https://github.com/antvis/L7/compare/v2.0.36...v2.1.3) (2020-03-17)

**Note:** Version bump only for package @antv/l7-source

## [2.1.2](https://github.com/antvis/L7/compare/v2.0.36...v2.1.2) (2020-03-15)

**Note:** Version bump only for package @antv/l7-source

## [2.1.1](https://github.com/antvis/L7/compare/v2.0.36...v2.1.1) (2020-03-15)

**Note:** Version bump only for package @antv/l7-source

## [2.0.34](https://github.com/antvis/L7/compare/v2.0.32...v2.0.34) (2020-03-02)

**Note:** Version bump only for package @antv/l7-source

# [2.0.0-beta.28](https://github.com/antvis/L7/compare/v2.0.0-beta.16...v2.0.0-beta.28) (2020-01-02)

### Bug Fixes

- mapbox token 校验问题 ([6c1f934](https://github.com/antvis/L7/commit/6c1f93425676c5baad90e464b3915068ba4157e2))
- source 聚合方法接口定义问题 ([27bdd02](https://github.com/antvis/L7/commit/27bdd02e76f3374b3e1568553ca20455ee7c1511))
- **lint:** igonre lint test data lint ([1782893](https://github.com/antvis/L7/commit/178289348a26586b1ccbc8f75baa3b7312693a8c))
- **parser:** fix multipolygom parser ([2ad8c9f](https://github.com/antvis/L7/commit/2ad8c9f0a858f1eb1015a20b267d66c4478caf2d))
- **scene:** contianer resize ([1c3be82](https://github.com/antvis/L7/commit/1c3be82711999b70a802a7f0c24ff9ccf76e2d94))

### Features

- **source:** add join transfroms ([ec3cae2](https://github.com/antvis/L7/commit/ec3cae2f5fd0491a895cf4ba3953da94b5af2c84))
- **source:** wip cluster ([3203959](https://github.com/antvis/L7/commit/320395942499b4123de2155d20ff6cecec6100b9))
- **source render:** source transfrom, layer event ([27a09a7](https://github.com/antvis/L7/commit/27a09a7a7a79b50598af22a0de18b062d60afcac))

# [2.0.0-beta.27](https://github.com/antvis/L7/compare/v2.0.0-beta.16...v2.0.0-beta.27) (2020-01-01)

### Bug Fixes

- mapbox token 校验问题 ([6c1f934](https://github.com/antvis/L7/commit/6c1f93425676c5baad90e464b3915068ba4157e2))
- source 聚合方法接口定义问题 ([27bdd02](https://github.com/antvis/L7/commit/27bdd02e76f3374b3e1568553ca20455ee7c1511))
- **lint:** igonre lint test data lint ([1782893](https://github.com/antvis/L7/commit/178289348a26586b1ccbc8f75baa3b7312693a8c))
- **parser:** fix multipolygom parser ([2ad8c9f](https://github.com/antvis/L7/commit/2ad8c9f0a858f1eb1015a20b267d66c4478caf2d))
- **scene:** contianer resize ([1c3be82](https://github.com/antvis/L7/commit/1c3be82711999b70a802a7f0c24ff9ccf76e2d94))

### Features

- **source:** add join transfroms ([ec3cae2](https://github.com/antvis/L7/commit/ec3cae2f5fd0491a895cf4ba3953da94b5af2c84))
- **source:** wip cluster ([3203959](https://github.com/antvis/L7/commit/320395942499b4123de2155d20ff6cecec6100b9))
- **source render:** source transfrom, layer event ([27a09a7](https://github.com/antvis/L7/commit/27a09a7a7a79b50598af22a0de18b062d60afcac))

# [2.0.0-alpha.28](https://github.com/antvis/L7/compare/v2.0.0-beta.16...v2.0.0-alpha.28) (2020-01-01)

### Bug Fixes

- mapbox token 校验问题 ([6c1f934](https://github.com/antvis/L7/commit/6c1f93425676c5baad90e464b3915068ba4157e2))
- source 聚合方法接口定义问题 ([27bdd02](https://github.com/antvis/L7/commit/27bdd02e76f3374b3e1568553ca20455ee7c1511))
- **lint:** igonre lint test data lint ([1782893](https://github.com/antvis/L7/commit/178289348a26586b1ccbc8f75baa3b7312693a8c))
- **parser:** fix multipolygom parser ([2ad8c9f](https://github.com/antvis/L7/commit/2ad8c9f0a858f1eb1015a20b267d66c4478caf2d))
- **scene:** contianer resize ([1c3be82](https://github.com/antvis/L7/commit/1c3be82711999b70a802a7f0c24ff9ccf76e2d94))

### Features

- **source:** add join transfroms ([ec3cae2](https://github.com/antvis/L7/commit/ec3cae2f5fd0491a895cf4ba3953da94b5af2c84))
- **source:** wip cluster ([3203959](https://github.com/antvis/L7/commit/320395942499b4123de2155d20ff6cecec6100b9))
- **source render:** source transfrom, layer event ([27a09a7](https://github.com/antvis/L7/commit/27a09a7a7a79b50598af22a0de18b062d60afcac))

# [2.0.0-alpha.27](https://github.com/antvis/L7/compare/v2.0.0-beta.16...v2.0.0-alpha.27) (2019-12-31)

### Bug Fixes

- mapbox token 校验问题 ([6c1f934](https://github.com/antvis/L7/commit/6c1f93425676c5baad90e464b3915068ba4157e2))
- source 聚合方法接口定义问题 ([27bdd02](https://github.com/antvis/L7/commit/27bdd02e76f3374b3e1568553ca20455ee7c1511))
- **lint:** igonre lint test data lint ([1782893](https://github.com/antvis/L7/commit/178289348a26586b1ccbc8f75baa3b7312693a8c))
- **parser:** fix multipolygom parser ([2ad8c9f](https://github.com/antvis/L7/commit/2ad8c9f0a858f1eb1015a20b267d66c4478caf2d))
- **scene:** contianer resize ([1c3be82](https://github.com/antvis/L7/commit/1c3be82711999b70a802a7f0c24ff9ccf76e2d94))

### Features

- **source:** add join transfroms ([ec3cae2](https://github.com/antvis/L7/commit/ec3cae2f5fd0491a895cf4ba3953da94b5af2c84))
- **source:** wip cluster ([3203959](https://github.com/antvis/L7/commit/320395942499b4123de2155d20ff6cecec6100b9))
- **source render:** source transfrom, layer event ([27a09a7](https://github.com/antvis/L7/commit/27a09a7a7a79b50598af22a0de18b062d60afcac))

# [2.0.0-beta.26](https://github.com/antvis/L7/compare/v2.0.0-beta.16...v2.0.0-beta.26) (2019-12-30)

### Bug Fixes

- mapbox token 校验问题 ([6c1f934](https://github.com/antvis/L7/commit/6c1f93425676c5baad90e464b3915068ba4157e2))
- source 聚合方法接口定义问题 ([27bdd02](https://github.com/antvis/L7/commit/27bdd02e76f3374b3e1568553ca20455ee7c1511))
- **lint:** igonre lint test data lint ([1782893](https://github.com/antvis/L7/commit/178289348a26586b1ccbc8f75baa3b7312693a8c))
- **parser:** fix multipolygom parser ([2ad8c9f](https://github.com/antvis/L7/commit/2ad8c9f0a858f1eb1015a20b267d66c4478caf2d))
- **scene:** contianer resize ([1c3be82](https://github.com/antvis/L7/commit/1c3be82711999b70a802a7f0c24ff9ccf76e2d94))

### Features

- **source:** add join transfroms ([ec3cae2](https://github.com/antvis/L7/commit/ec3cae2f5fd0491a895cf4ba3953da94b5af2c84))
- **source:** wip cluster ([3203959](https://github.com/antvis/L7/commit/320395942499b4123de2155d20ff6cecec6100b9))
- **source render:** source transfrom, layer event ([27a09a7](https://github.com/antvis/L7/commit/27a09a7a7a79b50598af22a0de18b062d60afcac))

# [2.0.0-beta.25](https://github.com/antvis/L7/compare/v2.0.0-beta.16...v2.0.0-beta.25) (2019-12-27)

### Bug Fixes

- mapbox token 校验问题 ([6c1f934](https://github.com/antvis/L7/commit/6c1f93425676c5baad90e464b3915068ba4157e2))
- source 聚合方法接口定义问题 ([27bdd02](https://github.com/antvis/L7/commit/27bdd02e76f3374b3e1568553ca20455ee7c1511))
- **lint:** igonre lint test data lint ([1782893](https://github.com/antvis/L7/commit/178289348a26586b1ccbc8f75baa3b7312693a8c))
- **parser:** fix multipolygom parser ([2ad8c9f](https://github.com/antvis/L7/commit/2ad8c9f0a858f1eb1015a20b267d66c4478caf2d))
- **scene:** contianer resize ([1c3be82](https://github.com/antvis/L7/commit/1c3be82711999b70a802a7f0c24ff9ccf76e2d94))

### Features

- **source:** add join transfroms ([ec3cae2](https://github.com/antvis/L7/commit/ec3cae2f5fd0491a895cf4ba3953da94b5af2c84))
- **source:** wip cluster ([3203959](https://github.com/antvis/L7/commit/320395942499b4123de2155d20ff6cecec6100b9))
- **source render:** source transfrom, layer event ([27a09a7](https://github.com/antvis/L7/commit/27a09a7a7a79b50598af22a0de18b062d60afcac))

# [2.0.0-beta.24](https://github.com/antvis/L7/compare/v2.0.0-beta.16...v2.0.0-beta.24) (2019-12-23)

### Bug Fixes

- mapbox token 校验问题 ([6c1f934](https://github.com/antvis/L7/commit/6c1f93425676c5baad90e464b3915068ba4157e2))
- source 聚合方法接口定义问题 ([27bdd02](https://github.com/antvis/L7/commit/27bdd02e76f3374b3e1568553ca20455ee7c1511))
- **lint:** igonre lint test data lint ([1782893](https://github.com/antvis/L7/commit/178289348a26586b1ccbc8f75baa3b7312693a8c))
- **parser:** fix multipolygom parser ([2ad8c9f](https://github.com/antvis/L7/commit/2ad8c9f0a858f1eb1015a20b267d66c4478caf2d))
- **scene:** contianer resize ([1c3be82](https://github.com/antvis/L7/commit/1c3be82711999b70a802a7f0c24ff9ccf76e2d94))

### Features

- **source:** add join transfroms ([ec3cae2](https://github.com/antvis/L7/commit/ec3cae2f5fd0491a895cf4ba3953da94b5af2c84))
- **source:** wip cluster ([3203959](https://github.com/antvis/L7/commit/320395942499b4123de2155d20ff6cecec6100b9))
- **source render:** source transfrom, layer event ([27a09a7](https://github.com/antvis/L7/commit/27a09a7a7a79b50598af22a0de18b062d60afcac))

# [2.0.0-beta.23](https://github.com/antvis/L7/compare/v2.0.0-beta.16...v2.0.0-beta.23) (2019-12-23)

### Bug Fixes

- mapbox token 校验问题 ([6c1f934](https://github.com/antvis/L7/commit/6c1f93425676c5baad90e464b3915068ba4157e2))
- source 聚合方法接口定义问题 ([27bdd02](https://github.com/antvis/L7/commit/27bdd02e76f3374b3e1568553ca20455ee7c1511))
- **lint:** igonre lint test data lint ([1782893](https://github.com/antvis/L7/commit/178289348a26586b1ccbc8f75baa3b7312693a8c))
- **parser:** fix multipolygom parser ([2ad8c9f](https://github.com/antvis/L7/commit/2ad8c9f0a858f1eb1015a20b267d66c4478caf2d))
- **scene:** contianer resize ([1c3be82](https://github.com/antvis/L7/commit/1c3be82711999b70a802a7f0c24ff9ccf76e2d94))

### Features

- **source:** add join transfroms ([ec3cae2](https://github.com/antvis/L7/commit/ec3cae2f5fd0491a895cf4ba3953da94b5af2c84))
- **source:** wip cluster ([3203959](https://github.com/antvis/L7/commit/320395942499b4123de2155d20ff6cecec6100b9))
- **source render:** source transfrom, layer event ([27a09a7](https://github.com/antvis/L7/commit/27a09a7a7a79b50598af22a0de18b062d60afcac))

# [2.0.0-beta.21](https://github.com/antvis/L7/compare/v2.0.0-beta.16...v2.0.0-beta.21) (2019-12-18)

### Bug Fixes

- mapbox token 校验问题 ([6c1f934](https://github.com/antvis/L7/commit/6c1f93425676c5baad90e464b3915068ba4157e2))
- source 聚合方法接口定义问题 ([27bdd02](https://github.com/antvis/L7/commit/27bdd02e76f3374b3e1568553ca20455ee7c1511))
- **lint:** igonre lint test data lint ([1782893](https://github.com/antvis/L7/commit/178289348a26586b1ccbc8f75baa3b7312693a8c))
- **parser:** fix multipolygom parser ([2ad8c9f](https://github.com/antvis/L7/commit/2ad8c9f0a858f1eb1015a20b267d66c4478caf2d))
- **scene:** contianer resize ([1c3be82](https://github.com/antvis/L7/commit/1c3be82711999b70a802a7f0c24ff9ccf76e2d94))

### Features

- **source:** add join transfroms ([ec3cae2](https://github.com/antvis/L7/commit/ec3cae2f5fd0491a895cf4ba3953da94b5af2c84))
- **source:** wip cluster ([3203959](https://github.com/antvis/L7/commit/320395942499b4123de2155d20ff6cecec6100b9))
- **source render:** source transfrom, layer event ([27a09a7](https://github.com/antvis/L7/commit/27a09a7a7a79b50598af22a0de18b062d60afcac))

# [2.0.0-beta.20](https://github.com/antvis/L7/compare/v2.0.0-beta.16...v2.0.0-beta.20) (2019-12-12)

### Bug Fixes

- **lint:** igonre lint test data lint ([1782893](https://github.com/antvis/L7/commit/178289348a26586b1ccbc8f75baa3b7312693a8c))
- **parser:** fix multipolygom parser ([2ad8c9f](https://github.com/antvis/L7/commit/2ad8c9f0a858f1eb1015a20b267d66c4478caf2d))
- **scene:** contianer resize ([1c3be82](https://github.com/antvis/L7/commit/1c3be82711999b70a802a7f0c24ff9ccf76e2d94))

### Features

- **source:** add join transfroms ([ec3cae2](https://github.com/antvis/L7/commit/ec3cae2f5fd0491a895cf4ba3953da94b5af2c84))
- **source:** wip cluster ([3203959](https://github.com/antvis/L7/commit/320395942499b4123de2155d20ff6cecec6100b9))
- **source render:** source transfrom, layer event ([27a09a7](https://github.com/antvis/L7/commit/27a09a7a7a79b50598af22a0de18b062d60afcac))

# [2.0.0-beta.19](https://github.com/antvis/L7/compare/v2.0.0-beta.16...v2.0.0-beta.19) (2019-12-08)

### Bug Fixes

- **lint:** igonre lint test data lint ([1782893](https://github.com/antvis/L7/commit/178289348a26586b1ccbc8f75baa3b7312693a8c))
- **parser:** fix multipolygom parser ([2ad8c9f](https://github.com/antvis/L7/commit/2ad8c9f0a858f1eb1015a20b267d66c4478caf2d))
- **scene:** contianer resize ([1c3be82](https://github.com/antvis/L7/commit/1c3be82711999b70a802a7f0c24ff9ccf76e2d94))

### Features

- **source:** wip cluster ([3203959](https://github.com/antvis/L7/commit/320395942499b4123de2155d20ff6cecec6100b9))

# [2.0.0-beta.18](https://github.com/antvis/L7/compare/v2.0.0-beta.16...v2.0.0-beta.18) (2019-12-08)

### Bug Fixes

- **lint:** igonre lint test data lint ([1782893](https://github.com/antvis/L7/commit/178289348a26586b1ccbc8f75baa3b7312693a8c))
- **parser:** fix multipolygom parser ([2ad8c9f](https://github.com/antvis/L7/commit/2ad8c9f0a858f1eb1015a20b267d66c4478caf2d))
- **scene:** contianer resize ([1c3be82](https://github.com/antvis/L7/commit/1c3be82711999b70a802a7f0c24ff9ccf76e2d94))

### Features

- **source:** wip cluster ([3203959](https://github.com/antvis/L7/commit/320395942499b4123de2155d20ff6cecec6100b9))

# [2.0.0-beta.17](https://github.com/antvis/L7/compare/v2.0.0-beta.16...v2.0.0-beta.17) (2019-12-08)

### Bug Fixes

- **lint:** igonre lint test data lint ([1782893](https://github.com/antvis/L7/commit/178289348a26586b1ccbc8f75baa3b7312693a8c))
- **parser:** fix multipolygom parser ([2ad8c9f](https://github.com/antvis/L7/commit/2ad8c9f0a858f1eb1015a20b267d66c4478caf2d))
- **scene:** contianer resize ([1c3be82](https://github.com/antvis/L7/commit/1c3be82711999b70a802a7f0c24ff9ccf76e2d94))

### Features

- **source:** wip cluster ([3203959](https://github.com/antvis/L7/commit/320395942499b4123de2155d20ff6cecec6100b9))

# [2.0.0-beta.16](https://github.com/antvis/L7/compare/v2.0.0-beta.15...v2.0.0-beta.16) (2019-11-29)

**Note:** Version bump only for package @antv/l7-source

# [2.0.0-beta.15](https://github.com/antvis/L7/compare/v2.0.0-beta.14...v2.0.0-beta.15) (2019-11-29)

**Note:** Version bump only for package @antv/l7-source

# [2.0.0-beta.13](https://github.com/antvis/L7/compare/v2.0.0-beta.12...v2.0.0-beta.13) (2019-11-28)

**Note:** Version bump only for package @antv/l7-source

# [2.0.0-beta.12](https://github.com/antvis/L7/compare/v2.0.0-beta.11...v2.0.0-beta.12) (2019-11-28)

### Bug Fixes

- **component:** fix marker ([14d4818](https://github.com/antvis/L7/commit/14d48184a1579241b077110ed51a8358de25e010))

# 2.0.0-beta.11 (2019-11-28)

### Bug Fixes

- **demo:** bugs ([5a857f9](https://github.com/antvis/L7/commit/5a857f9c1b707c91cbc07b0fc4878be3fe56011b))
- **doc:** file name lowercase ([3cbdc9c](https://github.com/antvis/L7/commit/3cbdc9c7f1d9be34e9c917f05531323946993eb4))
- **fix css:** fix css png ([f7e5376](https://github.com/antvis/L7/commit/f7e5376b7d6c64b2b078dca8f2a230f4fce14c68))
- **merge:** fix conflict ([07e8505](https://github.com/antvis/L7/commit/07e85059ebd40506623253feb624ee3083f393ae))
- **packages:** remove sub modules node_modules ([132b99e](https://github.com/antvis/L7/commit/132b99e4d2bef7ec5565a0b18c5659e8b246944b))
- **rm cache:** rm cache ([51ea07e](https://github.com/antvis/L7/commit/51ea07ea664229f775b7c191cfde68299cc8c2d5))

### Features

- **add point demo:** add demo ([90f6945](https://github.com/antvis/L7/commit/90f6945feb4818842c6231f5b5683db6cda15a73))
- **chart:** add chart demo ([2a19b07](https://github.com/antvis/L7/commit/2a19b07c1bca7dfbf191618f15ab06a18c262148))
- **component:** add layer control ([7f4646e](https://github.com/antvis/L7/commit/7f4646efd3b0004fde4e9f6860e618c7668af1a7))
- **component:** add scale ,zoom, popup, marker map method ([a6baef4](https://github.com/antvis/L7/commit/a6baef4954c11d9c6582c27de2ba667f18538460))
- **core:** add map method ([853c190](https://github.com/antvis/L7/commit/853c1901fbb8559a9d3bdb3631ec13a7dcaf0ea7))
- **layer:** add imagelayer ([a995815](https://github.com/antvis/L7/commit/a995815284652ca5d6e013c547b617fa52039ddc))
- **layer:** add point line polygon image layer ([54f28be](https://github.com/antvis/L7/commit/54f28be495af94a39313b7840c69725be16dc1e2))
- **layers:** add heatmap layer ([e04b3b2](https://github.com/antvis/L7/commit/e04b3b268b9fdc4bea150d2db1fdaae227f51fc8))
