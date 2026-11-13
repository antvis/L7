---
title: "Tencent Map"
description: "Tencent Map"
language: "en"
canonical: "https://l7.antv.antgroup.com/en/api/map/tencent/"
---

[Resource index](/llms.txt)

## Introduction

L7 geographical visualization focuses on the visual expression of geographical data. The map layer needs to rely on third-party maps. Third-party maps are created and managed uniformly through Scene. You only need to pass in map configuration items through Scene.

L7 internally resolves the differences between different map basemaps, and at the same time, L7 manages the operation methods of the map in a unified manner.

The Tencent map currently supported by L7 is[JavaScript API GL](https://lbs.qq.com/webApi/javascriptGL/glGuide/glOverview), which is also the officially recommended version of Tencent Maps.

### Apply for token

Before using Tencent Map, you need to register a Tencent Map account and apply for a Key. How to apply for a Tencent Map key?[Click me to view](https://lbs.qq.com/webApi/javascriptGL/glGuide/glBasic).

⚠️ L7 has a default token set internally, which is for testing only.

### import

```javascript
import { TencentMap } from '@antv/l7-maps';
```

## Initialize map

```ts
import { Scene, PointLayer } from '@antv/l7';
import { TencentMap } from '@antv/l7-maps';
const scene = new Scene({
  id: 'map',
  map: new TencentMap({
    zoom: 10,
    minZoom: 5,
    maxZoom: 18,
  }),
});
```

Tencentmap [Example address](/en/examples/map/map/tencentmap/)、Tencentmap instantiate[Example address](/en/examples/map/map/tmapinstance/)

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
