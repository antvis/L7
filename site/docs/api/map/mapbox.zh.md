---
title: MapBox 地图
order: 4
---

<embed src="@/docs/api/common/style.md"></embed>

## 简介

L7 地理可视化侧重于地理数据的可视化表达，地图层需要依赖第三方地图，第三方地图通过 Scene 统一创建管理，只需要通过 Scene 传入地图配置项即可。

L7 在内部解决了不同地图底图之间差异，同时 L7 层面统一管理地图的操作方法。

- [Mapbox-gl 官网](https://docs.mapbox.com/mapbox-gl-js/)
- [ Mapbox-gl GitHub](https://github.com/mapbox/mapbox-gl-js)

## 申请token

[申请token](https://docs.mapbox.com/help/getting-started/access-tokens/)

## 初始化地图

```ts
import { Scene, PointLayer } from '@antv/l7';
import { Mapbox } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new Mapbox({
    zoom: 10,
    minZoom: 0,
    maxZoom: 18,
    token: 'xxxx', //必须
  }),
});
```

#### 传入 Mapbox 地图实例

```javascript
mapboxgl.accessToken = 'xxxx - token';
const map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
  center: [-74.5, 40], // starting position [lng, lat]
  zoom: 9, // starting zoom
});

const scene = new Scene({
  id: 'map',
  map: new Mapbox({
    mapInstance: map,
  }),
});
```

<embed src="@/docs/api/common/map.zh.md"></embed>
