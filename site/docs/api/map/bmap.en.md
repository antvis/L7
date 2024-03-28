---
title: 百度地图
order: 2
---

<embed src="@/docs/api/common/style.md"></embed>

## Introduction

L7 geographical visualization focuses on the visual expression of geographical data. The map layer needs to rely on third-party maps. Third-party maps are created and managed uniformly through Scene. You only need to pass in map configuration items through Scene.

L7 internally resolves the differences between different map basemaps, and at the same time, L7 manages the operation methods of the map in a unified manner.

The Baidu map currently supported by L7 is[APIGL version](https://lbsyun.baidu.com/index.php?title=jspopularGL), which is also the officially recommended version of Baidu Maps.

### Apply for token

Before using Baidu Maps, you need to apply for a Baidu Map key. How to apply for a Baidu Map key?[Click me to view](https://lbs.baidu.com/index.php?title=jspopularGL/guide/getkey)。

⚠️ L7 has a default token set internally, which is for testing only

### import

```javascript
import { BaiduMap } from '@antv/l7-maps';
```

### Instantiate

L7 provides BaiduMap to directly instantiate the map, and can also instantiate the map through external input.

It is recommended for new projects to instantiate BaiduMap directly. Existing map projects can be passed in externally to quickly access L7 capabilities.

#### BaiduMap instantiation

```js
import { BaiduMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new BaiduMap({
    // Fill in the Baidu map key. This is a test token and cannot be used for production.
    token: 'zLhopYPPERGtpGOgimcdKcCimGRyyIsh',
    center: [103, 30],
    pitch: 4,
    zoom: 10,
    rotation: 19,
  }),
});
```

#### external instantiation

⚠️ The scene id parameter needs to be in the same container as the BMapGL.Map instance.

⚠️ The incoming map instance needs to be imported by yourself[Baidu Map API](https://lbs.baidu.com/index.php?title=jspopularGL/guide/show)

```javascript
const map = new BMapGL.Map('map', {
  zoom: 11, // Initialize map level
  minZoom: 4,
  maxZoom: 23,
  enableWheelZoom: true,
});

const scene = new Scene({
  id: 'map',
  map: new BaiduMap({
    mapInstance: map,
  }),
});
```

BaiduMap [Example address](/examples/map/map/#baidumap), external incoming[Example address](/examples/map/map/#bmapInstance)

<embed src="@/docs/api/common/map.en.md"></embed>
