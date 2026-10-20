---
title: "lerc 高程栅格"
language: "zh"
canonical: "https://l7.antv.antgroup.com/zh/examples/tile/raster/lerc/"
---

# lerc 高程栅格

[运行示例](https://l7.antv.antgroup.com/zh/examples/tile/raster/lerc/)

[资料索引](/llms.txt)

页面需要一个 `id="container"` 的 DOM 元素。以下为原始示例源码。

## 源码

```js
import { RasterLayer, Scene, Source } from '@antv/l7';
import { Map } from '@antv/l7-maps';
import Lerc from 'lerc';

const colorList = [
  '#fff7fb',
  '#ece7f2',
  '#d0d1e6',
  '#a6bddb',
  '#74a9cf',
  '#3690c0',
  '#0570b0',
  '#045a8d',
  '#023858',
];
const positions = [0, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 1.0];
const scene = new Scene({
  id: 'map',
  map: new Map({
    center: [90.268, 35.3628],
    zoom: 3,
  }),
});

scene.on('loaded', () => {
  const layer = new RasterLayer();
  const tileSource = new Source(
    'https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer/tile/{z}/{y}/{x}',
    {
      parser: {
        type: 'rasterTile',
        dataType: 'arraybuffer',
        tileSize: 256,
        format: async (data) => {
          const image = Lerc.decode(data);
          return {
            rasterData: image.pixels[0],
            width: image.width,
            height: image.height,
          };
        },
      },
    },
  );

  layer.source(tileSource).style({
    domain: [0, 1024],
    clampLow: true,
    rampColors: {
      colors: colorList,
      positions,
    },
  });

  scene.addLayer(layer);
  return '';
});

const wrap = document.getElementById('map');
const legend = document.createElement('div');

const data = [];
for (let i = 0; i < colorList.length; i++) {
  data.push({
    color: colorList[i],
    text: positions[i],
  });
}
const strArr = [];
data.map(({ color, text }) => {
  strArr.push(`  <div style="display:inline-block;background:#fff;padding:5px;">
  <div style="fontSize:12px;lineHeight:12px;">
    ${text}
  </div>
  <div style="width: 30px;height:8px; background: ${color};"></div>
  </div>`);
  return '';
});
legend.innerHTML = strArr.join('');
legend.style.position = 'absolute';
legend.style.left = '10px';
legend.style.bottom = '30px';
legend.style.background = '#fff';
legend.style.zIndex = 10;

wrap.appendChild(legend);
```

## 运行环境

运行示例前，先在含有 #container 的页面中等待以下初始化完成。相关文件附于文末。

```js
await (await import("/src/demo/setup.ts")).default({ container: document.getElementById('container'), path: "/examples/tile/raster/demo/lerc.js" });
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
