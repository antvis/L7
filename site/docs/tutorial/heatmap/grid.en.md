---
title: Grid Heatmap
order: 1
---

<embed src="@/docs/api/common/style.md"></embed>

Aggregate a set of point data into square grids of equal size. A square grid represents the statistical values ​​of all points in the grid. The grid heat map features a grid layout.

<div>
  <div style="width:60%;float:left; margin: 10px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*XPBuSIPPgsgAAAAAAAAAAABkARQnAQ'>
  </div>
</div>

### accomplish

Let's introduce how to draw a simple grid heat map.

- you can found [Online case](/examples/heatmap/heatmap/#heatmap) on the `L7` official website

```javascript
import { Scene, HeatmapLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'light',
    center: [107.054293, 35.246265],
    zoom: 4.056,
  }),
});
scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/basement_prod/7359a5e9-3c5e-453f-b207-bc892fb23b84.csv')
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
              type: 'grid',
              size: 20000,
              field: 'v',
              method: 'sum',
            },
          ],
        })
        .shape('square')
        .style({
          coverage: 1,
          angle: 0,
        })
        .color(
          'count',
          [
            '#0B0030',
            '#100243',
            '#100243',
            '#1B048B',
            '#051FB7',
            '#0350C1',
            '#0350C1',
            '#0072C4',
            '#0796D3',
            '#2BA9DF',
            '#30C7C4',
            '#6BD5A0',
            '#A7ECB2',
            '#D0F4CA',
          ].reverse(),
        );

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
      type: 'grid',
      size: 15000,
      field: 'v',
      method: 'sum',
    },
  ],
});
```

### shape

Although the grid heat map uses a standard quadrilateral grid for data aggregation, the display effect can be set to various shapes, and the shape only supports constants.

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

### color

Same as layer color method

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
