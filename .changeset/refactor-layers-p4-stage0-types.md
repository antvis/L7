---
'@antv/l7-layers': patch
'@antv/l7-core': patch
---

refactor(layers,core): BaseLayer stage-0 抽内联字面量类型为命名接口（0.4）

P4 阶段 0 第三刀（0.4，零行为/零 API 变更，纯类型 DRY）。`BaseLayer.ts` 的
`defaultSourceConfig`/`sourceOption`/`shapeOption` 此前以内联字面量类型声明，
且同样的字面量在 `core/src/services/layer/ILayerService.ts` 的 `ILayer` 接口里
重复声明一次（散落字面量）。本轮在 `IDataState` 旁新增三个命名接口统一引用：

- `IDefaultSourceConfig { data: any[]; options: ISourceCFG | undefined }`
- `ISourceOption { data: any; options?: ISourceCFG }`
- `IShapeOption { field: any; values: any }`

`ILayer` 接口与 `BaseLayer` 字段声明均改为引用命名接口（形状完全一致）。
`dataState` 此前已使用 `IDataState`，本轮无需改动。精确保留 `shape()` /
`source()` 运行时赋值点的可赋值性（`any` 字段双向兼容）。

验证：eslint 0 error、prettier 通过、core father build（98 files，含 declaration）、
layers father build（271 files，含 declaration d.ts 类型检查）、jest 40 suites / 191 passed。
