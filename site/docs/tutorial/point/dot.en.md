---
title: Dot
order: 4
---

<embed src="@/docs/api/common/style.md"></embed>

The brightness map is also called the point density map. The more the number of internal points per unit area, the brighter the brightness will be. The brightness map is generally used to express the distribution of massive point data.

<div>
  <div style="width:60%;float:left; margin: 10px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*xr8BQouXGvoAAAAAAAAAAABkARQnAQ'>
  </div>
</div>

### accomplish

Let's introduce how to draw a simple brightness map.

- you can`L7`Found on the official website[Online case](/examples/gallery/basic#normal)

```javascript
import { Scene, PointLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    center: [121.417463, 31.215175],
    style: 'dark',
    zoom: 11,
  }),
});
scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/rmsportal/BElVQFEFvpAKzddxFZxJ.txt')
    .then((res) => res.text())
    .then((data) => {
      const pointLayer = new PointLayer({})
        .source(data, {
          parser: {
            type: 'csv',
            y: 'lat',
            x: 'lng',
          },
        })
        .size(0.5)
        .color('#080298');
      scene.addLayer(pointLayer);
    });
});
```

### shape

Using the brightness map requires converting`shape`The parameters are set to`dot`, or not set`shape`function.
