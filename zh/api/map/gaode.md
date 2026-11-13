---
title: "高德地图"
description: "高德地图"
language: "zh"
canonical: "https://l7.antv.antgroup.com/zh/api/map/gaode/"
---

[资料索引](/llms.txt)

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

## options

### zoom 初始化缩放等级

_number_

地图初始显示级别 {number} Mapbox （0-24） 高德 （2-19）

### center 地图中心

地图初始中心经纬度 {Lnglat}

### pitch 地图倾角

地图初始俯仰角度 {number} default 0

### bearing 地图偏转角

地图初始旋转角度（相对于正北方向顺时针偏转的度数） {number} default 0

### minZoom 最小缩放等级

地图最小缩放等级 {number} default 0 Mapbox 0-24） 高德 （2-19）

### maxZoom 最大缩放等级

地图最大缩放等级 {number} default 22 Mapbox（0-24） 高德 （2-19）

### minPitch 最小倾角

地图最小俯仰角 {number} default 0

### maxPitch 最大倾角

地图最大俯仰角 {number} default 60

### rotateEnable 是否允许旋转

地图是否可旋转 {Boolean} default true

### interactive 是否允许交互

_boolean_ **optional** _default:_ true

是否允许地图交互（包括鼠标、触摸、键盘等），设为 `false` 后地图变为静态展示状态

### scrollZoom 是否允许滚轮缩放

_boolean_ **optional** _default:_ true

是否启用滚轮缩放交互

### boxZoom 是否允许框选缩放

_boolean_ **optional** _default:_ true

是否启用框选缩放交互（按住 Shift 拖拽）

### dragRotate 是否允许拖拽旋转

_boolean_ **optional** _default:_ true

是否启用拖拽旋转交互

### dragPan 是否允许拖拽平移

_boolean_ **optional** _default:_ true

是否启用拖拽平移交互

### keyboard 是否允许键盘控制

_boolean_ **optional** _default:_ true

是否启用键盘快捷键控制地图

### doubleClickZoom 是否允许双击缩放

_boolean_ **optional** _default:_ true

是否启用双击缩放交互

### touchZoomRotate 是否允许触摸缩放旋转

_boolean_ **optional** _default:_ true

是否启用双指捏合缩放旋转交互

### renderWorldCopies 是否渲染世界副本

_boolean_ **optional** _default:_ true

超出 -180 和 180 经度范围时，是否在两侧重复渲染地图

### maxBounds 地图最大边界范围

限制地图可视范围在指定的地理范围内

### bearingSnap 北向吸附阈值

_number_ **optional** _default:_ 7

当用户旋转地图接近正北方向时，自动吸附到正北方向的角度阈值（度数）

## 地图事件

Scene 统一代理，见 [Scene 文档](/zh/api/scene)

或者

scene.map 直接调用 map 实例方法


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

[示例地址](/zh/examples/map/map/amapinstance/)
[代码地址](https://github.com/antvis/L7/blob/master/examples/tutorial/map/demo/amapInstance.js)

[示例地址（ 2D ）](/zh/examples/map/map/gaodemap/)
[代码地址](https://github.com/antvis/L7/blob/master/examples/tutorial/map/demo/amapInstance.js)

## options

### zoom 初始化缩放等级

_number_

地图初始显示级别 {number} Mapbox （0-24） 高德 （2-19）

### center 地图中心

地图初始中心经纬度 {Lnglat}

### pitch 地图倾角

地图初始俯仰角度 {number} default 0

### bearing 地图偏转角

地图初始旋转角度（相对于正北方向顺时针偏转的度数） {number} default 0

### minZoom 最小缩放等级

地图最小缩放等级 {number} default 0 Mapbox 0-24） 高德 （2-19）

### maxZoom 最大缩放等级

地图最大缩放等级 {number} default 22 Mapbox（0-24） 高德 （2-19）

### minPitch 最小倾角

地图最小俯仰角 {number} default 0

### maxPitch 最大倾角

地图最大俯仰角 {number} default 60

### rotateEnable 是否允许旋转

地图是否可旋转 {Boolean} default true

### interactive 是否允许交互

_boolean_ **optional** _default:_ true

是否允许地图交互（包括鼠标、触摸、键盘等），设为 `false` 后地图变为静态展示状态

### scrollZoom 是否允许滚轮缩放

_boolean_ **optional** _default:_ true

是否启用滚轮缩放交互

### boxZoom 是否允许框选缩放

_boolean_ **optional** _default:_ true

是否启用框选缩放交互（按住 Shift 拖拽）

### dragRotate 是否允许拖拽旋转

_boolean_ **optional** _default:_ true

是否启用拖拽旋转交互

### dragPan 是否允许拖拽平移

_boolean_ **optional** _default:_ true

是否启用拖拽平移交互

### keyboard 是否允许键盘控制

_boolean_ **optional** _default:_ true

是否启用键盘快捷键控制地图

### doubleClickZoom 是否允许双击缩放

_boolean_ **optional** _default:_ true

是否启用双击缩放交互

### touchZoomRotate 是否允许触摸缩放旋转

_boolean_ **optional** _default:_ true

是否启用双指捏合缩放旋转交互

### renderWorldCopies 是否渲染世界副本

_boolean_ **optional** _default:_ true

超出 -180 和 180 经度范围时，是否在两侧重复渲染地图

### maxBounds 地图最大边界范围

限制地图可视范围在指定的地理范围内

### bearingSnap 北向吸附阈值

_number_ **optional** _default:_ 7

当用户旋转地图接近正北方向时，自动吸附到正北方向的角度阈值（度数）

## 地图事件

Scene 统一代理，见 [Scene 文档](/zh/api/scene)

或者

scene.map 直接调用 map 实例方法


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

[在线案例](/zh/examples/amap-plugin/bus/busstop/)
