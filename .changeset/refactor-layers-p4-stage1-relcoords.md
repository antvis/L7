---
'@antv/l7-layers': patch
---

refactor(layers): extract LayerRelativeCoords (stage-1 1.4)

P4 阶段 1 第三刀（1.4，对外透明 delegate，零 API/行为变更）。

从 BaseLayer 抽出相对坐标状态与转换 delegate `core/LayerRelativeCoords.ts`，
收口 3 个原 protected 字段（`relativeOrigin` / `originalExtent` /
`absoluteDataArray`）与 4 个方法：`processRelativeCoordinates`（原 protected，
自我触发，init / setData 钩子调用）、`getAbsoluteData` / `getRelativeOrigin` /
`getOriginalExtent`（public getter）。

BaseLayer 保留全部对外签名作为薄转发：`processRelativeCoordinates` 保留
protected 自调用（内部 call site 不变），3 getter 转发到 delegate。
`processRelativeCoordinates` 核心逻辑字节级镜像原实现——读 `getLayerConfig`
取 `enableRelativeCoordinates`（经 `(layerConfig as any)?.` 兼容字段不在类型上），
经公开 `getSource()` 读写 `source.data.dataArray`（同引用，mutation 生效），
不跨类直访 protected `layerSource`。

3 字段原 protected、外部全走 ILayer getter 访问（grep 已确认无一字段直读），
搬入 delegate 安全。`@antv/l7-utils` 的 `processRelativeCoordinates` 函数
import 从 BaseLayer 上移至 delegate（阶段 0 已就绪，不跨包）。

验证：eslint 0 error、prettier 通过、layers father build 275 files（含
declaration d.ts 类型检查）、jest layers+maps 76 suites/653 passed。
