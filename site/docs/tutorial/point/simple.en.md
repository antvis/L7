---
title: Simple
order: 9
---

<embed src="@/docs/api/common/style.md"></embed>

Point layers support the simple points of sprite mode. Point layers in sprite mode are more efficient and the points always face the camera.

<div>
  <div style="width:60%;float:left; margin: 10px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*dVFmQIKh5TUAAAAAAAAAAAAAARQnAQ'>
  </div>
</div>

### accomplish

Let's introduce how to draw a simple point layer.

- you can`L7`Found on the official website[Online case](/examples/point/simple#simple)

```javascript
import { Scene, PointLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    pitch: 20,
    center: [ 120, 20 ],
    zoom: 3
  })
});
scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/basement_prod/d3564b06-670f-46ea-8edb-842f7010a7c6.json')
    .then(res => res.json())
    .then(data => {
      const pointLayer = new PointLayer({})
        .source(data)
        .shape('simple')
        .size(15)
        .color('mag', mag =>  mag > 4.5 ? '#5B8FF9' : '#5CCEA1';)
        .style({
          opacity: 0.6,
          strokeWidth: 3
        });
      scene.addLayer(pointLayer);
    });
});
```

### shape

Simple point layer use`shape`The parameters are fixed to`simple`。

### use

- The use of simple point layers behaves the same as general point layers.

- A simple point layer is essentially a sprite map, so a simple point layer always faces the camera (a normal 2D point layer stays facing up)

- 🌟 When the user has no requirements for the orientation of the point layer or the visual effect of the point layer is relatively simple, it is recommended to use a simple point layer as much as possible, which can save a lot of performance

- 🌟 Since the simple point layer is essentially a sprite map, there is a size limit: generally \[1, 64], which varies between different devices.

```javascript
// L7 provides query methods for quick viewing

scene.getPointSizeRange(); // Float32Array - [min, max]
```
