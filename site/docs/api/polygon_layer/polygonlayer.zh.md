---
title: PolygonLayer
order: 0
---

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

<!-- include: ./options.zh.md -->

## source

<!-- include: ./source.zh.md -->

## shape

<!-- include: ./shape.zh.md -->

## color

<!-- include: ./color.zh.md -->

## size

<!-- include: ./size.zh.md -->

## scale

<!-- include: ./scale.zh.md -->

## style

<!-- include: ./style.zh.md -->

## animate

<!-- include: ./animate.zh.md -->

## 图层通用方法

<!-- include: ../common/layer/base.zh.md -->
