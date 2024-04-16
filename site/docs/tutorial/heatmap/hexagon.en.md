---
title: hexagon heatmap
order: 2
---

<embed src="@/docs/api/common/style.md"></embed>

Aggregate a set of point data into hexagonal grids of equal size. One hexagonal grid represents the statistical values ​​of all points in the grid. The Honeycomb Heatmap feature is laid out in a hexagonal heatmap grid.

<div>
  <div style="width:60%;float:left; margin: 10px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*SLcGSbvZoEwAAAAAAAAAAABkARQnAQ'>
  </div>
</div>

### accomplish

Let’s introduce how to draw a simple cellular heat map.

- you can found [Online case](/examples/heatmap/hexagon/#china) on the `L7` official website

```javascript
import { Scene, HeatmapLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'dark',
    pitch: 43,
    center: [120.13383079335335, 29.651873105004427],
    zoom: 7.068989519212174,
  }),
});
scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/basement_prod/a1a8158d-6fe3-424b-8e50-694ccf61c4d7.csv')
    .then((res) => res.text())
    .then((data) => {
      const layer = new HeatmapLayer({})
        .source(data, {
          parser: {
            type: 'csv',
            x: 'lng',
            y: 'lat',
          },
          transforms: [
            {
              type: 'hexagon',
              size: 2500,
              field: 'v',
              method: 'sum',
            },
          ],
        })
        .size('sum', (sum) => {
          return sum * 200;
        })
        .shape('hexagonColumn')
        .style({
          coverage: 0.8,
          angle: 0,
        })
        .color('sum', [
          '#094D4A',
          '#146968',
          '#1D7F7E',
          '#289899',
          '#34B6B7',
          '#4AC5AF',
          '#5FD3A6',
          '#7BE39E',
          '#A1EDB8',
          '#C3F9CC',
          '#DEFAC0',
          '#ECFFB1',
        ]);
      scene.addLayer(layer);
    });
});
```

### source

Grid data only supports point data as the data source, and the data format supports`csv`、`json`、`geojson`。

#### Set grid aggregation parameters

layout method pass`source`of`transforms`Property configuration.

- type data aggregation type`hexagon`。
- size grid radius in meters.
- field Aggregation field.
- method aggregation method`count`，`max`，`min`，`sum`，`mean`5 statistical dimensions.

```javascript
layer.source(data, {
  parser: {
    type: 'csv',
    x: 'lng',
    y: 'lat',
  },
  transforms: [
    {
      type: 'hexagon',
      size: 15000,
      field: 'v',
      method: 'sum',
    },
  ],
});
```

### shape

Although the grid heat map uses a standard quadrilateral grid for data aggregation, the display effect can be set to its shape. The shape only supports constants.

#### 2d

- circle,
- triangle
- square
- heaxgon

```javascript
layer.shape('circle');
```

#### 3d

- cylinder
- triangleColumn
- hexagonColumn
- squareColumn,

```javascript
layer.shape('cylinder');
```

### size

### 2D shape

No need to set size method

### 3D graphics

size represents height, supports constants and data mapping

```javascript
layer.size(10); // constant
layer.size('value', [10, 50]); // Map size based on value field
layer.size('value', (value) => {}); // Callback function to set height
```

### style

- coverage Grid coverage 0 - 1
- angle Grid rotation angle 0 - 360
- opacity transparency 0 - 1.0

```javascript
layer.style({
  coverage: 0.9,
  angle: 0,
  opacity: 1.0,
});
```
