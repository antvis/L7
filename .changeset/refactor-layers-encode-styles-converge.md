---
'@antv/l7-layers': minor
---

refactor(layers): converge encode styles into Map-backed accessor (stage-3 3.3)

P4 阶段 3 第二刀（3.3，layers 侧，minor——子类构造期 API 变更 + 新增内部
单真源 + 新增 spec）。

收敛原两个平行 `string[]` 数组为内部单一真源 `Map`，公开数组 getter 桥接
维持 `ILayer` 契约。

**BaseLayer**：

- 删 `public enableShaderEncodeStyles: string[] = []` /
  `public enableDataEncodeStyles: string[] = []` 字段。
- 加 `protected encodeStyles: Map<string, EncodeStyleKind> = new Map()`
  （单一真源，运行时不 mutate）。
- 加 `public get enableShaderEncodeStyles() / .enableDataEncodeStyles()`
  数组 getter：按 `kind` 过滤 Map、映射出键名数组（每次调用新数组，
  浅拷贝不泄漏引引用）。
- 加 `protected setEncodeStyles(kind, keys)` 批量声明 helper（同名后写
  覆盖先写，空 keys no-op）。
- `encodeStyle()` 中 `[...shader, ...data].includes(key)` →
  `this.encodeStyles.has(key)`（语义等价，单 Map 查询替代数组 spread+includes）。

**子类（point/line/polygon）**：原 `public enableXxxEncodeStyles = [...]`
字段初始化器改为显式 `constructor(super(config); setEncodeStyles(...))`。
构造期参数类型与 BaseLayer 一致（`Partial<ILayerConfig & 子类样式 options>`），
类型透传替代 `as any`。

**零行为变化**：getter 返回派生数组与原字段内容一致（point 5+2、line 4、
polygon 5）；`encodeStyle` 过滤等价；下游 `BaseModel.getStyleAttribute` /
`getDynamicStyleInject` 读 `.enableShaderEncodeStyles` 经 getter 透明工作。

**spec**：新增 `__tests__/core/encode-styles.spec.ts`（7 cases）锁定：

- point/line/polygon/BaseLayer 默认注册内容；
- 公开数组 getter 从 Map 派生且浅拷贝不泄漏；
- `setEncodeStyles` 同名覆盖语义、`shader`/`data` 互斥。

验证：layers eslint 0 error、prettier 通过、layers father build 278 files
（含 d.ts 类型检查，getter 三态正确解析）、jest layers+maps 78 suites
0 failed（含新 7 cases；1 skipped `citybuilding` 基线一致）。
