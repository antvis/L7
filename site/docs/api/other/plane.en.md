---
title: PlaneGeometry
order: 0
---

<embed src="@/docs/api/common/style.md"></embed>

## Introduction

PlaneGeometry is a general plane geometry graphic provided by L7, which is expressed as a ground-fitting rectangle that can be customized with position, size and number of segments.

### demo

Set a normal rectangle

```javascript
import { Scene, GeometryLayer } from '@antv/l7';

const layer = new GeometryLayer()
  .shape('plane')
  .style({
    opacity: 0.8,
    width: 0.074,
    height: 0.061,
    center: [120.1025, 30.2594],
  })
  .active(true)
  .color('#ff0');
scene.addLayer(layer);
```

<img width="60%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*7DpqRrE0LM4AAAAAAAAAAAAAARQnAQ'>

[Online case](/examples/geometry/geometry#plane)

Set 3D terrain mode

```javascript
import { Scene, GeometryLayer } from '@antv/l7';

const layer = new GeometryLayer().shape('plane').style({
  width: 0.074,
  height: 0.061,
  center: [120.1025, 30.2594],
  widthSegments: 200,
  heightSegments: 200,
  terrainClipHeight: 1,
  mapTexture:
    'https://gw.alipayobjects.com/mdn/rms_23a451/afts/img/A*gA0NRbuOF5cAAAAAAAAAAAAAARQnAQ',
  terrainTexture:
    'https://gw.alipayobjects.com/mdn/rms_23a451/afts/img/A*eYFaRYlnnOUAAAAAAAAAAAAAARQnAQ',
  rgb2height: (r, g, b) => {
    let h = (r * 255.0 * 256.0 * 256.0 + g * 255.0 * 256.0 + b * 255.0) * 0.1;
    h = h / 200 - 12750;
    h = Math.max(0, h);
    return h;
  },
});
scene.addLayer(layer);
```

<img width="60%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*mkPtQJVN8eQAAAAAAAAAAAAAARQnAQ'>

[Online case](/examples/geometry/geometry#terrain)

### source

🌟 PlaneGeometry does not need to set the source, we give its position information through center in style.

### style

PlaneGeometry mainly sets position, size and other properties through the style method.

#### center: \[lng: number, lat: number]

Sets the position of the PlaneGeometry. The positioning is the geometric center of the PlaneGeometry. PlaneGeometry is placed close to the ground.

#### width: number

Sets the width of the PlaneGeometry in longitude.

#### height: number

Sets the height of the PlaneGeometry in latitude.

#### widthSegments: number

Set the number of segments of the PlaneGeometry in the latitude direction.

#### heightSegments: number

Set the number of segments of the PlaneGeometry in the longitude direction.

#### mapTexture: string

PlaneGeometry texture map URL.

#### terrainTexture: string

PlaneGeometry height map URL, when this parameter exists, L7 will automatically parse the elevation information.

#### terrainClipHeight: number

Specifies the clipping height of the 3D terrain. In some cases, we may only need to retain the parts where hills and mountains exist. Through this parameter, we can specify that parts of the terrain whose height is lower than this parameter value are not displayed.

<img width="60%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*-SpgT6R05bcAAAAAAAAAAAAAARQnAQ'>

#### rgb2height: (r: number, g: number, b: number) => number

This is a callback function, and the parameter is the rgb information of the terrain map parsed by L7. Users can use this function to define the calculation logic of the height value (the calculation logic of different terrain maps is different).

🌟 widthSegments/heightSegments specifies the number of segments of planeGeometry. The more segments, the smoother the terrain and the greater the performance consumption.
