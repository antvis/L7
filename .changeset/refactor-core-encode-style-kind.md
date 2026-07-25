---
'@antv/l7-core': minor
---

refactor(core): add EncodeStyleKind type for encode-style channels (stage-3 3.3)

P4 阶段 3 第二刀（3.3，core 侧，minor）。

新增 `export type EncodeStyleKind = 'shader' | 'data'`
（`services/layer/ILayerService.ts`），标样式属性参与数据映射的通道：

- `'shader'`：shader 端 uniform 注入（历史 `enableShaderEncodeStyles`）
- `'data'`：数据层数据映射（历史 `enableDataEncodeStyles`）

`ILayer.enableShaderEncodeStyles` / `enableDataEncodeStyles` 公开数组契约
**保留不变**（外部 `layer.enableShaderEncodeStyles` 读取维持数组），补 JSDoc
指明其为「公开数组 getter 桥接，内部单一真源 `encodeStyles: Map`」。

配套 layers 侧声明同步见 `refactor-layers-encode-styles-converge` changeset。
验证：core eslint 0 error、prettier 通过、core father build 98 files。
