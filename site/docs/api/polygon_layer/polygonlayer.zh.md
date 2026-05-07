---
title: PolygonLayer
order: 0
---

<embed src="@/docs/api/common/style.md"></embed>

## 简介

面图层用于绘制 2D 多边形以及沿 Z 轴拉伸后的 3D 图形，支持 GeoJSON Polygon / MultiPolygon 数据。

```javascript
import { PolygonLayer } from '@antv/l7';

const layer = new PolygonLayer()
  .source({
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [104.4140625, 35.460669951495305],
              [98.7890625, 24.206889622398023],
              [111.796875, 27.371767300523047],
              [104.4140625, 35.460669951495305],
            ],
          ],
        },
      },
    ],
  })
  .shape('fill')
  .color('#f00')
  .style({
    opacity: 0.6,
  });
```

## options

<embed src="@/docs/api/polygon_layer/options.zh.md"></embed>

## source

<embed src="@/docs/api/polygon_layer/source.zh.md"></embed>

## shape

<embed src="@/docs/api/polygon_layer/shape.zh.md"></embed>

## color

<embed src="@/docs/api/polygon_layer/color.zh.md"></embed>

## size

<embed src="@/docs/api/polygon_layer/size.zh.md"></embed>

## scale

<embed src="@/docs/api/polygon_layer/scale.zh.md"></embed>

## style

<embed src="@/docs/api/polygon_layer/style.zh.md"></embed>

## animate

<embed src="@/docs/api/polygon_layer/animate.zh.md"></embed>

## 图层通用方法

<embed src="@/docs/api/common/layer/base.zh.md"></embed>
