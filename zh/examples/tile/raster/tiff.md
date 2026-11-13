---
title: "TIFF 土地覆盖"
language: "zh"
canonical: "https://l7.antv.antgroup.com/zh/examples/tile/raster/tiff/"
---

# TIFF 土地覆盖

[运行示例](https://l7.antv.antgroup.com/zh/examples/tile/raster/tiff/)

[资料索引](/llms.txt)

页面需要一个 `id="container"` 的 DOM 元素。以下为原始示例源码。

## 源码

```js
import { PolygonLayer, RasterLayer, Scene, Source } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import * as GeoTIFF from 'geotiff';

const colorList = [
  '#419bdf', // Water

  '#358221', // Tree

  '#88b053', // Grass

  '#7a87c6', // vegetation

  '#e49635', // Crops

  '#dfc35a', // shrub

  '#ED022A', // Built Area

  '#EDE9E4', // Bare ground

  '#F2FAFF', // Snow

  '#C8C8C8', // Clouds
];
const positions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

const scene = new Scene({
  id: 'map',

  map: new GaodeMap({
    center: [116, 27],
    zoom: 6,
    style: 'dark',
  }),
});

scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/bmw-prod/fccd80c0-2611-49f9-9a9f-e2a4dd12226f.json')
    .then((res) => res.json())
    .then((maskData) => {
      const maskPolygon = new PolygonLayer({
        visible: false, // 隐藏maskPolygon
      })
        .source(maskData)
        .shape('fill')
        .color('#f00')
        .style({
          opacity: 0.5,
        });
      const layer = new RasterLayer({
        maskLayers: [maskPolygon],
      });

      const tileSource = new Source(
        'https://ganos.oss-cn-hangzhou.aliyuncs.com/m2/l7/tiff_jx/{z}/{x}/{y}.tiff',
        {
          parser: {
            type: 'rasterTile',
            dataType: 'arraybuffer',
            tileSize: 256,
            maxZoom: 13.1,
            format: async (data) => {
              const tiff = await GeoTIFF.fromArrayBuffer(data);
              const image = await tiff.getImage();
              const width = image.getWidth();
              const height = image.getHeight();
              const values = await image.readRasters();
              return { rasterData: values[0], width, height };
            },
          },
        },
      );

      layer.source(tileSource).style({
        domain: [0, 255], // 枚举类型domain 必须为0-255
        clampLow: false,
        rampColors: {
          type: 'cat',
          colors: colorList,
          positions,
        },
      });

      scene.addLayer(layer);
      scene.addLayer(maskPolygon);
      return '';
    });
  return '';
});

const wrap = document.getElementById('map');
const legend = document.createElement('div');

const data = [];
for (let i = 0; i < colorList.length; i += 1) {
  data.push({
    color: colorList[i],
    text: [
      'Water',
      'Trees',
      'Grass',
      'Vegetation',
      'Crops',
      'Shrub',
      'Built Area',
      'Bare ground',
      'Snow',
      'Clouds',
    ][i],
  });
}
const strArr = [];
data.map(({ color, text }) => {
  strArr.push(`  <div style="display:inline-block;background:#fff:padding:5px;">
  <div style="fontSize:12px;lineHeight:12px;color: #fff">
    ${text}
  </div>
  <div style="height:8px; background: ${color};"></div>
  </div>`);
  return '';
});
legend.innerHTML = strArr.join('');
legend.style.position = 'absolute';
legend.style.left = '10px';
legend.style.bottom = '30px';
legend.style.zIndex = 10;

wrap.appendChild(legend);
```

## 运行环境

运行示例前，先在含有 #container 的页面中等待以下初始化完成。相关文件附于文末。

```js
await (await import("/src/demo/setup.ts")).default({ container: document.getElementById('container'), path: "/examples/tile/raster/demo/tiff.js" });
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
