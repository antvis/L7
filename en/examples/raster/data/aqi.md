---
title: "空气质量-栅格"
language: "en"
canonical: "https://l7.antv.antgroup.com/en/examples/raster/data/aqi/"
---

# 空气质量-栅格

[Live example](https://l7.antv.antgroup.com/en/examples/raster/data/aqi/)

[Resource index](/llms.txt)

Provide a DOM element with `id="container"`. The original example source follows.

## Source

```js
// 空气质量
// https://gw.alipayobjects.com/zos/antvdemo/assets/2019_clip/ndvi_201905.tif
import { PolygonLayer, RasterLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import * as GeoTIFF from 'geotiff';
const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    center: [121.268, 30.3628],
    zoom: 3,
    token: '6f025e700cbacbb0bb866712d20bb35c',
  }),
});
async function getTiffData() {
  const response = await fetch(
    'https://static.sencdn.com/stargazer/tiffs/forecast_aqi/2024020200_2024020211.tiff',
  );
  const arrayBuffer = await response.arrayBuffer();
  return arrayBuffer;
}
scene.on('loaded', async () => {
  const tiffdata = await getTiffData();
  const tiff = await GeoTIFF.fromArrayBuffer(tiffdata);
  const image = await tiff.getImage();
  const width = image.getWidth();
  const height = image.getHeight();
  const values = await image.readRasters();

  fetch('https://gw.alipayobjects.com/os/basement_prod/d2e0e930-fd44-4fca-8872-c1037b0fee7b.json')
    .then((res) => res.json())
    .then(async (maskData) => {
      const polygonLayer = new PolygonLayer({
        visible: false,
      })
        .source(maskData)
        .shape('fill')
        .color('#f00')
        .style({ opacity: 0.5 });

      const layer = new RasterLayer({
        maskLayers: [polygonLayer],
        autoFit: true,
      });
      layer
        .source(values[0], {
          parser: {
            type: 'raster',
            width,
            height,
            extent: [73, 17, 135.95, 53.95],
          },
        })
        .style({
          opacity: 1,
          clampLow: false,
          clampHigh: false,
          domain: [-0, 500],
          rampColors: {
            type: 'linear',
            colors: ['#d7191c', '#fdae61', '#ffffbf', '#a6d96a'].reverse(),
            positions: [0, 50, 100, 150, 300, 500],
          },
        });

      scene.addLayer(layer);
      scene.addLayer(polygonLayer);
    });
});
```

## Runtime environment

Before evaluating the example, await this setup in a page containing #container. Supporting files follow below.

```js
await (await import("/src/demo/setup.ts")).default({ container: document.getElementById('container'), path: "/examples/raster/data/demo/aqi.js" });
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
