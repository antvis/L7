---
title: MapLibre
order: 5
---

<embed src="@/docs/api/common/style.md"></embed>

## 简介

L7 地理可视化侧重于地理数据的可视化表达，地图层需要依赖第三方地图，第三方地图通过 Scene 统一创建管理，只需要通过 Scene 传入地图配置项即可。

L7 在内部解决了不同地图底图之间差异，同时 L7 层面统一管理地图的操作方法。

- [MapLibre](https://maplibre.org/)
- [ MapLibre GitHub](https://github.com/maplibre/maplibre-gl-js)

## 初始化地图

```ts
import { Scene, PointLayer } from '@antv/l7';
import { MapLibre } from '@antv/l7-maps';
const scene = new Scene({
  id: 'map',
  map: new MapLibre({
    zoom: 10,
    style: 'https://api.maptiler.com/maps/streets/style.json?key=YbCPLULzWdf1NplssEIc', // style URL
    minZoom: 0,
    maxZoom: 18,
  }),
});
```

#### 传入 MapLibre 地图实例

```javascript
import { Scene, PointLayer } from '@antv/l7';
import { MapLibre } from '@antv/l7-maps';
var map = new maplibregl.Map({
  container: 'map', // container id
  style: 'https://demotiles.maplibre.org/style.json', // style URL
  center: [0, 0], // starting position [lng, lat]
  zoom: 1, // starting zoom
});

const scene = new Scene({
  id: 'map',
  map: new MapLibre({
    mapInstance: map,
  }),
});
```

<embed src="@/docs/api/common/map.zh.md"></embed>
