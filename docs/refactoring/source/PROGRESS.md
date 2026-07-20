# 重构进度记录

> 倒序排列（最新在最上）。每完成一步重构追加一条记录。

---

## 📍 下一步

**阶段 0.2**：修正私有方法/字段拼写错误（`excuteParser→executeParser`、`caculClusterExtent→calcClusterExtent`、factory.ts `transFunction→transformFunction`）。这些都是 private 方法或模块内局部变量，重命名对外无影响。

详见 [PLAN.md § 阶段 0.2](./PLAN.md)。完成后在本节下方追加记录，并更新「下一步」为 0.3。

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

## [阶段 0.1] interface.ts 与 l7-core 去重（commit 待回填）

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
