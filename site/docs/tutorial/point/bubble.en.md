---
title: Bubble
order: 0
---

<embed src="@/docs/api/common/style.md"></embed>

Dots of different sizes appear above the geographic area of ​​the bubble chart, and the area of ​​the circle is proportional to its value in the data set.

<div>
  <div style="width:60%;float:left; margin: 10px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*fNGiS7YI1tIAAAAAAAAAAABkARQnAQ'>
  </div>
</div>

### accomplish

Let’s introduce how to draw a common bubble chart.

- you can`L7`Found on the official website[Online case](/examples/point/bubble/#point)

```javascript
import { Scene, PointLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'light',
    center: [140.067171, 36.26186],
    zoom: 5.32,
    maxZoom: 10,
  }),
});
scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/basement_prod/d3564b06-670f-46ea-8edb-842f7010a7c6.json')
    .then((res) => res.json())
    .then((data) => {
      const pointLayer = new PointLayer({})
        .source(data)
        .shape('circle')
        .size('mag', [1, 25])
        .color('mag', (mag) => {
          return mag > 4.5 ? '#5B8FF9' : '#5CCEA1';
        })
        .style({
          opacity: 0.3,
          strokeWidth: 1,
        });
      scene.addLayer(pointLayer);
    });
});
```

### source

Bubble charts accept plain point data.

### shape

bubble chart`shape`Generally`circle`,can also be`square`、`triangle`and other shapes.

### size

bubble chart`size`Generally used to represent a certain field in the data, so constants are not used but data mapping is used.

```js
layer.size('area', [1, 100]); // Use interval mapping
layer.size('area', (area) => {
  // Use callback function to implement mapping
  return area * 10;
});
```

### color

bubble chart`color`It is generally used to represent a certain field in the data, so constants are not used but data mapping is used.

```js
layer.color('area', ['#f00', '#ff0']); // Use interval mapping
layer.color('area', (area) => {
  // Use callback function to implement mapping
  if (area > 100) {
    return '#f00';
  } else {
    return '#ff0';
  }
});
```
