---
title: AMap Plugin
order: 3
---

<embed src="@/docs/api/common/style.md"></embed>

When we use Gaode Map as the map base map, we can use the plug-in provided by Gaode Map to achieve our needs.

### AMap.LineSearch

- Road query

```javascript
const scene = new Scene({
  id: 'map',
  map: new Mapbox({
    style: 'blank',
    center: [103.83735604457024, 1.360253881403068],
    pitch: 4.00000000000001,
    zoom: 10.210275860702593,
    rotation: 19.313180925794313,
  }),
});
```

[Online case](/examples/amapplugin/bus#busstop)

### MP.Tulbar

- Map toolbar

```javascript
scene.on('loaded', () => {
  window.AMap.plugin([ 'AMap.ToolBar', 'AMap.LineSearch' ], () => {
    scene.map.addControl(new AMap.ToolBar());

    const linesearch = new AMap.LineSearch({
      pageIndex: 1, //Page number, default value is 1
      pageSize: 1, //The number of results displayed on a single page, the default value is 20, the maximum value is 50
      city: 'Beijing', // Limit the query city, which can be the city name (Chinese/Chinese full spelling), city code, the default value is "National"
      extensions: 'all' // Whether to return bus route details, the default value is "base"
    });
```

[Online case](/examples/amapplugin/bus#busstop)

### AMap.TileLayer

- load using`xyz`map tiles

```javascript
scene.on('loaded', () => {
  var xyzTileLayer = new window.AMap.TileLayer({
    getTileUrl:
      'https://wprd0{1,2,3,4}.is.autonavi.com/appmaptile?x=[x]&y=[y]&z=[z]&size=1&scl=1&style=8&ltype=11',
    zIndex: 100,
  });
  scene.map.add(xyzTileLayer);
});
```

[Online case](/examples/amapplugin/bus#xyztile)

### AMap.TileLayer.Satellite

- Load using default satellite tiles

```javascript
scene.on('loaded', () => {
  scene.map.add(new window.AMap.TileLayer.Satellite());
});
```

[Online case](/examples/amapplugin/bus#satellite)
