---
title: City Build
order: 6
---

<embed src="@/docs/api/common/style.md"></embed>

## Introduction

`CityBuildingLayer`Used to build 3D models of urban buildings and display urban buildings

## use

```javascript
import { CityBuildingLayer } from '@antv/l7';
```

<img width="60%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_e7e1c6/afts/img/A*LoxeSZHuqXwAAAAAAAAAAAAAARQnAQ'>

### animate

Whether to enable animation effects, only supported`boolean`or`enable: boolean`Configuration items

```javascript
layer.animate(true);

layer.animatte({
  enable: true,
});
```

✨ After turning on animate, the animation of lighting up the windows will be turned on by default\
🌟 Turning on animate animation is the prerequisite for turning on sweeping animation.

### style

- baseColor building color,
- windowColor: window color,
- brightColor: brighten window color
- sweep: Configuration items related to circular sweep and diffusion animation
  - enable: whether to enable scanning and diffusion
  - sweepRadius: spread radius
  - sweepCenter: diffusion center store coordinates
  - sweepColor: spread color
  - sweepSpeed: diffusion speed
- baseColor: base color when sweep is enabled

Other style configuration items are the same as

[baselayer#style](/api/base_layer/base#style)

## Custom animation frequency

Custom animation frequency requires turning off the default animation by`setLight`Method keeps updating time

### setLight(time)

parameter
time: time milliseconds

```js
import { CityBuildingLayer, Scene } from '@antv/l7';
import { Mapbox } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new Mapbox({
    style: 'dark',
    center: [121.507674, 31.223043],
    pitch: 65.59312320916906,
    zoom: 15.4,
    minZoom: 15,
    maxZoom: 18,
  }),
});
const buildingLayer = new CityBuildingLayer();
buildingLayer.animate(false);

let i = 0;
function step() {
  buildingLayer.setLight(i++);
  scene.render();
  requestAnimationFrame(step);
}

scene.on('loaded', () => {
  step();
});
```

#### demo

```javascript
import { Scene, CityBuildingLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'dark',
    center: [120.173104, 30.244072],
    pitch: 70.41138037735848,
    zoom: 17.18,
    rotation: 2.24, // 358.7459759480504
    minZoom: 14,
  }),
});

scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/rmsportal/ggFwDClGjjvpSMBIrcEx.json')
    .then((res) => res.json())
    .then((data) => {
      const layer = new CityBuildingLayer({
        zIndex: 0,
      });
      layer.source(data);
      scene.addLayer(layer);
    });
});
```

[Online case](/examples/gallery/animate#build_sweep)
