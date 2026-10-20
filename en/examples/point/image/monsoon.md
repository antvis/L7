---
title: "季风分布"
language: "en"
canonical: "https://l7.antv.antgroup.com/en/examples/point/image/monsoon/"
---

# 季风分布

[Live example](https://l7.antv.antgroup.com/en/examples/point/image/monsoon/)

[Resource index](/llms.txt)

Provide a DOM element with `id="container"`. The original example source follows.

## Source

```js
import { LineLayer, PointLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'dark',
    center: [105, 35],
    zoom: 2.5,
  }),
});

scene.addImage(
  'arrRed',
  'https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*KWGqT6Oz50EAAAAAAAAAAAAAARQnAQ',
);
scene.addImage(
  'arrBlue',
  'https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*ZKhURq53OgIAAAAAAAAAAAAAARQnAQ',
);

scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/bmw-prod/4c02515b-cb7a-47be-93cf-5596731ef982.json')
    .then((res) => res.json())
    .then((monsoon) => {
      const { data, borderData } = monsoon;
      const imageLayer = new PointLayer()
        .source(data)
        .shape('wind', (wind) => {
          if (wind === 'up') {
            return 'arrBlue';
          }
          return 'arrRed';
        })
        .size(15)
        .style({
          rotation: {
            field: 'r',
            value: [0, 90, 180, 270],
          },
          billboard: false, // 图片图层只有非精灵模式支持旋转
        });
      scene.addLayer(imageLayer);

      const border = new LineLayer()
        .source(borderData)
        .size(1.5)
        .color('#575757')
        .style({
          lineType: 'dash',
          dashArray: [5, 5],
        });
      scene.addLayer(border);

      const text = new PointLayer({ zIndex: 2 })
        .source(
          [
            { lng: 90, lat: 35, n: '非季风区' },
            { lng: 125, lat: 30, n: '季风区' },
          ],
          {
            parser: {
              type: 'json',
              x: 'lng',
              y: 'lat',
            },
          },
        )
        .shape('n', 'text')
        .size(25)
        .color('#575757')
        .style({
          spacing: 20,
        });

      scene.addLayer(text);
    });
});
```

## Runtime environment

Before evaluating the example, await this setup in a page containing #container. Supporting files follow below.

```js
await (await import("/src/demo/setup.ts")).default({ container: document.getElementById('container'), path: "/examples/point/image/demo/monsoon.js" });
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
