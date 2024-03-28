---
title: Scatter
order: 2
---

<embed src="@/docs/api/common/style.md"></embed>

A scatter plot places equal-sized dots over a geographical area to represent the spatial layout or distribution of data over a geographical area.

<div>
  <div style="width:60%;float:left; margin: 10px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*LnlmQ7sFWigAAAAAAAAAAABkARQnAQ'>
  </div>
</div>

### accomplish

Let's introduce how to draw a common scatter plot.

- you can`L7`Found on the official website[Online case](/examples/point/scatter/#scatter)

```javascript
import { Scene, PointLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'light',
    center: [-121.24357, 37.58264],
    zoom: 6.45,
  }),
});
scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/basement_prod/6c4bb5f2-850b-419d-afc4-e46032fc9f94.csv')
    .then((res) => res.text())
    .then((data) => {
      const pointLayer = new PointLayer({})
        .source(data, {
          parser: {
            type: 'csv',
            x: 'Longitude',
            y: 'Latitude',
          },
        })
        .shape('circle')
        .size(4)
        .color('Magnitude', [
          '#0A3663',
          '#1558AC',
          '#3771D9',
          '#4D89E5',
          '#64A5D3',
          '#72BED6',
          '#83CED6',
          '#A6E1E0',
          '#B8EFE2',
          '#D7F9F0',
        ]);
      scene.addLayer(pointLayer);
    });
});
```

### shape

Scatter plot`shape`Generally set to a constant, usually`2D`chart.

- circle
- square
- hexagon
- triangle
- pentagon
- octogon
- hexagram
- rhombus
- vesica
