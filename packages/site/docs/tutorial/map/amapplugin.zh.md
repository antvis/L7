---
title: 使用高德插件
order: 3
---
`markdown:docs/common/style.md`

高德地图为我们提供和许多好用的插件，借助这些插件的能力我们可以覆盖更多的业务场景。

### AMap.LineSearch
道路查询

```javascript
const scene = new Scene({
  id: 'map',
  map: new Mapbox({
    style: 'blank',
    center: [ 103.83735604457024, 1.360253881403068 ],
    pitch: 4.00000000000001,
    zoom: 10.210275860702593,
    rotation: 19.313180925794313
  })
});
```

[在线案例](/zh/examples/amapPlugin/bus#busStop)

### AMap.ToolBar
地图工具栏

```javascript
scene.on('loaded', () => {
  window.AMap.plugin([ 'AMap.ToolBar', 'AMap.LineSearch' ], () => {
    scene.map.addControl(new AMap.ToolBar());

    const linesearch = new AMap.LineSearch({
      pageIndex: 1, // 页码，默认值为1
      pageSize: 1, // 单页显示结果条数，默认值为20，最大值为50
      city: '北京', // 限定查询城市，可以是城市名（中文/中文全拼）、城市编码，默认值为『全国』
      extensions: 'all' // 是否返回公交线路详细信息，默认值为『base』
    });
...
```

[在线案例](/zh/examples/amapPlugin/bus#busStop)

### AMap.TileLayer
加载使用 xyz 地图瓦片

```javascript
scene.on('loaded', () => {
    var xyzTileLayer = new window.AMap.TileLayer({
      getTileUrl:
        'https://wprd0{1,2,3,4}.is.autonavi.com/appmaptile?x=[x]&y=[y]&z=[z]&size=1&scl=1&style=8&ltype=11',
      zIndex: 100,
    });
    scene.getMapService().map.add(xyzTileLayer);
});
```
[在线案例](/zh/examples/amapPlugin/bus#xyzTile)

### AMap.TileLayer.Satellite
加载使用默认的卫星瓦片

```javascript
 scene.on('loaded', () => {
    scene.getMapService().map.add(new window.AMap.TileLayer.Satellite());
});
```

[在线案例](/zh/examples/amapPlugin/bus#satellite)

