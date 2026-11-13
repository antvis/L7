---
title: "字体标注图层"
language: "en"
canonical: "https://l7.antv.antgroup.com/en/examples/composite-layers/l7plot/icon-layer/"
---

# 字体标注图层

[Live example](https://l7.antv.antgroup.com/en/examples/composite-layers/l7plot/icon-layer/)

[Resource index](/llms.txt)

Provide a DOM element with `id="container"`. The original example source follows.

## Source

```js
import { GaodeMap, Scene } from '@antv/l7';
import { IconFontLayer } from '@antv/l7-composite-layers';

// 详情可见：https://l7plot.antv.antgroup.com/api/composite-layers/icon-font-layer

fetch('https://gw.alipayobjects.com/os/bmw-prod/9eb3f1b5-0c3b-49b2-8221-191d4ba8aa5e.json')
  .then((response) => response.json())
  .then((data) => {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        pitch: 0,
        style: 'dark',
        zoom: 3,
        center: [120.19660949707033, 30.234747338474293],
      }),
    });
    scene.on('loaded', () => {
      const iconLayer = new IconFontLayer({
        id: 'iconImageLayer1',
        autoFit: true,
        source: {
          data,
          parser: {
            type: 'json',
            x: 'lng',
            y: 'lat',
          },
        },
        // color:{
        //   value:'red',
        // },
        iconAtlas: {
          fontFamily: 'iconfont',
          fontPath: '//at.alicdn.com/t/font_2534097_ao9soua2obv.woff2?t=1622021146076',
          iconFonts: [
            ['smallRain', '&#xe6f7;'],
            ['middleRain', '&#xe61c;'],
            ['hugeRain', '&#xe6a6;'],
            ['sun', '&#xe6da;'],
            ['cloud', '&#xe8da;'],
          ],
        },
        icon: {
          field: 'iconType',
          value: 'text',
        },
        iconStyle: {
          textAnchor: 'center', // 文本相对锚点的位置 center|left|right|top|bottom|top-left
          textOffset: [-10, 10], // 文本相对锚点的偏移量 [水平, 垂直]
          fontFamily: 'iconfont',
          textAllowOverlap: true,
          iconfont: true,
        },
        fillColor: 'blue',
        radius: 40,
        opacity: 1,
        label: {
          visible: false,
          field: 'weather',
          style: {
            fill: '#fff',
            opacity: 0.6,
            fontSize: 12,
            textAnchor: 'top',
            textOffset: [0, 20],
            spacing: 1,
            padding: [5, 5],
            stroke: '#ffffff',
            strokeWidth: 0.3,
            strokeOpacity: 1.0,
          },
        },
        state: {
          active: {
            color: 'red',
          },
          select: {
            radius: 20,
            opacity: 1,
          },
        },
      });
      scene && iconLayer.addTo(scene);
    });
  });
```

## Runtime environment

Before evaluating the example, await this setup in a page containing #container. Supporting files follow below.

```js
await (await import("/src/demo/setup.ts")).default({ container: document.getElementById('container'), path: "/examples/composite-layers/l7plot/demo/icon-layer.js" });
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
