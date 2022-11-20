---
title: Marker 图层
order: 3
---

<embed src="@/docs/common/style.md"></embed>

MarkerLayer 是 Marker 的升级版，Marker 是独立的地图标注，MarkerLayer 则是统一管理大量的 Marker 数据。

**技术差异**

- Marker Dom 绘制一个地图元素
- MarkerLayer 统一管理多个 DomMarker
- PointLayer 通过 WebGL 绘制元素。

**功能差异**

- MarkerLayer 元素的自定义性比较强，任何 HTML+ CSS 的组合都可以绘制在地图上。
- PointLayer 自定义性比较弱，实现成本比较高，优势可以绘制大量的数据，性能比较好。

## 使用

```javascript
import { Marker, MarkerLayer } from '@antv/l7';
```

### 构造函数

```javascript
const markerLayer = new MarkerLayer(option);

// 调用 addMarker方法 将多个Marker添加到Layer

scene.addMarkerLayer(markerLayer);
```

#### option

- cluster 聚合 `boolean` 默认 `false`

- clusterOption 聚合配置

  - field `string` 聚合统计字段
  - method `sum| max| min| mean`
  - element `function` 通过回调函数设置聚合 Marker 的样式，返回 dom 元素
    回调函数包含以下参数
    - point_count 默认 聚合元素个数
    - clusterData `Array` 聚合节点的原始数据
    - point_sum 聚合求和 根据 field 和 method 计算
    - point_max 聚合最大值 根据 field 和 method 计算
    - point_min 聚合最小值 根据 field 和 method 计算
    - point_mean 聚合平均值 根据 field 和 method 计算

### 方法

#### addMarker

参数

- marker `IMarker` 需要添加的 Marker

添加 Marker

通过 Marker 对象实例化一个 Marker

```javascript
const marker = new Marker().setLnglat(); // 添加进Marker必须设置经纬度才能添加
markerLayer.addMarker(marker);
```

为 Marker 添加属性信息,

如果聚合参数设置统计配置项 `field| method`需要为 Marker 添加属性信息

通过 Marker 的 extData[配置项](/api/compnent/marker#option)设置 Marker 属性信息

```javascript
const marker = new Marker({
  extData: nodes.features[i].properties,
}).setLnglat({
  lng: coordinates[0],
  lat: coordinates[1],
});
```

#### removeMarker

从 MarkerLayer 移除 Marker

#### getMarkers

获取 MarkerLayer 中的所有 Marker

#### clear

清除掉所有的 Marker

####

### Scene

#### addMarkerLayer

添加 MarkerLayer

```javascript
scene.addMarkerLayer(layer);
```

#### removeMarkerLayer

移除 MarkerLayer

```javascript
scene.removeMarkerLayer(layer);
```

### demo 地址

[markerLayer ](/examples/point/marker#markerlayer)

[markerLayer 聚合](/examples/point/marker#clustermarker)
