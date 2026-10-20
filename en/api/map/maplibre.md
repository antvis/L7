---
title: "MapLibre"
description: "MapLibre"
language: "en"
canonical: "https://l7.antv.antgroup.com/en/api/map/maplibre/"
---

[Resource index](/llms.txt)

## Introduction

L7 geographical visualization focuses on the visual expression of geographical data. The map layer needs to rely on third-party maps. Third-party maps are created and managed uniformly through Scene. You only need to pass in map configuration items through Scene.

L7 internally resolves the differences between different map basemaps, and at the same time, L7 manages the operation methods of the map in a unified manner.

- [MapLibre](https://maplibre.org/)
- [ MapLibre GitHub](https://github.com/maplibre/maplibre-gl-js)

## Initialize map

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

#### Pass in a MapLibre map instance

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
