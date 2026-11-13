---
title: "交互高亮图层"
language: "zh"
canonical: "https://l7.antv.antgroup.com/zh/examples/tutorial/layer/layer-highlight/"
---

# 交互高亮图层

[运行示例](https://l7.antv.antgroup.com/zh/examples/tutorial/layer/layer-highlight/)

[资料索引](/llms.txt)

页面需要一个 `id="container"` 的 DOM 元素。以下为原始示例源码。

## 源码

```js
import { LineLayer, PolygonLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'light',
    center: [118.7368, 32.056],
    zoom: 9,
  }),
});
scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/basement_prod/91247d10-585b-4406-b1e2-93b001e3a0e4.json')
    .then((res) => res.json())
    .then((data) => {
      const filllayer = new PolygonLayer({
        name: 'fill',
      })
        .source(data)
        .shape('fill')
        .color('unit_price', ['#f0f9e8', '#ccebc5', '#a8ddb5', '#7bccc4', '#43a2ca', '#0868ac']);
      const linelayer = new LineLayer({
        zIndex: 1,
        name: 'line',
      })
        .source(data)
        .shape('line')
        .size(0.5)
        .color('#fff')
        .style({
          opacity: 0.5,
        });
      const hightLayer = new LineLayer({
        zIndex: 4, // 设置显示层级
        name: 'hightlight',
      })
        .source({
          type: 'FeatureCollection',
          features: [],
        })
        .shape('line')
        .size(2)
        .color('red');
      scene.addLayer(filllayer);
      scene.addLayer(linelayer);
      scene.addLayer(hightLayer);
      filllayer.on('click', (feature) => {
        console.log(feature);
        hightLayer.setData({
          type: 'FeatureCollection',
          features: [feature.feature],
        });
      });
    });
});
```

## 运行环境

运行示例前，先在含有 #container 的页面中等待以下初始化完成。相关文件附于文末。

```js
await (await import("/src/demo/setup.ts")).default({ container: document.getElementById('container'), path: "/examples/tutorial/layer/demo/layer-highlight.js" });
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
