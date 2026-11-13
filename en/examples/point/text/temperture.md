---
title: "气温图标标注"
language: "en"
canonical: "https://l7.antv.antgroup.com/en/examples/point/text/temperture/"
---

# 气温图标标注

[Live example](https://l7.antv.antgroup.com/en/examples/point/text/temperture/)

[Resource index](/llms.txt)

Provide a DOM element with `id="container"`. The original example source follows.

## Source

```js
import { LineLayer, PointLayer, PolygonLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'dark',
    pitch: 40,
    center: [118.8, 32.056],
    zoom: 12.5,
  }),
});
const fontFamily = 'iconfont';
const fontPath = '//at.alicdn.com/t/font_2534097_x6rsov3i1g.woff2?t=1622107341225';
scene.addIconFont('icon', '&#xe69e;');
scene.addFontFace(fontFamily, fontPath);

const colors = [
  '#87CEFA',
  '#00BFFF',

  '#7FFFAA',
  '#00FF7F',
  '#32CD32',

  '#F0E68C',
  '#FFD700',

  '#FF7F50',
  '#FF6347',
  '#FF0000',
];

scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/bmw-prod/94763191-2816-4c1a-8d0d-8bcf4181056a.json')
    .then((res) => res.json())
    .then((data) => {
      const filllayer = new PolygonLayer({
        name: 'fill',
        zIndex: 3,
      })
        .source(data)
        .shape('fill')
        .color('count', ['#f2f0f7', '#dadaeb', '#bcbddc', '#9e9ac8', '#756bb1', '#54278f'])
        .style({
          opacity: 0.6,
          opacityLinear: {
            enable: true,
            dir: 'out', // in - out
          },
        });
      scene.addLayer(filllayer);

      const linelayer = new LineLayer({
        zIndex: 5,
        name: 'line2',
      })
        .source(data)
        .shape('line')
        .size(1)
        .color('#fff')
        .style({
          opacity: 0.3,
        });
      scene.addLayer(linelayer);

      const pointLayer = new PointLayer({
        zIndex: 10,
      })
        .source(data)
        .shape('icon', 'text')
        .size(25)
        .color('count', (t) => {
          const c = Number(t.replace('℃', ''));
          return colors[Math.floor(((c - 18) / 16) * 10)];
        })
        .style({
          textAnchor: 'center', // 文本相对锚点的位置 center|left|right|top|bottom|top-left
          textOffset: [-25, 15],
          padding: [2, 2],
          fontFamily,
          iconfont: true,
          textAllowOverlap: true,
        });
      scene.addLayer(pointLayer);

      const tempertureLayer = new PointLayer({
        zIndex: 10,
      })
        .source(data)
        .shape('count', 'text')
        .size(12)
        .color('count', (t) => {
          const c = Number(t.replace('℃', ''));
          return colors[Math.floor(((c - 18) / 16) * 10)];
        })
        .style({
          textAnchor: 'center', // 文本相对锚点的位置 center|left|right|top|bottom|top-left
          textOffset: [35, 30],
          padding: [1, 1],
        });
      scene.addLayer(tempertureLayer);
    });
});
```

## Runtime environment

Before evaluating the example, await this setup in a page containing #container. Supporting files follow below.

```js
await (await import("/src/demo/setup.ts")).default({ container: document.getElementById('container'), path: "/examples/point/text/demo/temperture.js" });
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
