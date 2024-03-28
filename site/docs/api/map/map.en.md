---
title: 地图 Map
order: 0
---

<embed src="@/docs/api/common/style.md"></embed>

## Introduction

L7 geographical visualization focuses on the visual expression of geographical data. The map layer needs to rely on third-party maps. The third-party maps are created and managed uniformly through Scene.
Just pass in the map configuration items through Scene.

L7 internally resolves the differences between different map basemaps, and at the same time, L7 manages the operation methods of the map in a unified manner.

- Map is an independent map engine that does not require basemaps or loading map tile services, and does not require Token.

## import

```javascript
import { Map } from '@antv/l7-maps';
```

## Map instantiation

```ts
import { Scene, PointLayer } from '@antv/l7';
import { Map } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new Map({
    zoom: 10,
    minZoom: 0,
    maxZoom: 18,
  }),
});

scene.on('loaded', () => {
  // 添加地图底图
  const layer = new RasterLayer();
  layer.source(
    'https://webrd0{1-3}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
    {
      parser: {
        type: 'rasterTile',
        tileSize: 256,
        minZoom: 2,
        maxZoom: 18,
      },
    },
  );
  scene.addLayer(layer);
});
```

<embed src="@/docs/api/common/map.en.md"></embed>
