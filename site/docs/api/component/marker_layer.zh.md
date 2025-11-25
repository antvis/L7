---
title: Marker 图层
order: 3
---

<embed src="@/docs/api/common/style.md"></embed>

MarkerLayer 是 Marker 的升级版，Marker 是独立的地图标注，MarkerLayer 则是统一管理大量的 Marker 数据。

**技术差异**

- Marker DOM 绘制一个地图元素
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
  - radius 聚合半径 number default 40
  - minZoom: 最小聚合缩放等级 number default 0
  - maxZoom: 最大聚合缩放等级 number default 16
  - element `function` 通过回调函数设置聚合 Marker 的样式，返回 dom 元素
    回调函数包含以下参数
    - point_count 默认 聚合元素个数
    - clusterData `Array` 聚合节点的原始数据
    - point_sum 聚合求和 根据 field 和 method 计算
    - point_max 聚合最大值 根据 field 和 method 计算
    - point_min 聚合最小值 根据 field 和 method 计算
    - point_mean 聚合平均值 根据 field 和 method 计算

- markerOption 图层默认 Marker 配置（新增）
  - color `string` 默认标记颜色，会尝试设置到 marker 内的 svg path fill 或作为背景色
  - style `object` CSS 样式对象，会应用到 marker 的容器元素上（例如 width/height/borderRadius）
  - className `string` 额外的 class 名称，会加入到 marker 的 DOM 元素上

示例：统一设置图层内 marker 的默认样式

```javascript
const markerLayer = new MarkerLayer({
  cluster: true,
  markerOption: {
    color: '#ff5722',
    style: { width: '28px', height: '28px', borderRadius: '50%' },
    className: 'demo-marker-default',
  },
});
```

说明：单个 Marker 如果在构造时传入了自定义 `element` 或 `style`，以单个 Marker 的配置为准，`markerOption` 仅在没有显式样式时作为默认值应用。

#### extData 与聚合数据

当你向 `MarkerLayer` 添加 Marker 时，可通过 `Marker` 的 `extData` 属性传入业务数据，这对于使用 `clusterOption.field/method` 做统计非常重要。

示例：为每个 Marker 设置业务数据

```javascript
const marker = new Marker({
  extData: nodes.features[i].properties,
}).setLnglat({ lng: x, lat: y });
markerLayer.addMarker(marker);
```

在聚合逻辑中，`MarkerLayer` 为生成的聚合 Marker 也会把 supercluster 返回的 `feature.properties` 复制到聚合 Marker 的 `extData` 上。因此当你执行：

```javascript
scene.addMarkerLayer(markerLayer);
const maps = markerLayer.getMarkers().map((item) => item.getExtData());
console.log(maps);
```

你将会得到每个 Marker（或聚合 Marker）对应的 `extData`，不会再看到 `undefined`。

此外，当某个聚合包含仅 1 个原始点时，`MarkerLayer` 会优先显示该原始 Marker（并保留其 `extData`），以保证单点场景下保留原始样式与数据。

---

English (API)

## MarkerLayer (summary)

MarkerLayer manages multiple DOM-based Markers on the map and provides clustering support via supercluster. It offers more flexibility for custom HTML/CSS markers compared to WebGL-based PointLayer.

### Options (new)

- markerOption: optional defaults applied to markers added to this layer
  - color: string — default marker color; will try to set SVG fill or fallback to background color
  - style: object — CSS style object applied to the marker element (e.g. width/height/borderRadius)
  - className: string — additional class name to add to marker DOM element

Example:

```javascript
const markerLayer = new MarkerLayer({
  cluster: true,
  markerOption: {
    color: '#ff5722',
    style: { width: '28px', height: '28px', borderRadius: '50%' },
    className: 'demo-marker-default',
  },
});
```

### extData and clustering

Each Marker may carry business data via `extData` (used by cluster statistics when `clusterOption.field/method` are set). `MarkerLayer` also attaches the supercluster `feature.properties` to cluster markers' `extData` so `marker.getExtData()` returns useful info for both single markers and clusters.

When a cluster contains only 1 original point, `MarkerLayer` will prefer to show the original marker (preserving its element/style/extData) instead of rendering a cluster element.

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

说明：调用 `markerLayer.removeMarker(marker)` 会执行 Marker 的清理逻辑（从场景 DOM 中移除、解绑事件等），并同步更新内部聚合索引。如果需要临时隐藏 Marker，请使用下面的 `hide()`/`show()` 方法，而不是反复 `remove`/`add`，以保留 Marker 的 extData 与状态。

示例：

```javascript
// 从图层移除并销毁 marker
markerLayer.removeMarker(marker);

// 仅隐藏（不销毁）marker
marker.hide();
// 恢复显示
marker.show();
```

#### getMarkers

获取 MarkerLayer 中的所有 Marker

#### clear

清除掉所有的 Marker

#### hide / show（Marker）

每个 `Marker` 实例现在提供 `hide()` 与 `show()` 方法，用于在不移除数据和 DOM 绑定的情况下控制显示状态。隐藏后，Marker 不会参与后续的位置更新渲染（例如缩放/平移期间），但其 `extData` 与其他状态将被保留。此方法适合临时控制可见性或实现按需渲染。

示例：

```javascript
// 隐藏图层内的单个 marker
const [m] = markerLayer.getMarkers();
m.hide();

// 稍后恢复
m.show();
```

说明：`MarkerLayer` 的 `addMarker` 会在图层已加入场景后，立即把新 Marker 添加到场景 DOM 中；如果图层尚未 add 到 Scene，则会在 `scene.addMarkerLayer(layer)` 时集中挂载。图层级别的 `markerOption` 会作为默认值应用到每个新增 Marker，只有当 Marker 自身显式提供 `element` / `style` 时，才会覆盖这些默认值。

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
