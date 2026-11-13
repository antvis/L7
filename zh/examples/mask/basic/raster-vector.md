---
title: "栅格瓦片-矢量瓦片掩模"
language: "zh"
canonical: "https://l7.antv.antgroup.com/zh/examples/mask/basic/raster-vector/"
---

# 栅格瓦片-矢量瓦片掩模

[运行示例](https://l7.antv.antgroup.com/zh/examples/mask/basic/raster-vector/)

[资料索引](/llms.txt)

页面需要一个 `id="container"` 的 DOM 元素。以下为原始示例源码。

## 源码

```ts
// @ts-ignore
import { PolygonLayer, RasterLayer, Scene, Source } from '@antv/l7';
// @ts-ignore
import { Map } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',

  map: new Map({
    center: [110, 30],
    // zoom: 12,
    zoom: 3,
  }),
});
const worldSource = new Source(
  'https://ganos.oss-cn-hangzhou.aliyuncs.com/m2/rs_l7/{z}/{x}/{y}.pbf',
  {
    parser: {
      type: 'mvt',
      tileSize: 256,
      maxZoom: 9,
      extent: [-180, -85.051129, 179, 85.051129],
    },
  },
);

const fillLayer = new PolygonLayer({
  zIndex: 3,
  visible: false,
  featureId: 'COLOR',
  sourceLayer: 'ecoregions2', // woods hillshade contour ecoregions ecoregions2 city
})
  .source(worldSource)
  .shape('fill')
  .color('COLOR')
  .style({
    opacity: 0.5,
  });

const layer = new RasterLayer({
  zIndex: 2,
  maskLayers: [fillLayer],
  enableMask: true,
})
  .source(
    'https://tiles{1-3}.geovisearth.com/base/v1/img/{z}/{x}/{y}?format=webp&tmsIds=w&token=b2a0cfc132cd60b61391b9dd63c15711eadb9b38a9943e3f98160d5710aef788',
    {
      parser: {
        type: 'rasterTile',
        tileSize: 256,
      },
    },
  )
  .style({
    opacity: 1,
  });

scene.on('loaded', () => {
  scene.addLayer(fillLayer);

  scene.addLayer(layer);
});
```

## 运行环境

运行示例前，先在含有 #container 的页面中等待以下初始化完成。相关文件附于文末。

```js
await (await import("/src/demo/setup.ts")).default({ container: document.getElementById('container'), path: "/examples/mask/basic/demo/raster-vector.ts" });
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
