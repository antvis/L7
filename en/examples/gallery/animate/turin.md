---
title: "都灵道路图"
language: "en"
canonical: "https://l7.antv.antgroup.com/en/examples/gallery/animate/turin/"
---

# 都灵道路图

[Live example](https://l7.antv.antgroup.com/en/examples/gallery/animate/turin/)

[Resource index](/llms.txt)

Provide a DOM element with `id="container"`. The original example source follows.

## Source

```js
import { LineLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    center: [7.65, 45.053],
    zoom: 12,
    style: 'dark',
  }),
});
scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/bmw-prod/98a5d9ec-be97-44bd-bff0-5742d929c003.json')
    .then((res) => res.json())
    .then((data) => {
      const layer = new LineLayer({})
        .source(data)
        .shape('line')
        .color('highway', (v) => {
          switch (v) {
            case 'motorway':
              return '#F9D371';
            case 'motorway_link':
              return '#3DB2FF';
            case 'trunk':
              return 'green';
            case 'trunk_link':
              return '#6E85B2';
            case 'primary':
              return '#F47340';
            case 'primary_link':
              return '#F6A9A9';
            case 'secondary':
              return '#EF2F88';
            case 'secondary_link':
              return '#5F7A61';
            case 'tertiary':
              return '#1ee3cf';
            case 'tertiary_link':
              return '#C2F784';
            case 'pedestrian':
              return '#FFF89A';
            case 'residential':
              return 'rgba(22, 119, 255, .5)';
            case 'road':
              return '#93FFD8';
            case 'path':
              return '#BAFFB4';
            case 'unclassified':
              return '#D3DEDC';
            case 'service':
              return '#AEFEFF';
            case 'living_street':
              return '#9B0000';
            case 'track':
              return '#F5F5F5';
            case 'highway':
              return 'red';
            case 'rail':
              return '#08ffc8';
            default:
              return '#FFE3E3';
          }
        })
        .animate({
          interval: 1, // 间隔
          duration: 1, // 持续时间，延时
          trailLength: 2, // 流线长度
        });
      scene.addLayer(layer);
    });
});
```

## Runtime environment

Before evaluating the example, await this setup in a page containing #container. Supporting files follow below.

```js
await (await import("/src/demo/setup.ts")).default({ container: document.getElementById('container'), path: "/examples/gallery/animate/demo/turin.js" });
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
