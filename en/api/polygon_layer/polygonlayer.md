---
title: "PolygonLayer"
description: "PolygonLayer"
language: "en"
canonical: "https://l7.antv.antgroup.com/en/api/polygon_layer/polygonlayer/"
---

[Resource index](/llms.txt)

## Introduction

Draws 2D polygons and 3D shapes stretched along the Z axis.

## use

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
