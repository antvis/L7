---
title: 3D Column
order: 1
---

<embed src="@/docs/api/common/style.md"></embed>

`3D`Column charts are columns of varying heights displayed over a geographic area, with the height of the column proportional to its value in the data set.

<div>
  <div style="width:60%;float:left; margin: 10px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*RVw4QKTJe7kAAAAAAAAAAABkARQnAQ'>
  </div>
</div>

### accomplish

Below we will introduce how to draw a common`3D`Column chart.

- you can`L7`Found on the official website[Online case](/examples/point/column/#clumn_shape)

```javascript
import { Scene, PointLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    pitch: 66.02383,
    center: [ 121.400257, 31.25287 ],
    zoom: 14.55,
    rotation: 134.95
  })
});
fetch('https://gw.alipayobjects.com/os/basement_prod/893d1d5f-11d9-45f3-8322-ee9140d288ae.json')
  .then(res => res.json())
  .then(data => {
    const pointLayer = new PointLayer({})
    .source(data, {
      parser: {
        type: 'json',
        x: 'longitude',
        y: 'latitude'
      }
    })
    .shape('name', [ 'cylinder', 'triangleColumn', 'hexagonColumn', 'squareColumn' ])
    .color('name', [ '#739DFF', '#61FCBF', '#FFDE74', '#FF896F' ]);
    .size('unit_price', h => [ 6, 6, h / 500 ]
    scene.addLayer(pointLayer);
  })
```

### shape

`3D`Column chart`shape`The method supports the following parameters:

- `cylinder`cylinder
- `triangleColumn`triangular prism
- `hexagonColumn`hexagonal column
- `squareColumn`four corner pillars

### size

`3D`column chart`size`Support setting three dimensions`[w, l, z]`：

- `w`Width
- `l`long
- `z`high

1. `size`Set constant

```js
layer.size([2, 2, 3]);
```

2. `size`Set callback function

```js
layer.size('unit_price', (h) => {
  return [6, 6, h / 500];
});
```

### animate

`3D`Column chart supports growth animation, through`animate`Method to set, specific usage can be viewed[Detailed documentation](</api/point_layer/animate#Growth animation>)

<div>
  <div style="width:60%;float:left; margin: 10px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*l-SUQ5nU6n8AAAAAAAAAAAAAARQnAQ'>
  </div>
</div>

### style

`3D`Column charts have special`style`Attributes, specific usage can be found[Detailed documentation](/api/point_layer/style#3d-column)
