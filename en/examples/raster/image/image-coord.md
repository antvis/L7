---
title: "非矩形范围"
language: "en"
canonical: "https://l7.antv.antgroup.com/en/examples/raster/image/image-coord/"
---

# 非矩形范围

[Live example](https://l7.antv.antgroup.com/en/examples/raster/image/image-coord/)

[Resource index](/llms.txt)

Provide a DOM element with `id="container"`. The original example source follows.

## Source

```js
import { ImageLayer, PolygonLayer, RasterLayer, Scene } from '@antv/l7';
import { Map } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new Map({
    center: [121.268, 30.3628],
    zoom: 10,
  }),
});
scene.on('loaded', () => {
  const baseLayer = new RasterLayer({
    zIndex: 0,
  });
  baseLayer.source('https://webst0{1-4}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}', {
    parser: {
      type: 'rasterTile',
      tileSize: 256,
      zoomOffset: 0,
    },
  });

  const fill = new PolygonLayer()
    .source({
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [100.959388, 41.619522],
                [101.229887, 41.572654],
                [101.16971, 41.377836],
                [100.900015, 41.424628],
                [100.959388, 41.619522],
              ],
            ],
          },
        },
      ],
    })
    .shape('line')
    .color('red')
    .size(1)
    .style({ opacity: 1 });
  const layer = new ImageLayer({
    autoFit: true,
  });
  layer.source(
    'https://mdn.alipayobjects.com/huamei_gjo0cl/afts/img/A*vm_9S64uA0UAAAAAAAAAAAAADjDHAQ/original',

    {
      parser: {
        type: 'image',
        coordinates: [
          [100.959388, 41.619522],
          [101.229887, 41.572654],
          [101.16971, 41.377836],
          [100.900015, 41.424628],
        ],
      },
    },
  );
  scene.addLayer(baseLayer);
  scene.addLayer(layer);
  scene.addLayer(fill);
});
```

## Runtime environment

Before evaluating the example, await this setup in a page containing #container. Supporting files follow below.

```js
await (await import("/src/demo/setup.ts")).default({ container: document.getElementById('container'), path: "/examples/raster/image/demo/image-coord.js" });
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
