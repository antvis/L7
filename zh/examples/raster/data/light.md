---
title: "夜光图-线性色带"
language: "zh"
canonical: "https://l7.antv.antgroup.com/zh/examples/raster/data/light/"
---

# 夜光图-线性色带

[运行示例](https://l7.antv.antgroup.com/zh/examples/raster/data/light/)

[资料索引](/llms.txt)

页面需要一个 `id="container"` 的 DOM 元素。以下为原始示例源码。

## 源码

```js
// https://gw.alipayobjects.com/zos/antvdemo/assets/2019_clip/ndvi_201905.tif
import { RasterLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import * as GeoTIFF from 'geotiff';
const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'dark',
    center: [105, 37.5],
    zoom: 2.5,
  }),
});
scene.on('loaded', () => {
  addLayer();
});
async function getTiffData() {
  const response = await fetch(
    'https://gw.alipayobjects.com/zos/antvdemo/assets/light_clip/lightF182013.tiff',
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
  };
}

async function addLayer() {
  const tiffdata = await getTiffData();

  const layer = new RasterLayer({});
  layer
    .source(tiffdata.data, {
      parser: {
        type: 'raster',
        width: tiffdata.width,
        height: tiffdata.height,
        extent: [
          73.4821902409999979, 3.8150178409999995, 135.1066187319999869, 57.6300459959999998,
        ],
      },
    })
    .style({
      clampLow: false,
      clampHigh: false,
      domain: [0, 90],
      noDataValue: 0,
      rampColors: {
        type: 'linear', // 2.13.0 及以后版本支持
        colors: [
          'rgba(92,58,16,0)',
          'rgba(92,58,16,0)',
          '#fabd08',
          '#f1e93f',
          '#f1ff8f',
          '#fcfff7',
        ],
        positions: [0, 3, 9, 22.5, 45, 90],
      },
    });

  scene.addLayer(layer);
}
```

## 运行环境

运行示例前，先在含有 #container 的页面中等待以下初始化完成。相关文件附于文末。

```js
await (await import("/src/demo/setup.ts")).default({ container: document.getElementById('container'), path: "/examples/raster/data/demo/light.js" });
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
