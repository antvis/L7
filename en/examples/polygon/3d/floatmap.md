---
title: "漂浮地图板块"
language: "en"
canonical: "https://l7.antv.antgroup.com/en/examples/polygon/3d/floatmap/"
---

# 漂浮地图板块

[Live example](https://l7.antv.antgroup.com/en/examples/polygon/3d/floatmap/)

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
    center: [120, 29.732983],
    zoom: 6.2,
    pitch: 60,
  }),
});
scene.on('loaded', () => {
  let lineDown, lineUp, textLayer;

  fetch('https://gw.alipayobjects.com/os/bmw-prod/ecd1aaac-44c0-4232-b66c-c0ced76d5c7d.json')
    .then((res) => res.json())
    .then((data) => {
      const texts = [];

      data.features.map((option) => {
        const { name, center } = option.properties;
        const [lng, lat] = center;
        texts.push({ name, lng, lat });
        return '';
      });

      textLayer = new PointLayer({ zIndex: 2 })
        .source(texts, {
          parser: {
            type: 'json',
            x: 'lng',
            y: 'lat',
          },
        })
        .shape('name', 'text')
        .size(14)
        .color('#0ff')
        .style({
          textAnchor: 'center', // 文本相对锚点的位置 center|left|right|top|bottom|top-left
          spacing: 2, // 字符间距
          padding: [1, 1], // 文本包围盒 padding [水平，垂直]，影响碰撞检测结果，避免相邻文本靠的太近
          stroke: '#0ff', // 描边颜色
          strokeWidth: 0.2, // 描边宽度
          raisingHeight: 200000 + 150000 + 10000,
          textAllowOverlap: true,
        });
      scene.addLayer(textLayer);

      lineDown = new LineLayer().source(data).shape('line').color('#0DCCFF').size(1).style({
        raisingHeight: 200000,
      });

      lineUp = new LineLayer({ zIndex: 1 })
        .source(data)
        .shape('line')
        .color('#0DCCFF')
        .size(1)
        .style({
          raisingHeight: 200000 + 150000,
        });

      scene.addLayer(lineDown);
      scene.addLayer(lineUp);
      return '';
    });

  fetch('https://gw.alipayobjects.com/os/bmw-prod/d434cac3-124e-4922-8eed-ccde01674cd3.json')
    .then((res) => res.json())
    .then((data) => {
      const lineLayer = new LineLayer().source(data).shape('wall').size(150000).style({
        heightfixed: true,
        opacity: 0.6,
        sourceColor: '#0DCCFF',
        targetColor: 'rbga(255,255,255, 0)',
      });
      scene.addLayer(lineLayer);

      const provincelayer = new PolygonLayer({})
        .source(data)
        .size(150000)
        .shape('extrude')
        .color('#0DCCFF')
        .active({
          color: 'rgb(100,230,255)',
        })
        .style({
          heightfixed: true,
          pickLight: true,
          raisingHeight: 200000,
          opacity: 0.8,
        });

      scene.addLayer(provincelayer);

      provincelayer.on('mousemove', () => {
        provincelayer.style({
          raisingHeight: 200000 + 100000,
        });
        lineDown.style({
          raisingHeight: 200000 + 100000,
        });
        lineUp.style({
          raisingHeight: 200000 + 150000 + 100000,
        });
        textLayer.style({
          raisingHeight: 200000 + 150000 + 10000 + 100000,
        });
      });

      provincelayer.on('unmousemove', () => {
        provincelayer.style({
          raisingHeight: 200000,
        });
        lineDown.style({
          raisingHeight: 200000,
        });
        lineUp.style({
          raisingHeight: 200000 + 150000,
        });
        textLayer.style({
          raisingHeight: 200000 + 150000 + 10000,
        });
      });
      return '';
    });
  return '';
});
```

## Runtime environment

Before evaluating the example, await this setup in a page containing #container. Supporting files follow below.

```js
await (await import("/src/demo/setup.ts")).default({ container: document.getElementById('container'), path: "/examples/polygon/3d/demo/floatmap.js" });
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
