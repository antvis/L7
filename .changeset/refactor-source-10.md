---
'@antv/l7-source': patch
---

refactor(source): extract Bounds value object from base-source (stage 1.4)

从 base-source.ts 抽出数据范围 / 中心点计算职责到独立 Bounds
value object, 对外 API 完全等价 (ISource 接口不动)。

- 新增 src/bounds.ts (50 行): 封装 extent / center / invalidExtent
  三态 + update(bbox) 原子写入
  - update 合并原 executeParser 末尾三行 (extent 计算 + setCenter
    - invalidExtent 判定)
  - setCenter 含 NaN -> 大地原点兜底, 保留原行为
- base-source.ts (290 -> 292, +2 行):
  - 删 public extent / public center / private invalidExtent 三字段
  - 删 private setCenter 方法 (搬到 Bounds)
  - 加 private readonly bounds: Bounds = new Bounds() + 3 getter
    (extent/center/invalidExtent) 转发 bounds
  - executeParser 末尾三行收敛为 this.bounds.update(extent(...))
  - ClusterManager 构造闭包: () => this.extent ->
    () => this.bounds.extent, this.invalidExtent ->
    this.bounds.invalidExtent

设计取舍:

- getter 转发保留 ISource.extent/center 可读语义, 外部直读不变
- invalidExtent 同样 getter 转发 (private 原本就仅 ClusterManager 用)
- 行数微增 (290 -> 292) 因新增 3 个 getter + import + 字段块注释,
  但原 executeParser/setCenter 的 ~12 行实现搬到 Bounds, base-source
  状态写入从分散 3 处收敛为 1 处原子更新
- 阶段 1 拆解 base-source.ts: 358 -> 292 行 (含 4 delegate, 未达
  PLAN 估 ~120 协调者目标, 实际阶段 1 收益 -66 行)

验证: source tsc 0 错 (基线 31 不变, 全是 core .glsl 噪音),
layers tsc 229 pre-existing 不变 (ClusterManager 闭包转发仍 work),
eslint/prettier 通过, source jest 27/27 通过。

详见 docs/refactoring/source/PROGRESS.md 阶段 1.4。阶段 1 拆解
God Class 完赛, 下一步进入阶段 2 Parser 接口标准化。
