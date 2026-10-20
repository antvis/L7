---
title: "图层气泡 自定义内容"
language: "zh"
canonical: "https://l7.antv.antgroup.com/zh/examples/component/popup/customcontent/"
---

# 图层气泡 自定义内容

[运行示例](https://l7.antv.antgroup.com/zh/examples/component/popup/customcontent/)

[资料索引](/llms.txt)

页面需要一个 `id="container"` 的 DOM 元素。以下为原始示例源码。

## 源码

```ts
import * as G2 from '@antv/g2';
import { GaodeMap, LayerPopup, PointLayer, Scene } from '@antv/l7';

const data: any[] = [
  {
    lng: 120.132235,
    lat: 30.250868,
    value: 34.71314604052238,
    name: '坐标点1',
  },
  {
    lng: 120.156236,
    lat: 30.260268,
    value: 96.807880210153,
    name: '坐标点2',
  },
  {
    lng: 120.163014,
    lat: 30.251297,
    value: 29.615472482876815,
    name: '坐标点3',
  },
  {
    lng: 120.15394,
    lat: 30.231489,
    value: 49.90316258911784,
    name: '坐标点4',
  },
  {
    lng: 120.154596,
    lat: 30.24065,
    value: 45.788587061188466,
    name: '坐标点5',
  },
  {
    lng: 120.150223,
    lat: 30.235078,
    value: 29.741111717098544,
    name: '坐标点6',
  },
  {
    lng: 120.143992,
    lat: 30.229411,
    value: 40.241555782182935,
    name: '坐标点7',
  },
  {
    lng: 120.136995,
    lat: 30.237439,
    value: 86.5369792415296,
    name: '坐标点8',
  },
];

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    pitch: 0,
    style: 'normal',
    center: [120.154672, 30.241095],
    zoom: 12,
  }),
  logoVisible: false,
});
scene.on('loaded', () => {
  const pointLayer = new PointLayer({});
  pointLayer
    .source(data, {
      parser: {
        type: 'json',
        x: 'lng',
        y: 'lat',
      },
    })
    .color('value', ['#FFCCC6', '#CF1421'])
    .size(10)
    .shape('circle');
  scene.addLayer(pointLayer);

  const div = document.createElement('div');
  const chart = new G2.Chart({
    container: div,
    autoFit: true,
    width: 200,
    height: 200,
  });
  // 新建一个 view 用来单独渲染Annotation
  chart.coordinate('theta', {
    radius: 0.75,
    innerRadius: 0.5,
  });

  chart.scale('percent', {
    formatter: (val) => {
      val = val * 100 + '%';
      return val;
    },
  });

  chart.tooltip(false);

  // 声明需要进行自定义图例字段： 'item'
  chart.legend(false);

  chart.interval().adjust('stack').position('percent').color('item', ['#5B8FF9', '#797979']).style({
    fillOpacity: 1,
  });

  const layerPopup = new LayerPopup({
    items: [
      {
        layer: pointLayer,
        customContent: (e) => {
          const otherValue = 100 - e.value;
          chart.data([
            { item: '值', count: e.value, percent: e.value / 100 },
            { item: '', count: otherValue, percent: otherValue / 100 },
          ]);
          chart.render();
          return div;
        },
      },
    ],
  });

  scene.addPopup(layerPopup);
});
```

## 运行环境

运行示例前，先在含有 #container 的页面中等待以下初始化完成。相关文件附于文末。

```js
await (await import("/src/demo/setup.ts")).default({ container: document.getElementById('container'), path: "/examples/component/popup/demo/customcontent.ts" });
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
