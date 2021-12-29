---
title: Cluster Map
order: 5
---

`markdown:docs/api/point_layer/cluster.zh.md`

## 使用

目前只有点数据支持聚类方法

数据聚合主要从数据层数据，因此需要在 Source 方法配置 cluster 参数

### Source

[source 文档](../../source/source)

### 配置项

- cluster **boolean** 是否聚合
- clusterOption 聚合配置项
  - radius 聚合半径 **number** default 40
  - minZoom: 最小聚合缩放等级 **number** default 0
  - maxZoom: 最大聚合缩放等级 **number** default 16

数据聚合之后，源数据会增加 point_count 属性，在可视化渲染时可以根据 point_count 进行数据映射。

#### 方法

**getClusters(zoom: number)**

获取指定缩放等级的聚合数据

- zoom 缩放等级

**getClustersLeaves(id: string)**

    根据id获取聚合节点的数据

- id 聚合数据 id

```javascript
layer.source(pointsData, {
  cluster: true,
});

// 设置配置项
layer.source(pointsData, {
  cluster: true,
  clusterOption: {
    radius: 40,
  },
});
```

### 完整示例

```javascript
const pointLayer = new PointLayer({})
  .source(pointsData, {
    cluster: true,
  })
  .shape('circle')
  .scale('point_count', {
    type: 'quantile',
  })
  .size('point_count', [5, 10, 15, 20, 25])
  .color('red')
  .style({
    opacity: 0.3,
    strokeWidth: 1,
  });
```

`markdown:docs/common/layer/base.md`
