# 重构进度记录

> 倒序排列（最新在最上）。每完成一步重构追加一条记录。

---

## 📍 下一步

**阶段 0.4**：合并 `parser/rasterRgb.ts` ↔ `parser/raster/rgb.ts`（同名 function `rasterRgb`），ndi 同理；统一为 `parser/rgb.ts`、`parser/ndi.ts`。

详见 [PLAN.md § 阶段 0.4](./PLAN.md)。完成后在本节下方追加记录，并更新「下一步」为 0.5。

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

## [阶段 0.3] 为 transform 加严格 cfg interface（commit 待回填）

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
