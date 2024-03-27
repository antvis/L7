---
title: 高德地图
order: 1
---

<embed src="@/docs/api/common/style.md"></embed>

## Introduction

L7 geographical visualization focuses on the visual expression of geographical data. The map layer needs to rely on third-party maps. Third-party maps are created and managed uniformly through Scene. You only need to pass in map configuration items through Scene.

L7 internally resolves the differences between different map basemaps, and at the same time, L7 manages the operation methods of the map in a unified manner.

- [AMap official website](https://lbs.amap.com/api/javascript-api-v2/update)

## Apply for token

AMap API configuration parameters

- token
  Register AMap[API token](https://lbs.amap.com/api/javascript-api/guide/abc/prepare)

## Map initialization

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

<embed src="@/docs/api/common/map.en.md"></embed>

## Pass in external instance

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

<embed src="@/docs/api/common/map.en.md"></embed>

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
