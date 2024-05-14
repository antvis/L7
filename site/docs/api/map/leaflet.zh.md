---
title: Leaflet
order: 6
---

<embed src="@/docs/api/common/style.md"></embed>

## 简介

L7 地理可视化侧重于地理数据的可视化表达，地图层需要依赖第三方地图，第三方地图通过 Scene 统一创建管理，只需要通过 Scene 传入地图配置项即可。

L7 在内部解决了不同地图底图之间差异，同时 L7 层面统一管理地图的操作方法。

- [Leaflet 官网](https://leafletjs.com/)
- [Leaflet GitHub](https://github.com/antvis/l7-extensions/tree/master/packages/leaflet)

### 安装

L7-Leaflet 为三方插件 L7本身没有内置，需要独立按照

- [L7-Leaflet GitHub](https://github.com/antvis/l7-extensions/tree/master/packages/leaflet)
- [L7-Leaflet Demo ](https://l7-leaflet.antv.vision/)

```ts
 npm install  '@antv/l7-leaflet'

```

or

```js
<script src="https://unpkg.com/@antv/l7-leaflet"></script>
```

### 初始化

```ts
import { Scene } from '@antv/l7';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Map } from '@antv/l7-leaflet';
const scene = new Scene({
  id: 'map',
  map: new Map({
    pitch: 0,
    center: [112, 37.8],
    zoom: 3,
    minZoom: 1,
  }),
});
```

### Leaflet 中使用 L7

```ts
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LineLayer } from '@antv/l7';
import { L7Layer } from '@antv/l7-leaflet';

const map = L.map('map', {
  minZoom: 1,
}).setView([30, 112], 3);
const mapType = 'vec';
L.tileLayer(
  'https://t{s}.tianditu.gov.cn/' +
    mapType +
    '_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=' +
    mapType +
    '&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=b72aa81ac2b3cae941d1eb213499e15e',
  {
    subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
    attribution:
      '&copy; <a href="http://lbs.tianditu.gov.cn/home.html">天地图 GS(2022)3124号 - 甲测资字1100471</a>',
  },
).addTo(map);

const l7layer = new L7Layer().addTo(map);
const scene = l7layer.getScene();
```
