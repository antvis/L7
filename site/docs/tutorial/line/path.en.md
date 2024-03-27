---
title: Path
order: 0
---

<embed src="@/docs/api/common/style.md"></embed>

We often need to draw common paths such as roads, action routes, water systems, etc. on the map. These drawn lines can be collectively called a path map, that is, a line layer positioned with a set of point coordinate pairs that are not closed at the beginning and end.

<div>
  <div style="width:60%;float:left; margin: 10px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*KEupSZ_p0pYAAAAAAAAAAAAAARQnAQ'>
  </div>
</div>

### accomplish

Let's introduce how to draw a common path diagram.

- you can`L7`Found on the official website[Online case](/examples/gallery/animate#animate_path_texture)

```javascript
import { Scene, LineLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    center: [120.15, 30.246],
    zoom: 13.5,
    style: 'dark',
    rotation: -90,
  }),
});
scene.addImage(
  'arrow',
  'https://gw.alipayobjects.com/zos/bmw-prod/ce83fc30-701f-415b-9750-4b146f4b3dd6.svg',
);
fetch('https://gw.alipayobjects.com/os/basement_prod/40ef2173-df66-4154-a8c0-785e93a5f18e.json')
  .then((res) => res.json())
  .then((data) => {
    const layer = new LineLayer({})
      .source(data)
      .size(3)
      .shape('line')
      .texture('arrow')
      .color('rgb(22,119,255)')
      .animate({
        interval: 1, // interval
        duration: 1, // duration, delay
        trailLength: 2, // streamline length
      })
      .style({
        opacity: 0.6,
        lineTexture: true, // Enable line mapping function
        iconStep: 10, // Set the spacing of the texture
        borderWidth: 0.4, //The default value is 0, the maximum valid value is 0.5
        borderColor: '#fff', // Default is #ccc
      });
    scene.addLayer(layer);
  });
```

### shape

We generally refer to the path diagram as`shape`The parameters are set to`line`。

### size

For path diagrams, we generally only need to set a constant to represent the width of the path.

```javascript
layer.size(2); // Draw a path with width 2
```

### style

<embed src="@/docs/api/common/features/linear.zh.md"></embed>

<embed src="@/docs/api/common/features/dash.zh.md"></embed>

<embed src="@/docs/api/common/features/border.zh.md"></embed>

<embed src="@/docs/api/common/features/texture.zh.md"></embed>

<embed src="@/docs/api/common/features/animate.zh.md"></embed>
