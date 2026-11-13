---
title: "地图交互"
language: "en"
canonical: "https://l7.antv.antgroup.com/en/examples/polygon/fill/usa/"
---

# 地图交互

[Live example](https://l7.antv.antgroup.com/en/examples/polygon/fill/usa/)

[Resource index](/llms.txt)

Provide a DOM element with `id="container"`. The original example source follows.

## Source

```js
import { LineLayer, PolygonLayer, Popup, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'light',
    center: [-96, 37.8],
    zoom: 3,
  }),
});
scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/basement_prod/d36ad90e-3902-4742-b8a2-d93f7e5dafa2.json')
    .then((res) => res.json())
    .then((data) => {
      const color = [
        'rgb(255,255,217)',
        'rgb(237,248,177)',
        'rgb(199,233,180)',
        'rgb(127,205,187)',
        'rgb(65,182,196)',
        'rgb(29,145,192)',
        'rgb(34,94,168)',
        'rgb(12,44,132)',
      ];
      const layer = new PolygonLayer({})
        .source(data)
        .scale('density', {
          type: 'quantile',
        })
        .color('density', color)
        .shape('fill')
        .active(true);
      const layer2 = new LineLayer({
        zIndex: 2,
      })
        .source(data)
        .color('#fff')
        .active(true)
        .size(1)
        .style({
          lineType: 'dash',
          dashArray: [2, 2],
        });
      scene.addLayer(layer);
      scene.addLayer(layer2);

      layer.on('mousemove', (e) => {
        const popup = new Popup({
          offsets: [0, 0],
          closeButton: false,
        })
          .setLnglat(e.lngLat)
          .setHTML(`<span>${e.feature.properties.name}: ${e.feature.properties.density}</span>`);
        scene.addPopup(popup);
      });
    });
});
```

## Runtime environment

Before evaluating the example, await this setup in a page containing #container. Supporting files follow below.

```js
await (await import("/src/demo/setup.ts")).default({ container: document.getElementById('container'), path: "/examples/polygon/fill/demo/usa.js" });
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
