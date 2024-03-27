---
title: MapLibre
order: 5
---

<embed src="@/docs/api/common/style.md"></embed>

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

<embed src="@/docs/api/common/map.en.md"></embed>
