---
title: "圆形扫光城市"
language: "en"
canonical: "https://l7.antv.antgroup.com/en/examples/gallery/animate/build-sweep/"
---

# 圆形扫光城市

[Live example](https://l7.antv.antgroup.com/en/examples/gallery/animate/build-sweep/)

[Resource index](/llms.txt)

Provide a DOM element with `id="container"`. The original example source follows.

## Source

```js
import { CityBuildingLayer, LineLayer, PolygonLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'dark',
    center: [120.145, 30.238915],
    pitch: 60,
    zoom: 13.2,
  }),
});
fetch('https://gw.alipayobjects.com/os/rmsportal/ggFwDClGjjvpSMBIrcEx.json').then(async (res) => {
  const pointLayer = new CityBuildingLayer();
  pointLayer
    .source(await res.json())
    .size('floor', [0, 500])
    .color('rgba(242,246,250,1.0)')
    .animate({
      enable: true,
    })
    .active({
      color: '#0ff',
      mix: 0.5,
    })
    .style({
      opacity: 0.7,
      baseColor: 'rgb(16, 16, 16)',
      windowColor: 'rgb(30, 60, 89)',
      brightColor: 'rgb(255, 176, 38)',
      sweep: {
        enable: true,
        sweepRadius: 2,
        sweepColor: '#1990FF',
        sweepSpeed: 0.5,
        sweepCenter: [120.145319, 30.238915],
      },
    });
  scene.addLayer(pointLayer);
});

fetch('https://gw.alipayobjects.com/os/bmw-prod/67130c6c-7f49-4680-915c-54e69730861d.json')
  .then((data) => data.json())
  .then(({ lakeBorderData, lakeData, landData }) => {
    const lakeLayer = new PolygonLayer()
      .source(lakeData)
      .shape('fill')
      .color('#1E90FF')
      .style({
        opacity: 0.4,
        opacityLinear: {
          enable: true,
          dir: 'out', // in - out
        },
      });
    const landLayer = new PolygonLayer()
      .source(landData)
      .shape('fill')
      .color('#3CB371')
      .style({
        opacity: 0.4,
        opacityLinear: {
          enable: true,
          dir: 'in', // in - out
        },
      });

    const lakeBorderLayer = new PolygonLayer()
      .source(lakeBorderData)
      .shape('fill')
      .color('#ccc')
      .style({
        opacity: 0.5,
        opacityLinear: {
          enable: true,
          dir: 'in', // in - out
        },
      });

    scene.addLayer(lakeLayer);
    scene.addLayer(lakeBorderLayer);
    scene.addLayer(landLayer);
  });

fetch('https://gw.alipayobjects.com/os/basement_prod/40ef2173-df66-4154-a8c0-785e93a5f18e.json')
  .then((res) => res.json())
  .then((data) => {
    const layer = new LineLayer({
      zIndex: 0,
      depth: true,
    })
      .source(data)
      .size(1)
      .shape('line')
      .color('#1990FF')
      .animate({
        interval: 1, // 间隔
        duration: 2, // 持续时间，延时
        trailLength: 2, // 流线长度
      });
    scene.addLayer(layer);
  });
```

## Runtime environment

Before evaluating the example, await this setup in a page containing #container. Supporting files follow below.

```js
await (await import("/src/demo/setup.ts")).default({ container: document.getElementById('container'), path: "/examples/gallery/animate/demo/build-sweep.js" });
```


## src/demo/setup.ts

```ts
import type { DemoSetupContext } from '@antv/astro-theme-antv';
import * as District from 'district-data';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default async function setup({ container, path }: DemoSetupContext) {
  // Tool pages provide their own React layout and SDK imports.
  if (!path.startsWith('/examples/')) return;
  // Retain only the original globals still used by gallery examples.
  Object.assign(window, { District, GLTFLoader });
  const map = document.createElement('div');
  map.id = 'map';
  container.append(map);
  await import('./map.css');
  // Match the original gallery's shared AMap environment, including raw AMap demos.
  await import('./amap');
}
```

## src/demo/map.css

```css
#map {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 320px;
}

.labelclass {
  position: absolute;
  display: inline;
  cursor: pointer;
  background: rgb(255, 228, 120);
  border: solid 2px #fff;
  padding: 4px;
  white-space: nowrap;
  font:
    bold 12px/18px arial,
    sans-serif;
  color: #fff;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  line-height: 30px;
  /* opacity: 0.7; */
  text-align: center;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
```

## src/demo/amap.ts

```ts
import AMapLoader from '@amap/amap-jsapi-loader';

// Preserve the site's development and production SDK registrations.
const credentials = import.meta.env.DEV
  ? { key: '6f025e700cbacbb0bb866712d20bb35c', securityJsCode: '290ddc4b0d33be7bc9b354bc6a4ca614' }
  : { key: 'f59bcf249433f8b05caaee19f349b3d7', securityJsCode: '2653011adeb04230b3a26cc9a780a800' };
window._AMapSecurityConfig = { securityJsCode: credentials.securityJsCode };
await AMapLoader.load({ key: credentials.key, version: '2.0', plugins: ['Map3D'] });
```
