---
'@antv/l7-layers': patch
---

refactor(layers): BaseLayer stage-0 @ts-ignore 收敛 22→14

P4 阶段 0 第二刀（0.3，零行为/零 API 变更）。安全消除 8 处冗余 `@ts-ignore`：

- `updateLayerConfig` 动态键赋值 → `Record<string, unknown>` 断言
- 删 `styleDataMapping(...)` 死代码注释 + 其冗余 `@ts-ignore`
- `style()` 的 borderColor/borderWidth 兼容分支 → 局部 `styleRest` 断言，消 5 处动态属性访问 `@ts-ignore`
- `get(name)` 的 `@ts-ignore` 冗余删除（`getLayerConfig()` 返 `any`，`cfg[name]` 兼容 `ILayer.get(): number`）

剩余 14 处为真实类型边界，明确归属后续阶段：

- `splitValuesAndCallbackInAttribute` + scale shape（init pendingStyle / updateStyleAttribute）→ 阶段 1.1 `LayerStyleFluent`
- `@antv/async-hook` `SyncHook.call().then()`（call 运行时返 thenable 但类型未声明）→ 阶段 1.3 `LayerPickingManager`
- `isTileLayer` 动态属性、triangulation 解构 → 阶段 1.5/1.2

`log()` 处 `@ts-ignore` 经验证非冗余（`isTileLayer` 不在 BaseLayer 类型上），保留并补注释。
验证：eslint 0 error、prettier 通过、father build 271 files（含 declaration 生成）、jest 40 suites / 191 passed。
