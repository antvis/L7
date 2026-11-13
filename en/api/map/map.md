---
title: "地图 Map"
description: "地图 Map"
language: "en"
canonical: "https://l7.antv.antgroup.com/en/api/map/map/"
---

[Resource index](/llms.txt)

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

## options

### zoom initialize zoom level

_number_

Initial map display level {number} Mapbox (0-24) AMap (2-19)

### center map center

Map initial center latitude and longitude {Lnglat}

### pitch map tilt angle

Map initial pitch angle {number} default 0

### minZoom minimum zoom level

Minimum map zoom level {number} default 0 Mapbox 0-24) Gaode (2-19)

### maxZoom maximum zoom level

Maximum map zoom level {number} default 22 Mapbox (0-24) AMap (2-19)

### rotateEnable whether to allow rotation

Whether the map can be rotated {Boolean} default true

## map events

Scene unified agent, see[Scene document](/en/api/scene)

or

scene.map directly calls the map instance method
