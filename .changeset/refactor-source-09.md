---
'@antv/l7-source': patch
---

refactor(source): extract FeatureIndex delegate from base-source (stage 1.3)

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
