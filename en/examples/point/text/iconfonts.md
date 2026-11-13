---
title: "天气图标标注"
language: "en"
canonical: "https://l7.antv.antgroup.com/en/examples/point/text/iconfonts/"
---

# 天气图标标注

[Live example](https://l7.antv.antgroup.com/en/examples/point/text/iconfonts/)

[Resource index](/llms.txt)

Provide a DOM element with `id="container"`. The original example source follows.

## Source

```js
import { PointLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    center: [120.5, 30.2],
    style: 'dark',
    zoom: 8.5,
    zooms: [8, 10],
  }),
});
const fontFamily = 'iconfont';
const fontPath = '//at.alicdn.com/t/font_2534097_ao9soua2obv.woff2?t=1622021146076';
scene.addFontFace(fontFamily, fontPath);
scene.addIconFonts([
  ['smallRain', '\ue6f7'],
  ['middleRain', '\ue61c'],
  ['hugeRain', '\ue6a6'],
  ['sun', '\ue6da'],
  ['cloud', '\ue8da'],
]);

scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/bmw-prod/9eb3f1b5-0c3b-49b2-8221-191d4ba8aa5e.json')
    .then((res) => res.json())
    .then((originData) => {
      const layer = new PointLayer()
        .source(originData, {
          parser: {
            type: 'json',
            x: 'lng',
            y: 'lat',
          },
        })
        .shape('circle')
        .color('backgoundColor')
        .size(42);
      scene.addLayer(layer);

      const pointIconFontLayer = new PointLayer({})
        .source(originData, {
          parser: {
            type: 'json',
            x: 'lng',
            y: 'lat',
          },
        })
        .shape('iconType', 'text')
        .size(30)
        .color('iconColor')
        .style({
          textAnchor: 'center', // 文本相对锚点的位置 center|left|right|top|bottom|top-left
          textOffset: [-10, 10], // 文本相对锚点的偏移量 [水平, 垂直]
          fontFamily,
          iconfont: true,
          textAllowOverlap: true,
        });
      scene.addLayer(pointIconFontLayer);

      const textLayer = new PointLayer({})
        .source(originData, {
          parser: {
            type: 'json',
            x: 'lng',
            y: 'lat',
          },
        })
        .shape('temperature', 'text')
        .size(10)
        .color('#ffffff')
        .style({
          textAnchor: 'center', // 文本相对锚点的位置 center|left|right|top|bottom|top-left
          textOffset: [5, -55], // 文本相对锚点的偏移量 [水平, 垂直]
          spacing: 2, // 字符间距
          padding: [1, 1], // 文本包围盒 padding [水平，垂直]，影响碰撞检测结果，避免相邻文本靠的太近
          stroke: '#ffffff', // 描边颜色
          strokeWidth: 0.3, // 描边宽度
          strokeOpacity: 1.0,
          fontFamily: 'Times New Roman',
          textAllowOverlap: true,
        });
      scene.addLayer(textLayer);

      const textLayer2 = new PointLayer({})
        .source(originData, {
          parser: {
            type: 'json',
            x: 'lng',
            y: 'lat',
          },
        })
        .shape('weather', 'text')
        .size(14)
        .color('#ffffff')
        .style({
          textAnchor: 'center', // 文本相对锚点的位置 center|left|right|top|bottom|top-left
          textOffset: [5, -15], // 文本相对锚点的偏移量 [水平, 垂直]
          spacing: 2, // 字符间距
          padding: [1, 1], // 文本包围盒 padding [水平，垂直]，影响碰撞检测结果，避免相邻文本靠的太近
          stroke: '#ffffff', // 描边颜色
          strokeWidth: 0.3, // 描边宽度
          strokeOpacity: 1.0,
          fontFamily: 'Times New Roman',
          textAllowOverlap: true,
        });
      scene.addLayer(textLayer2);
    });
});
```

## Runtime environment

Before evaluating the example, await this setup in a page containing #container. Supporting files follow below.

```js
await (await import("/src/demo/setup.ts")).default({ container: document.getElementById('container'), path: "/examples/point/text/demo/iconfonts.js" });
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
