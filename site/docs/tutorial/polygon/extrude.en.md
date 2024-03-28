---
title: 3D Extrude
order: 1
---

<embed src="@/docs/api/common/style.md"></embed>

In addition to the flat filled map on the map, the geometry layer can also be a geometric block with height.

<div>
  <div style="width:60%;float:left; margin: 10px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*yxRiTJDOrS8AAAAAAAAAAAAAARQnAQ'>
  </div>
</div>

### accomplish

Below we will introduce how to draw a simple`3D`Fill in the figure.

- you can`L7`Found on the official website[Online case](/examples/polygon/3d/#polygonstylemap)

```javascript
import { Scene, PolygonLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'dark',
    pitch: 50,
    center: [ 118.8, 32.056 ],
    zoom: 10
  })
});
scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/bmw-prod/94763191-2816-4c1a-8d0d-8bcf4181056a.json')
    .then(res => res.json())
    .then(data => {
      const filllayer = new PolygonLayer({
        name: 'fill',
        zIndex: 3
      })
        .source(data)
        .shape('extrude')
        .color('unit_price', [
        '#87CEFA',
        '#00BFFF',
        '#7FFFAA',
        '#00FF7F',
        '#32CD32',
        '#F0E68C',
        '#FFD700',
        '#FF7F50',
        '#FF6347',
        '#FF0000'
      ])
        .size('unit_price', unit_price => unit_price * 50)
        .style({
          opacity:{
            field:'unit_price',
            value: [ 0, 1 ]
          }
          pickLight: true
        })
      scene.addLayer(filllayer);
    });
});
```

### source

It is recommended to use the standard geometry layer`GeoJSON`data.

### shape

3D Polygon Stretch the polygon upward along the Z axis

- extrude constants do not support data mapping

```javascript
layer.shape('extrude');
```

### size

size represents the height of the stretch and supports data mapping

```javascript
layer.size(10); // Set height to constant
layer.size('floor', [0, 2000]); // Data mapping based on floor field defaults to line
layer.size('floor', (floor) => {
  //Set size through callback function
  return floor * 2;
});
```

### style

- `pickLight`Sets whether the picking highlight color of the 3D fill map calculates lighting.

`pickLight`The default is`false`Indicates that lighting calculations will not be performed on the picked colors. When turned on, some additional calculations will be added.

```javascript
style({
  pickLight: true, //default is false
});
```

- `heightFixed`set up`3D`The height of the fill image is always fixed.

default`3D`The height of the filled image will be`zoom`The level is related, and is used to keep the pixel length of the graphics height constant, and in some cases we need to keep the actual height of the graphics unchanged rather than the pixel height.

```javascript
style({
  heightfixed: true, //default is false
});
```

🌟 Supported starting from v2.7.6.

[Online case](/examples/react/covid#covid_extrude)

- `raisingHeight`set up`3D`The elevation of the fill pattern.

🌟 The prerequisite for setting the lifting height is`heightfixed`for`true`。\
🌟 Supported starting from v2.8.17.

<img width="40%" style="display: block;margin: 0 auto;" alt="面图层填充图" src="https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*D8GeSKNZxWIAAAAAAAAAAAAAARQnAQ">

[Online case](/examples/polygon/3d#floatmap)

- `mapTexture`set up`3D`The top texture of the fill image.
  🌟 Setting up`mapTexture`allows the user to configure the gradient color on the side.
  🌟 Supported starting from v2.8.17.

<img width="40%" style="display: block;margin: 0 auto;" alt="面图层填充图" src="https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*K18EQZoe4awAAAAAAAAAAAAAARQnAQ">

```javascript
const provincelayer = new PolygonLayer({})
  .source(data)
  .size(150000)
  .shape('extrude')
  .color('#0DCCFF')
  .style({
    heightfixed: true,
    pickLight: true,
    raisingHeight: 200000,
    mapTexture:
      'https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*0tmIRJG9cQQAAAAAAAAAAAAAARQnAQ',
    sourceColor: '#333',
    targetColor: '#fff',
  });
```

- `topsurface`:`boolean`Controls the visibility of the top surface, the default is`true`。

- `sidesurface`:`boolean`Control the visibility of the sides, the default is`true`。

[Online case](/examples/polygon/3d#texture3D)
