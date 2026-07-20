---
'@antv/l7-source': patch
---

refactor(source): extract ClusterManager delegate from base-source (stage 1.1)

从 base-source.ts God Class 抽出 cluster 状态机到独立 ClusterManager
delegate，对外 API 完全等价（ISource 接口不动）。

- 新增 src/cluster-manager.ts (138 行): 封装 Supercluster 索引 +
  clusterOptions + init/updateData/getClusters/getClustersLeaves/calcExtent
- base-source.ts (358 -> 314 行, -44):
  - cluster/clusterOptions 字段 -> accessor 透明转发 delegate
  - 删除 clusterIndex 字段，getClusters*/updateClusterData 改转发
  - initCluster/calcClusterExtent 删除，processData 改调
    clusterManager.init
  - destroy 改调 clusterManager.destroy

设计要点:

- 构造期 new ClusterManager 注入 extent/invalidExtent getter 闭包，
  delegate 不拥有 extent 状态 (留待阶段 1.4 抽 Bounds)
- updateClusterData 拆成 delegate.updateData 返回 IParserData +
  Source 转发赋值并 executeTrans，delegate 与 transform 链解耦
- 未启用 cluster 时 getClusters/updateClusterData 仍抛 TypeError
  (index 为 null)，与原行为一致，不加额外 guard

兼容性: layers 包 source.cluster / source.clusterOptions.zoom /
source.updateClusterData() 零改动继续可用。

验证: source tsc 0 错 (基线 31 不变)，layers tsc 229 pre-existing
无新增，eslint/prettier 通过，jest 27/27 通过 (source.spec.ts 的
cluster case 覆盖 updateClusterData 路径)。

详见 docs/refactoring/source/PROGRESS.md 阶段 1.1。
