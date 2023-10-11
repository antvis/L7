---
title: Map
order: 1
---

<embed src="@/docs/common/style.md"></embed>

## Introduction

L7 geographical visualization focuses on the visual expression of geographical data. The map layer needs to rely on third-party maps. The third-party maps are created and managed uniformly through Scene.
Just pass in the map configuration items through Scene.

L7 internally resolves the differences between different map basemaps, and at the same time, L7 manages the operation methods of the map in a unified manner.

Currently L7 supports two map basemaps

* Map is an independent map engine that does not require basemaps or loading map tile services, and does not require Token.

* GaodeMap default direction[Token](https://lbs.amap.com/api/javascript-api/guide/abc/prepare)

* MapBox international business, registration required[Token]()

### import

```javascript
import { GaodeMap } from '@antv/l7-maps'; // Import Gaode 2.x version by default. Starting from version 2.11.0, it will be upgraded to v2 by default.
import { GaodeMapV1 } from '@antv/l7-maps'; // Versions before 2.11.0 are upgraded to v1 by default

import { Mapbox } from '@antv/l7-maps';
import { Map } from '@antv/l7-maps';
```

### Instantiate

⚠️ Use the map to apply for a map token. L7 has a default token set internally for testing purposes only.

#### Default Map instantiation

```js
import { Map } from '@antv/l7-maps';
const scene = new Scene({
  id: 'map',
  map: new Map({
    style: 'dark',
    center: [103, 30],
    pitch: 4,
    zoom: 10,
    rotation: 19,
  }),
});
```

#### Amap instantiation

Amap API configuration parameters

* token
  Register Amap[API token](https://lbs.amap.com/api/javascript-api/guide/abc/prepare)

* plugin {array}`['AMap.ElasticMarker','AMap.CircleEditor']`

  load[Gaode map plug-in](https://lbs.amap.com/api/javascript-api/guide/abc/plugins)

```javascript
const L7AMap = new GaodeMap({
  pitch: 35.210526315789465,
  style: 'dark',
  center: [104.288144, 31.239692],
  zoom: 4.4,
  token: 'xxxx-token',
  plugin: [], // Can not be set
});
```

#### Mapbox map instantiation

```javascript
const scene = new Scene({
  id: 'map',
  map: new Mapbox({
    style: 'dark',
    center: [103.83735604457024, 1.360253881403068],
    pitch: 4.00000000000001,
    zoom: 10.210275860702593,
    rotation: 19.313180925794313,
    token: 'xxxx - token',
  }),
});
```

### Pass in external instance

In order to support the ability of existing map projects to quickly access L7, L7 provides a method for passing in map instances. If you are a new project, it is recommended to use Scene to initialize the map.

⚠️ The scene id parameter requires the Map instances of the map to be in the same container.

⚠️ When passing in a map instance, you need to introduce the API of the relevant map yourself

⚠️ Set viewMode to 3D mode (GaodeMap2.0 supports 2D mode and does not need to be set)

#### Pass in Gaode map instance

```javascript
const map = new AMap.Map('map', {
  viewMode: '3D',
  resizeEnable: true, // Whether to monitor map container size changes
  zoom: 11, // Initialize map level
  center: [116.397428, 39.90923], // Initialize the map center point
});
const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    mapInstance: map,
  }),
});
```

[Example address](/examples/tutorial/map#amapInstance)[code address](https://github.com/antvis/L7/blob/master/examples/tutorial/map/demo/amapInstance.js)

[Example address (2D)](/examples/tutorial/map#amapInstance2d)[code address](https://github.com/antvis/L7/blob/master/examples/tutorial/map/demo/amapInstance.js)

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

## options

### zoom initialize zoom level

<description> *number* </description>

Initial map display level {number} Mapbox (0-24) Amap (2-19)

### center map center

Map initial center latitude and longitude {Lnglat}

### pitch map tilt angle

Map initial pitch angle {number} default 0

### style map style

Simplify the map style setting. L7 has three built-in theme default styles, which can be used by Amap and mapbox.

* dark
* light
* normal
* blank no basemap

In addition to the built-in styles, you can also pass in other custom attributes.

For example, Amap

⚠️ Gaode map style added`isPublic=true`parameter

```javascript
{
  style: 'amap://styles/2a09079c3daac9420ee53b67307a8006?isPublic=true'; // The setting method is the same as AMAP
}
```

### minZoom minimum zoom level

Minimum map zoom level {number} default 0 Mapbox 0-24) Gaode (2-19)

### maxZoom maximum zoom level

Maximum map zoom level {number} default 22 Mapbox (0-24) Amap (2-19)

### rotateEnable whether to allow rotation

Whether the map can be rotated {Boolean} default true

## Register to use Gaode plug-in

```javascript
const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    center: [116.475, 39.99],
    pitch: 0,
    zoom: 13,
    plugin: ['AMap.ToolBar', 'AMap.LineSearch'],
  }),
});
// plugin: ['AMap.ToolBar', 'AMap.LineSearch'],
// In order to use the capabilities of the corresponding plug-in, the corresponding plug-in should first be registered in plugin

//The loaded AMap will be mounted on the global window object
scene.on('loaded', () => {
  window.AMap.plugin(['AMap.ToolBar', 'AMap.LineSearch'], () => {
    // add control
    scene.map.addControl(new AMap.ToolBar());

    var linesearch = new AMap.LineSearch({
      pageIndex: 1, //Page number, default value is 1
      pageSize: 1, //The number of results displayed on a single page, the default value is 20, the maximum value is 50
      city: 'Beijing', //Limit the query city, which can be the city name (Chinese/Chinese full spelling), city code, the default value is "National"
      extensions: 'all', //Whether to return bus route details, the default value is "base"
    });

    //Execute bus route keyword query
    linesearch.search('536', function (status, result) {
      //Print status information status and result information result
      // ...do something
    });
  });
});
```

<img width="60%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*ag-nSrIPPEUAAAAAAAAAAAAAARQnAQ'>

[Online case](/examples/amapplugin/bus#busstop)
