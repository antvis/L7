---
title: "中国区县地图"
language: "en"
canonical: "https://l7.antv.antgroup.com/en/examples/tile/vector/chinadistrictmap/"
---

# 中国区县地图

[Live example](https://l7.antv.antgroup.com/en/examples/tile/vector/chinadistrictmap/)

[Resource index](/llms.txt)

Provide a DOM element with `id="container"`. The original example source follows.

## Source

```ts
// @ts-ignore
import { LineLayer, PolygonLayer, Scene, Source } from '@antv/l7';
// @ts-ignore
import { Map } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',

  map: new Map({
    zoom: 4.5,
    center: [116.412427, 39.303573],
  }),
});

const url =
  'https://mvt.amap.com/district/CHN3/{z}/{x}/{y}/4096?key=309f07ac6bc48160e80b480ae511e1e9&version=';
const source = new Source(url, {
  parser: {
    type: 'mvt',
    tileSize: 256,
    warp: false,
  },
});

scene.on('loaded', () => {
  const colors = {};
  const getColorByAdcode = function (adcode) {
    if (!colors[adcode]) {
      const gb = Math.floor(Math.random() * 155 + 50);
      colors[adcode] = 'rgb(' + gb + ',' + gb + ',255)';
    }

    return colors[adcode];
  };
  // 绿地
  const fill = new PolygonLayer({
    sourceLayer: 'CHN_Districts',
  })
    .source(source)
    .shape('fill')
    .color('adcode', getColorByAdcode);

  const line = new LineLayer({
    sourceLayer: 'CHN_Districts_L',
  })
    .source(source)
    .shape('simple')
    .color('#fee0d2');

  const line2 = new LineLayer({
    sourceLayer: 'CHN_Citys_L',
  })
    .source(source)
    .shape('line')
    .size(0.6)
    .color('#fc9272');

  const line3 = new LineLayer({
    sourceLayer: 'CHN_Provinces_L',
  })
    .source(source)
    .shape('line')
    .size(0.6)
    .color('#de2d26');

  scene.addLayer(fill);
  scene.addLayer(line);
  scene.addLayer(line2);
  scene.addLayer(line3);
  //   scene.addLayer(line2);
  // const debugerLayer = new TileDebugLayer({ usage: 'basemap' });
  // scene.addLayer(debugerLayer);
});
```

## Runtime environment

Before evaluating the example, await this setup in a page containing #container. Supporting files follow below.

```js
await (await import("/src/demo/setup.ts")).default({ container: document.getElementById('container'), path: "/examples/tile/vector/demo/chinadistrictmap.ts" });
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
