---
title: "自定义 3D 地形（LOD）"
language: "en"
canonical: "https://l7.antv.antgroup.com/en/examples/geometry/geometry/terrain/"
---

# 自定义 3D 地形（LOD）

[Live example](https://l7.antv.antgroup.com/en/examples/geometry/geometry/terrain/)

[Resource index](/llms.txt)

Provide a DOM element with `id="container"`. The original example source follows.

## Source

```js
import { GeometryLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    center: [120.1025, 30.2594],
    style: 'dark',
    pitch: 65,
    rotation: 180,
    zoom: 14,
  }),
});
let currentZoom = 14,
  currentModelData = '100x100';

scene.on('loaded', () => {
  const layer = new GeometryLayer().shape('plane').style({
    width: 0.074,
    height: 0.061,
    center: [120.1025, 30.2594],
    widthSegments: 100,
    heightSegments: 100,
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

  let modelData10,
    modelData20 = null,
    modelData100;

  layer.on('terrainImageLoaded', () => {
    modelData10 = layer.layerModel.createModelData({
      widthSegments: 10,
      heightSegments: 10,
    });

    modelData20 = layer.layerModel.createModelData({
      widthSegments: 20,
      heightSegments: 20,
    });

    modelData100 = layer.layerModel.createModelData({
      widthSegments: 100,
      heightSegments: 100,
    });
  });

  scene.on('zoom', () => {
    const zoom = Math.floor(scene.getZoom());
    if (currentZoom !== zoom) {
      if (zoom > 13) {
        if (currentModelData !== '100x100') {
          layer.updateModelData(modelData100);
          currentModelData = '100x100';
        }
      } else if (zoom > 12) {
        if (currentModelData !== '20x20') {
          layer.updateModelData(modelData20);
          currentModelData = '20x20';
        }
      } else {
        if (currentModelData !== '10x10') {
          layer.updateModelData(modelData10);
          currentModelData = '10x10';
        }
      }
      currentZoom = zoom;
    }
  });
});
```

## Runtime environment

Before evaluating the example, await this setup in a page containing #container. Supporting files follow below.

```js
await (await import("/src/demo/setup.ts")).default({ container: document.getElementById('container'), path: "/examples/geometry/geometry/demo/terrain.js" });
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
