---
title: "卷帘对比-作物长势"
language: "zh"
canonical: "https://l7.antv.antgroup.com/zh/examples/gallery/basic/swipe/"
---

# 卷帘对比-作物长势

[运行示例](https://l7.antv.antgroup.com/zh/examples/gallery/basic/swipe/)

[资料索引](/llms.txt)

页面需要一个 `id="container"` 的 DOM 元素。以下为原始示例源码。

## 源码

```ts
import { Map, RasterLayer, Scene, Swipe } from '@antv/l7';
import * as GeoTIFF from 'geotiff';

const scene = new Scene({
  id: 'map',
  map: new Map({
    pitch: 0,
    center: [-96, 37.8],
    zoom: 14,
  }),
});
async function getTiffData(url: string) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const tiff = await GeoTIFF.fromArrayBuffer(arrayBuffer);
  const image = await tiff.getImage();
  const width = image.getWidth();
  const height = image.getHeight();
  const values = await image.readRasters();
  return {
    data: values[0],
    width,
    height,
  };
}
scene.on('loaded', async () => {
  const colors = [
    '#d73027',
    '#f46d43',
    '#fdae61',
    '#fee08b',
    '#d9ef8b',
    '#a6d96a',
    '#66bd63',
    '#1a9850',
  ];
  const ndvi1 = await getTiffData(
    'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/file/A*sZpWQZK21NIAAAAAAAAAAAAADmJ7AQ/ndvi2022-03-01.glb',
  );
  const ndvi2 = await getTiffData(
    'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/file/A*JeHQTIzN4_kAAAAAAAAAAAAADmJ7AQ/ndvi2022-10-01.NDVI.glb',
  );

  // 影像地图图层
  const baseLayer = new RasterLayer({ zIndex: -1 }).source(
    'https://www.google.com/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}',
    {
      parser: {
        type: 'rasterTile',
        tileSize: 256,
        zoomOffset: 0,
      },
    },
  );

  const leftLayer = new RasterLayer({
    autoFit: true,
  })
    .source(ndvi1.data, {
      parser: {
        type: 'raster',
        width: ndvi1.width,
        height: ndvi1.height,
        extent: [-112.117293306503, 32.78212288135407, -111.77216057434428, 33.10568277278276],
      },
    })
    .style({
      clampLow: false,
      clampHigh: false,
      domain: [-1, 1],
      nodataValue: 0,
      rampColors: {
        type: 'linear',
        positions: [-0.4, -0.2, 0, 0.2, 0.4, 0.6, 0.8, 1.0], // 数据需要换成 0-1
        colors: colors,
      },
    });

  const rightLayer = new RasterLayer({})
    .source(ndvi2.data, {
      parser: {
        type: 'raster',
        width: ndvi2.width,
        height: ndvi2.height,
        extent: [-112.117293306503, 32.78212288135407, -111.77216057434428, 33.10568277278276],
      },
    })
    .style({
      clampLow: false,
      clampHigh: false,
      domain: [-1, 1],
      nodataValue: 0,
      rampColors: {
        type: 'linear',
        positions: [-0.4, -0.2, 0, 0.2, 0.4, 0.6, 0.8, 1.0], // 数据需要换成 0-1
        colors: colors,
      },
    });

  scene.addLayer(baseLayer);
  scene.addLayer(leftLayer);
  scene.addLayer(rightLayer);

  const swipe = new Swipe({
    orientation: 'vertical',
    ratio: 0.5,
    layers: [leftLayer],
    rightLayers: [rightLayer],
  });
  scene.addControl(swipe);
});
```

## 运行环境

运行示例前，先在含有 #container 的页面中等待以下初始化完成。相关文件附于文末。

```js
await (await import("/src/demo/setup.ts")).default({ container: document.getElementById('container'), path: "/examples/gallery/basic/demo/swipe.ts" });
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
