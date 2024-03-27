---
title: Arc
order: 1
---

<embed src="@/docs/api/common/style.md"></embed>

Sometimes for the sake of visualization, you will choose to use arcs to connect two points on the map. At the same time, you can also use arcs to achieve some interesting effects.

<div>
  <div style="width:60%;float:left; margin: 10px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*dUk8RbtjUDIAAAAAAAAAAAAAARQnAQ'>
  </div>
</div>

### accomplish

Next we will introduce how to use arcs to draw a simulated wind field.

- you can`L7`Found on the official website[Online case](/examples/line/animate/#wind)

```javascript
import { Scene, LineLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'light',
    center: [60, 40.7128],
    zoom: 2,
  }),
});
scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/bmw-prod/7455fead-1dc0-458d-b91a-fb4cf99e701e.txt')
    .then((res) => res.text())
    .then((data) => {
      const layer = new LineLayer({ blend: 'normal' })
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
        .color('#6495ED')
        .animate({
          duration: 4,
          interval: 0.2,
          trailLength: 0.6,
        });
      scene.addLayer(layer);
    });
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

In order to draw an arc graph, we need to`shape`The parameters are set to`arc`。

<embed src="@/docs/api/common/features/animate.zh.md"></embed>

### style

<embed src="@/docs/api/common/features/segment_number.zh.md"></embed>

<embed src="@/docs/api/common/features/theta_offset.zh.md"></embed>

<embed src="@/docs/api/common/features/linear.zh.md"></embed>

<embed src="@/docs/api/common/features/dash.zh.md"></embed>

<embed src="@/docs/api/common/features/texture.zh.md"></embed>
