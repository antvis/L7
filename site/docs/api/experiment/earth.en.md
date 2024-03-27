---
title: Earth Mode
order: 1
---

<embed src="@/docs/api/common/style.md"></embed>

## Introduction

l7-maps provides`Earth`Maps, compared to AMap and mapbox maps, are a completely different form of expression, providing visual display capabilities from a global perspective and providing users with more visual expressions of geographical information.

✨ In order to distinguish from ordinary maps, l7-maps provides a brand new`Earth`Map type, L7 provides corresponding`EarthLayer`Layers

```js
import { EarthLayer } from '@antv/l7';
import { Earth } from '@antv/l7-maps';
```

## Currently supported layer types in Earth mode

### point layer

**Plane point: circle**

<img width="450px" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*PD6fTbs7E3gAAAAAAAAAAAAAARQnAQ'>

**cylindrical point: cylinder**

<img width="450px" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*n6tYQKceveUAAAAAAAAAAAAAARQnAQ'>

### line layer

**3D arc: arc3d**

<img width="450px" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*FjhGT77aCaIAAAAAAAAAAAAAARQnAQ'>

## use

```javascript
// 1. Introduce the corresponding module
import { Scene, Earth } from '@antv/l7-maps';
import { EarthLayer } from '@antv/l7-layers';

// 2. Build Earth Map
const scene = new Scene({
  id: 'map',
  map: new Earth({}),
});

// 3. Construct the earth layer. The current shape is base, which represents the basic sphere.
const earthlayer = new EarthLayer()
  .source(
    //Texture of the Earth's surface
    'https://gw.alipayobjects.com/mdn/rms_23a451/afts/img/A*3-3NSpqRqUoAAAAAAAAAAAAARQnAQ',
    {
      parser: {
        type: 'image',
        extent: [121.168, 30.2828, 121.384, 30.421],
      },
    },
  )
  .color('#f00')
  .shape('base')
  .style({
    opacity: 1.0,
    radius: 40,
    globalOptions: {
      ambientRatio: 0.6, // ambient light
      diffuseRatio: 0.4, // diffuse reflection
      specularRatio: 0.1, // specular reflection
      earthTime: 0.1,
    },
  })
  .animate(true);

scene.on('loaded', () => {
  // 4. Add a basic earth sphere
  scene.addLayer(earthlayer);
});
//After the above steps, we can add a basic earth to the scene
```

## Independent map type Earth

### Constructor Earth

As the base map type of l7-maps,`Earth`The camera system of the earth system is provided. Currently, only an empty object needs to be passed in.

- args:**{}**

```js
import { Scene, Earth } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new Earth({}),
});
```

### rotateY

Provides a simple method to control the rotation of the earth system (actually controlling the rotation of the camera, you need to pass in an object

- force:`false`Determine whether to force it to take effect. By default, this method has a lower priority than the user's mouse operation. When the user operates the camera, this method will fail.
- reg:`0.01`Angle of rotation (visual rotation angle of the earth),`reg`It does not represent the actual rotation angle, but the ratio of the unit rotation angle.\
  🌟Unit rotation angle = Math.min(this.earthCameraZoom \* this.earthCameraZoom, 1)

```js
import { Scene, Earth } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new Earth({}),
});

function step() {
  scene.map.rotateY({
    option: {
      force: true,
      reg: 0.1,
    },
  });
  requestAnimationFrame(step);
}

scene.on('loaded', () => {
  scene.addLayer(earthlayer);
  step();
});
```

## Map layer EarthLayer

The earth layer is different from the layers of ordinary Gaode maps and Mapbox maps. It can only be used in earth mode and is used to represent the earth's sphere, atmosphere, glow and other effects.\
🌟 Use different`shape`Parameters represent the differences between different earth layers.

### Earth sphere layer baseLayer

- source: data

  - map: The address of the earth's surface texture map
  - parser: Parser, currently you only need to write fixed object values:`{ parser: { type: "image" } }`

- shape: layer type

  The default value is`base`, currently supported`shape`Types are:

  - base: sphere
  - atomSphere: atmosphere
  - bloomSphere: Shining

  When the user's`shape`When the parameter is not recognized, it is automatically downgraded to`base`type

- globalOptions: layer style
  - ambientRatio: ambient light
  - diffuseRatio: diffuse reflection
  - specularRatio: specular reflection

```javascript
const earthlayer = new EarthLayer()
  .source('https://gw.alipayobjects.com/mdn/rms_23a451/afts/img/A*3-3NSpqRqUoAAAAAAAAAAAAARQnAQ', {
    parser: {
      type: 'image',
    },
  })
  .shape('base')
  .style({
    globalOptions: {
      ambientRatio: 0.6, // ambient light
      diffuseRatio: 0.4, // diffuse reflection
      specularRatio: 0.1, // specular reflection
    },
  });
```

<img src="https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*i_TBRZRLSuYAAAAAAAAAAAAAARQnAQ" style="display: block; margin: 0 auto" alt="L7 地球图层" width="450px">

### Earth Inner Glow/Atmosphere layer atomLayer

`atomLayer`As the effect layer of the earth, there is no need to pass in data, so you don’t need to call it.`source`method

```javascript
const atomLayer = new EarthLayer().color('#2E8AE6').shape('atomSphere').style({
  //Can control the luminescence level
  opacity: 1,
});
```

<img src="https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*1MU_RZQyFTkAAAAAAAAAAAAAARQnAQ" style="display: block; margin: 0 auto" alt="L7 地球图层大气效果" width="450px" >

### Earth's internal and external glow/glow layer bloomLayer

`bloomLayer`As the effect layer of the earth, there is no need to pass in data, so you don’t need to call it.`source`method

```javascript
const bloomLayer = new EarthLayer().color('#fff').shape('bloomSphere').style({
  opacity: 0.5,
});
```

<img src="https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*FTniTZOZkNUAAAAAAAAAAAAAARQnAQ" style="display: block; margin: 0 auto" alt="L7 地球图层辉光效果" width="450px" >
