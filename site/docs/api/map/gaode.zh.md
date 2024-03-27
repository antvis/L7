---
title: 高德地图
order: 1
---

<embed src="@/docs/api/common/style.md"></embed>

## 简介

L7 地理可视化侧重于地理数据的可视化表达，地图层需要依赖第三方地图，第三方地图通过 Scene 统一创建管理，只需要通过 Scene 传入地图配置项即可。

L7 在内部解决了不同地图底图之间差异，同时 L7 层面统一管理地图的操作方法。

- [高德地图 官网](https://lbs.amap.com/api/javascript-api-v2/update)

## 申请token

高德地图 API 配置参数

- token
  注册高德 [API token](https://lbs.amap.com/api/javascript-api/guide/abc/prepare)

## 地图初始化化

```javascript
const L7AMap = new GaodeMap({
  pitch: 35.210526315789465,
  style: 'dark',
  center: [104.288144, 31.239692],
  zoom: 4.4,
  token: 'xxxx - token',
  plugin: [], // 可以不设置
});
```

<embed src="@/docs/api/common/map.zh.md"></embed>

## 传入外部实例

为了支持已有地图项目快速接入 L7 的能力，L7 提供传入地图实例的方法。如果你是新项目推荐使用 Scene 初始化地图

⚠️ scene id 参数需要地图的 Map 实例是同个容器。

⚠️ 传入地图实例需要自行引入相关地图的 API

⚠️ viewMode 设置为 3D 模式（GaodeMap2.0 支持 2D 模式，可以不设置）

#### 传入高德地图实例

```javascript
const map = new AMap.Map('map', {
  viewMode: '3D',
  resizeEnable: true, // 是否监控地图容器尺寸变化
  zoom: 11, // 初始化地图层级
  center: [116.397428, 39.90923], // 初始化地图中心点
});
const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    mapInstance: map,
  }),
});
```

[示例地址](/examples/tutorial/map#amapInstance)
[代码地址](https://github.com/antvis/L7/blob/master/examples/tutorial/map/demo/amapInstance.js)

[示例地址（ 2D ）](/examples/tutorial/map#amapInstance2d)
[代码地址](https://github.com/antvis/L7/blob/master/examples/tutorial/map/demo/amapInstance.js)

<embed src="@/docs/api/common/map.zh.md"></embed>

## 注册使用高德插件

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
    linesearch.search('536', function (status, result) {
      //打印状态信息status和结果信息result
      // ... do something
    });
  });
});
```

<img width="60%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*ag-nSrIPPEUAAAAAAAAAAAAAARQnAQ'>

[在线案例](/examples/amapplugin/bus#busstop)
