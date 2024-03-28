---
title: Leaflet
order: 6
---

<embed src="@/docs/api/common/style.md"></embed>

## Introduction

L7 geographical visualization focuses on the visual expression of geographical data. The map layer needs to rely on third-party maps. Third-party maps are created and managed uniformly through Scene. You only need to pass in map configuration items through Scene.

L7 internally resolves the differences between different map basemaps, and at the same time, L7 manages the operation methods of the map in a unified manner.

- [Leaflet official website](https://leafletjs.com/)
- [Leaflet GitHub](https://github.com/antvis/l7-extensions/tree/master/packages/leaflet)

### Install

L7-Leaflet is a third-party plug-in. L7 itself is not built-in and needs to be followed independently.

- [L7-Leaflet GitHub](https://github.com/antvis/l7-extensions/tree/master/packages/leaflet)
- [L7-Leaflet Demo ](https://l7-leaflet.antv.vision/)

```ts
npm install  '@antv/l7-leaflet'
```

or

```js
<script src="https://unpkg.com/@antv/l7-leaflet"></script>
```

### initialization

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

### Using L7 in Leaflet

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
      '© <a href="http://lbs.tianditu.gov.cn/home.html">天地图 GS(2022)3124号 - 甲测资字1100471</a>',
  },
).addTo(map);

const l7layer = new L7Layer().addTo(map);
const scene = l7layer.getScene();
```
