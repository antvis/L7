---
'@antv/l7-layers': patch
---

refactor(layers): type encodeStyleAttribute field via IEncodedStyleMap (stage-3 3.2)

P4 阶段 3 第一刀（3.2，layers 侧，patch——纯内部字段类型对齐，无新增/改动公共 API）。

配合 core 侧 `IEncodedStyleMap`（见 `refactor-core-encoded-style-map`），将
`BaseLayer.encodeStyleAttribute: Record<string, any>` 收窄为 `IEncodedStyleMap`
并从 `@antv/l7-core` 导入。

**零行为变化**：

- 写入点 `encodeStyle()` 的 `this.encodeStyleAttribute[key] = options[key]`
  右值 `options[key]` 为 `any`，赋值具名类型无类型错误、运行时同一对象引用。
- 读取点 `BaseModel.getInject()` 经 `getDynamicStyleInject(..., this.layer
.encodeStyleAttribute)` 传入（其形参 `Record<string, any>` 接受
  `IEncodedStyleMap`）、`!this.layer.encodeStyleAttribute[key]` 真值判断、
  `Object.keys(...)` 遍历均不受影响。

`registerStyleAttribute`/其他 BaseModel 自身的 `encodeStyleAttribute: Record<
string, boolean>`（布尔 flag 表）与本字段同名但语义独立，不在本刀收窄范围。

验证：layers eslint 0 error、prettier 通过、layers father build 278 files
（含 declaration d.ts 类型检查）、jest layers+maps 77 suites 0 failed（1
skipped `citybuilding`，基线一致）。
