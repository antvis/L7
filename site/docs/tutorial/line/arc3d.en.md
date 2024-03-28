---
title: 3D Arc
order: 2
---

<embed src="@/docs/api/common/style.md"></embed>

In addition to 2D arcs, we also point out 3D arcs. In use, just change`shape`parameters.

<div>
  <div style="width:60%;float:left; margin: 10px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*xvaaQo2c0gMAAAAAAAAAAABkARQnAQ'>
  </div>
</div>

### accomplish

Below we will introduce how to draw a simple`3D`Arc diagram.

- you can`L7`Found on the official website[Online case](/examples/line/arc#trip_arc)

```javascript
import { LineLayer } from '@antv/l7';
const layer = new LineLayer({})
  .source(data, {
    parser: {
      type: 'csv',
      x: 'lng1',
      y: 'lat1',
      x1: 'lng2',
      y1: 'lat2',
    },
  })
  .size(1)
  .shape('arc')
  .color('#8C1EB2')
  .style({
    opacity: 0.8,
  });
```

### source

To draw an arc, you need to provide the coordinates of both the starting point and the ending point (if the starting and ending points are swapped, the shape of the arc will be symmetrical and opposite, and the direction of the flying line animation will be opposite).

```javascript
const data = [
  {
    lng1: 120,
    lat1: 30,
    lng2: 130,
    lat2: 30,
  },
];
layer.source(data, {
  parser: {
    type: 'json',
    x: 'lng1',
    y: 'lat1',
    x1: 'lng2',
    y1: 'lat2',
  },
});
```

### shape

In order to draw an arc graph, we need to`shape`The parameters are set to`arc3d`。

<embed src="@/docs/api/common/features/animate.zh.md"></embed>

### style

<embed src="@/docs/api/common/features/linear.zh.md"></embed>

<embed src="@/docs/api/common/features/dash.zh.md"></embed>

<embed src="@/docs/api/common/features/texture.zh.md"></embed>
