---
title: "栅格-点图层"
language: "zh"
canonical: "https://l7.antv.antgroup.com/zh/examples/mask/basic/raster-point/"
---

# 栅格-点图层

[运行示例](https://l7.antv.antgroup.com/zh/examples/mask/basic/raster-point/)

[资料索引](/llms.txt)

页面需要一个 `id="container"` 的 DOM 元素。以下为原始示例源码。

## 源码

```ts
// @ts-ignore
import { PointLayer, RasterLayer, Scene } from '@antv/l7';
// @ts-ignore
import { GaodeMap } from '@antv/l7-maps';

import * as GeoTIFF from 'geotiff';

async function getTiffData() {
  const response = await fetch(
    'https://gw.alipayobjects.com/os/rmsportal/XKgkjjGaAzRyKupCBiYW.dat',
    // 'https://gw.alipayobjects.com/zos/antvdemo/assets/2019_clip/ndvi_201905.tiff',
  );
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
    min: 0,
    max: 8000,
  };
}

const scene = new Scene({
  id: 'map',

  map: new GaodeMap({
    center: [120.165, 30.26],
    pitch: 0,
    zoom: 2,
    style: 'dark',
  }),
});
scene.addImage(
  '00',
  'https://gw.alipayobjects.com/zos/basement_prod/604b5e7f-309e-40db-b95b-4fac746c5153.svg',
);
scene.on('loaded', async () => {
  const tiffdata = await getTiffData();
  const maskPointData = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {},
        geometry: {
          coordinates: [110.64070700180974, 38.725170221383365],
          type: 'Point',
        },
      },
      {
        type: 'Feature',
        properties: {},
        geometry: {
          coordinates: [117.05859241946035, 41.44428218345186],
          type: 'Point',
        },
      },
      {
        type: 'Feature',
        properties: {},
        geometry: {
          coordinates: [114.98363698367831, 37.113784885036424],
          type: 'Point',
        },
      },
      {
        type: 'Feature',
        properties: {},
        geometry: {
          coordinates: [118.77967948635097, 37.47208097958061],
          type: 'Point',
        },
      },
      {
        type: 'Feature',
        properties: {},
        geometry: {
          coordinates: [113.729012766695, 39.22535473120385],
          type: 'Point',
        },
      },
    ],
  };

  const maskPoint = new PointLayer({
    visible: false,
  })
    .source(maskPointData)
    .shape('circle')
    .size(100000)
    .color('#f00')
    .style({
      opacity: 0.5,
      unit: 'meter',
    });
  const layer = new RasterLayer({
    maskLayers: [maskPoint],
  });
  const mindata = -0;
  const maxdata = 8000;
  layer
    .source(tiffdata.data, {
      parser: {
        type: 'raster',
        width: tiffdata.width,
        height: tiffdata.height,
        extent: [73.482190241, 3.82501784112, 135.106618732, 57.6300459963],
      },
    })
    .style({
      opacity: 0.8,
      domain: [mindata, maxdata],
      clampLow: true,
      rampColors: {
        colors: [
          'rgb(166,97,26)',
          'rgb(223,194,125)',
          'rgb(245,245,245)',
          'rgb(128,205,193)',
          'rgb(1,133,113)',
        ],
        positions: [0, 0.25, 0.5, 0.75, 1.0],
      },
    });
  scene.addLayer(layer);
  scene.addLayer(maskPoint);
});
```

## 运行环境

运行示例前，先在含有 #container 的页面中等待以下初始化完成。相关文件附于文末。

```js
await (await import("/src/demo/setup.ts")).default({ container: document.getElementById('container'), path: "/examples/mask/basic/demo/raster-point.ts" });
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
