# 重构进度记录

> 倒序排列（最新在最上）。每完成一步重构追加一条记录。

---

## 📍 下一步

**阶段 2.4**：`package.json` 设 `sideEffects: false`，把当前 `index.ts` 的内置 parser/transform 注册显式化为 `registerBuiltins(registry = defaultRegistry)` 函数（保留旧 `index.ts` 自动注册行为以兼容，但明确分离 registration 入口）。验证 tree-shaking 友好性（消费方可通过 `new ParserRegistry()` + 自定义 `registerBuiltins` 子集，避免一次性拉满 13 个 parser）。注意阶段 2.5 `createSource(data, cfg, registry?)` 工厂落地后，`registerBuiltins` + registry 注入共同支持按需注册。详见 [PLAN.md § 阶段 2.4](./PLAN.md)。

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
