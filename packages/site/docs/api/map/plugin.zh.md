---
title: 高德插件
order: 2
---

`markdown:docs/common/style.md`

## 简介

L7 在使用高德地图作为地图底图的时候能轻易的使用高德地图底图提供的插件能力

## 注册使用

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
// 为了使用对应插件的能力，应该首先在 plugin 中注册对应的插件

// 加载的 AMap 会挂载在全局的 window 对象上
scene.on('loaded', () => {
  window.AMap.plugin(['AMap.ToolBar', 'AMap.LineSearch'], () => {
    // add control
    scene.map.addControl(new AMap.ToolBar());

    var linesearch = new AMap.LineSearch({
      pageIndex: 1, //页码，默认值为1
      pageSize: 1, //单页显示结果条数，默认值为20，最大值为50
      city: '北京', //限定查询城市，可以是城市名（中文/中文全拼）、城市编码，默认值为『全国』
      extensions: 'all', //是否返回公交线路详细信息，默认值为『base』
    });

    //执行公交路线关键字查询
    linesearch.search('536', function(status, result) {
      //打印状态信息status和结果信息result
      // ... do something
    });
  });
});
```

<img width="60%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*ag-nSrIPPEUAAAAAAAAAAAAAARQnAQ'>

[在线案例](../../../examples/amapPlugin/bus#busStop)
