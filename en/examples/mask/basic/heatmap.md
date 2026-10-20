---
title: "热力图-多边形掩模"
language: "en"
canonical: "https://l7.antv.antgroup.com/en/examples/mask/basic/heatmap/"
---

# 热力图-多边形掩模

[Live example](https://l7.antv.antgroup.com/en/examples/mask/basic/heatmap/)

[Resource index](/llms.txt)

Provide a DOM element with `id="container"`. The original example source follows.

## Source

```ts
// @ts-ignore
import { HeatmapLayer, PolygonLayer, Scene } from '@antv/l7';
// @ts-ignore
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',

  map: new GaodeMap({
    center: [120.165, 30.26],
    pitch: 0,
    zoom: 2,
    style: 'dark',
  }),
});
scene.addImage(
  '00',
  'https://gw.alipayobjects.com/zos/basement_prod/604b5e7f-309e-40db-b95b-4fac746c5153.svg',
);
const maskData = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'MultiPolygon',
        coordinates: [
          [
            [
              [125.15625000000001, 8.407168163601076],
              [116.54296874999999, -21.289374355860424],
              [156.26953125, -20.632784250388013],
              [150.29296875, 2.1088986592431382],
            ],
          ],
          [
            [
              [78.57421875, 46.92025531537451],
              [51.67968749999999, 37.020098201368114],
              [87.890625, 28.76765910569123],
            ],
          ],
        ],
      },
    },
  ],
};

scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/basement_prod/d3564b06-670f-46ea-8edb-842f7010a7c6.json')
    .then((res) => res.json())
    .then((data) => {
      const polygonLayer = new PolygonLayer({ visible: true })
        .source(maskData)
        .shape('fill')
        .color('#f00')
        .style({ opacity: 0.4 });
      const heatmapLayer = new HeatmapLayer({
        maskLayers: [polygonLayer],
        mask: false,
      })
        .source(data)
        .shape('heatmap') // heatmap3D heatmap
        .size('mag', [0, 1.0]) // weight映射通道
        .style({
          intensity: 2,
          radius: 20,
          opacity: 1.0,
          rampColors: {
            colors: ['#FF4818', '#F7B74A', '#FFF598', '#91EABC', '#2EA9A1', '#206C7C'].reverse(),
            positions: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
          },
        });
      scene.addLayer(polygonLayer);
      scene.addLayer(heatmapLayer);
    });
});
```

## Runtime environment

Before evaluating the example, await this setup in a page containing #container. Supporting files follow below.

```js
await (await import("/src/demo/setup.ts")).default({ container: document.getElementById('container'), path: "/examples/mask/basic/demo/heatmap.ts" });
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
