---
title: Heatmap
order: 0
---

<embed src="@/docs/api/common/style.md"></embed>

## 简介

热力图以特殊高亮的形式显示数据在地理区域的聚集程度，L7 提供了多种表现形式的热力图，通过切换 `shape` 参数，用户可以得到不同类型的热力图。

| shape 值         | 说明           |
| ---------------- | -------------- |
| `heatmap`        | 经典高斯热力图 |
| `heatmap3D`      | 3D 热力图      |
| `hexagon`        | 六边形聚合     |
| `hexagonColumn`  | 六边形柱状聚合 |
| `square`         | 正方形聚合     |
| `squareColumn`   | 正方形柱状聚合 |
| `triangle`       | 三角形聚合     |
| `triangleColumn` | 三角形柱状聚合 |
| `cylinder`       | 圆柱聚合       |

<div>
  <div style="width:40%;float:right; margin-left: 16px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*QstiQq4JBOIAAAAAAAAAAABkARQnAQ'>
  </div>
</div>

```javascript
import { HeatmapLayer } from '@antv/l7';

const layer = new HeatmapLayer()
  .source(data)
  .shape('heatmap')
  .size('mag', [0, 1.0]) // weight 映射通道
  .style({
    radius: 20,
    rampColors: {
      colors: ['#FF4818', '#F7B74A', '#FFF598', '#91EABC', '#2EA9A1', '#206C7C'],
      positions: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
    },
  });
```

## options

<embed src="@/docs/api/heatmap_layer/options.zh.md"></embed>

## source

<embed src="@/docs/api/heatmap_layer/source.zh.md"></embed>

## shape

<embed src="@/docs/api/heatmap_layer/shape.zh.md"></embed>

## size

size 方法用于映射权重字段，将数值范围归一化到 `[0, 1]`，作为热力强度使用。

```js
layer.size('weight', [0, 1.0]);
```

| 参数  | 类型               | 说明                            |
| ----- | ------------------ | ------------------------------- |
| field | `string`           | 数据字段名，用于映射热力权重    |
| range | `[number, number]` | 映射的值域范围，通常为 `[0, 1]` |

## scale

<embed src="@/docs/api/heatmap_layer/scale.zh.md"></embed>

## style

<embed src="@/docs/api/heatmap_layer/style.zh.md"></embed>

## 图层通用方法

<embed src="@/docs/api/common/layer/base.zh.md"></embed>
