---
title: wave
order: 3
---

<embed src="@/docs/api/common/style.md"></embed>

When the animation mode is turned on, the plane point layer is a special layer type: water wave point. The layer is made up of rings that spread outward.

<div>
  <div style="width:60%;float:left; margin: 10px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*pcp3RKnNK1oAAAAAAAAAAAAAARQnAQ'>
  </div>
</div>

### accomplish

A simple water wave point case can be implemented according to the following code.

- you can`L7`Found on the official website[Online case](/examples/point/scatter#animatepoint)。

- Specific usage can be viewed[Detailed documentation](</api/point_layer/animate#Water wave point>)。

```js
import { Scene, PointLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'light',
    center: [112, 23.69],
    zoom: 2.5,
  }),
});
fetch('https://gw.alipayobjects.com/os/basement_prod/9078fd36-ce8d-4ee2-91bc-605db8315fdf.csv')
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
      .animate(true)
      .size(40)
      .color('#ffa842');
    scene.addLayer(pointLayer);
  });
```

### shape

In order to achieve water wave points, the point layer`shape`The parameters only need to be`circle`、`triangle`、`square`Just wait for the flat graphics.

### animate

- boolean ｜ animateOption

```javascript
.animate(true)

.animate({
  enable: true
})
```

#### Water wave configuration items

- `speed`water wave speed
- `rings`Water wave ring number

### size

In the water wave point layer, due to the transparent edges, the size of the points looks smaller than the non-water wave points of the same size.
