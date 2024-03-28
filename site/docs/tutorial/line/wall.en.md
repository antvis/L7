---
title: Wall
order: 5
---

<embed src="@/docs/api/common/style.md"></embed>

Geographic fencing gives the concept of height based on the original line layer, and other uses are consistent with ordinary line drawings.

<div>
  <div style="width:60%;float:left; margin: 10px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*mLfxTb4mI6AAAAAAAAAAAAAAARQnAQ'>
  </div>
</div>

### accomplish

Let's introduce how to draw a simple geofence.

- you can`L7`Found on the official website[Online case](/examples/line/wall/#hangzhou_wall)

## use

```javascript
import { Scene, LineLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    center: [119.297868, 29.732983],
    zoom: 7.11,
    rotation: 1.22,
    pitch: 45.42056074766357,
    style: 'dark',
  }),
});

scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/bmw-prod/93a55259-328e-4e8b-8dc2-35e05844ed31.json')
    .then((res) => res.json())
    .then((data) => {
      const layer = new LineLayer({}).source(data).size(40).shape('wall').style({
        opacity: 1,
        sourceColor: '#0DCCFF',
        targetColor: 'rbga(255,255,255, 0)',
      });
      scene.addLayer(layer);
    });
});
```

### shape

In order to draw geofences we need to`shape`The parameters are set to`wall`。

<embed src="@/docs/api/common/features/animate.zh.md"></embed>

### style

<embed src="@/docs/api/common/features/linear.zh.md"></embed>

🌟 The current gradient direction is vertically upward

<embed src="@/docs/api/common/features/texture.zh.md"></embed>

🌟 Geofence supports new style parameter iconStepCount

- Texture interval will only take effect when texture is turned on
- Texture spacing supports configuring the spacing between textures
- Texture spacing needs to be used in conjunction with texture spacing

```javascript
.style({
  lineTexture: true, // Enable line mapping function
  iconStep: 40, // Set the spacing of the texture
  iconStepCount: 4
})
```

<img width="80%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*3f8ORIbjJmkAAAAAAAAAAAAAARQnAQ'>

#### heightfixed

`wall`Fixed height configuration supported`heightfixed`。

```javascript
.style({
     heightfixed: true // The default is false. The actual world height does not change after it is turned on (note the size adjustment)
 })
```
