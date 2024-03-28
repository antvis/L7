---
title: MapBox 地图
order: 4
---

<embed src="@/docs/api/common/style.md"></embed>

## Introduction

L7 geographical visualization focuses on the visual expression of geographical data. The map layer needs to rely on third-party maps. Third-party maps are created and managed uniformly through Scene. You only need to pass in map configuration items through Scene.

L7 internally resolves the differences between different map basemaps, and at the same time, L7 manages the operation methods of the map in a unified manner.

- [Mapbox-gl official website](https://docs.mapbox.com/mapbox-gl-js/)
- [ Mapbox-gl GitHub](https://github.com/mapbox/mapbox-gl-js)

## Apply for token

[Apply for token](https://docs.mapbox.com/help/getting-started/access-tokens/)

## Initialize map

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

#### Pass in a Mapbox map instance

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

<embed src="@/docs/api/common/map.en.md"></embed>
