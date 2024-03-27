---
title: Great Circle
order: 3
---

<embed src="@/docs/api/common/style.md"></embed>

Consider the earth as a sphere, and draw a plane through any two points on the ground and the center of the earth. The circle seen when the plane intersects the earth's surface is a great circle. The great circle arc between two points is the shortest distance between the two points on the ground. The route along this great arc is called a great circle route.

<div>
  <div style="width:60%;float:left; margin: 10px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*6Qm_QY69sBMAAAAAAAAAAABkARQnAQ'>
  </div>
</div>

### accomplish

Let's introduce how to draw a simple large arc line.

- you can`L7`Found on the official website[Online case](/examples/line/arc/#arccircle)

```javascript
import { Scene, LineLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'dark',
    center: [107.77791556935472, 35.443286920228644],
    zoom: 2.9142882493605033,
  }),
});
scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/rmsportal/UEXQMifxtkQlYfChpPwT.txt')
    .then((res) => res.text())
    .then((data) => {
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
        .shape('greatcircle')
        .color('#8C1EB2')
        .style({
          opacity: 0.8,
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

In order to draw a great arc line graph, we need to`shape`The parameters are set to`greatcircle`。

<embed src="@/docs/api/common/features/animate.zh.md"></embed>

### style

<embed src="@/docs/api/common/features/linear.zh.md"></embed>

<embed src="@/docs/api/common/features/dash.zh.md"></embed>

<embed src="@/docs/api/common/features/texture.zh.md"></embed>
