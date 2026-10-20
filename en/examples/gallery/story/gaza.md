---
title: "加沙"
language: "en"
canonical: "https://l7.antv.antgroup.com/en/examples/gallery/story/gaza/"
---

# 加沙

[Live example](https://l7.antv.antgroup.com/en/examples/gallery/story/gaza/)

[Resource index](/llms.txt)

Provide a DOM element with `id="container"`. The original example source follows.

## Source

```js
import { PointLayer, PolygonLayer, RasterLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'light',
    center: [121.268, 30.3628],
    zoom: 10,
  }),
});
scene.on('loaded', async () => {
  const googleurl = 'https://www.google.com/maps/vt?lyrs=s@820&gl=cn&x={x}&y={y}&z={z}';
  const gazafill = await (
    await fetch(
      'https://mdn.alipayobjects.com/afts/file/A*7h8hS5hqXkcAAAAAAAAAAAAADrd2AQ/gaza.geo.json',
    )
  ).json();
  const gazacity = await (
    await fetch(
      'https://mdn.alipayobjects.com/afts/file/A*3xTGQ6ZeTIcAAAAAAAAAAAAADrd2AQ/gazacity.json',
    )
  ).json();

  const fillLayer = new PolygonLayer({
    visible: false,
  })
    .source(gazafill)
    .shape('fill')
    .color('red');

  const googleMap = new RasterLayer({
    zIndex: -1,
    maskLayers: [fillLayer],
    zoomOffset: 1,
    updateStrategy: 'overlap',
  }).source(googleurl, {
    parser: {
      type: 'rasterTile',
      tileSize: 256,
    },
  });

  const fillLine = new PolygonLayer({
    autoFit: true,
  })
    .source(gazafill)
    .shape('line')
    .color('red')
    .size(1);
  const cityLayer = new PointLayer()
    .source(gazacity)
    .shape('circle')
    .size(5)
    .color('#027aff')
    .style({ opacity: 1, stroke: '#fff', strokeWidth: 2 });
  const cityLayerName = new PointLayer()
    .source(gazacity)
    .shape('city', 'text')
    .size(12)
    .color('#027aff')
    .style({
      textAnchor: 'top', // 文本相对锚点的位置 center|left|right|top|bottom|top-left
      spacing: 2, // 字符间距
      fontWeight: '800',
      textOffset: [0, 30],
      padding: [1, 1], // 文本包围盒 padding [水平，垂直]，影响碰撞检测结果，避免相邻文本靠的太近
      stroke: '#ffffff', // 描边颜色
      strokeWidth: 2, // 描边宽度
      textAllowOverlap: true,
    });
  scene.addLayer(googleMap);
  scene.addLayer(fillLine);
  scene.addLayer(fillLayer);
  scene.addLayer(cityLayer);
  scene.addLayer(cityLayerName);
});
```

## Runtime environment

Before evaluating the example, await this setup in a page containing #container. Supporting files follow below.

```js
await (await import("/src/demo/setup.ts")).default({ container: document.getElementById('container'), path: "/examples/gallery/story/demo/gaza.js" });
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
