---
title: 地图 Map
order: 1
---

<embed src="@/docs/common/style.md"></embed>

## 简介

L7 地理可视化侧重于地理数据的可视化表达，地图层需要依赖第三方地图，第三方地图通过 Scene 统一创建，创建管理
只需要通过 Scene 传入地图配置项即可。

L7 在内部解决了不同地图底图之间差异，同时 L7 层面统一管理地图的操作方法。

目前 L7 支持两种地图底图

- Map 独立地图引擎，不需要底图、或者加载地图瓦片服务，不需要 Token

- 高德地图  GaodeMap 默认指向  [Token](https://lbs.amap.com/api/javascript-api/guide/abc/prepare)

- MapBox 国际业务， 需要注册 [Token]()

### import

```javascript
import { GaodeMap } from '@antv/l7-maps'; // 默认引入高德 2.x 版本 2.11.0 版本开始默认升级为v2
import { GaodeMapV1 } from '@antv/l7-maps'; //  2.11.0 版本之前版本默认升级为v1

import { Mapbox } from '@antv/l7-maps';
import { Map } from '@antv/l7-maps';
```

### 实例化

⚠️ 使用地图申请地图 token，L7 内部设置了默认 token，仅供测试使用

#### 默认 Map 实例化

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

#### 高德地图实例化

高德地图 API 配置参数

- token
  注册高德 [API token](https://lbs.amap.com/api/javascript-api/guide/abc/prepare)

- plugin {array} `['AMap.ElasticMarker','AMap.CircleEditor']`

  加载[高德地图插件](https://lbs.amap.com/api/javascript-api/guide/abc/plugins)

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

#### Mapbox 地图实例化

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

### 传入外部实例

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

#### 传入 Mapbox 地图实例

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

### zoom 初始化缩放等级

<description> _number_ </description>

地图初始显示级别 {number} Mapbox （0-24） 高德 （2-19）

### center 地图中心

地图初始中心经纬度 {Lnglat}

### pitch 地图倾角

地图初始俯仰角度 {number}  default 0

### style 地图图样式

简化地图样式设置，L7 内置了三种主题默认样式 高德，mapbox 都可以使用

- dark
- light
- normal
- blank 无底图

除了内置的样式，你也可以传入自定义的其他属性。

比如高德地图

⚠️ 高德地图样式 增加 `isPublic=true` 参数

```javascript
{
  style: 'amap://styles/2a09079c3daac9420ee53b67307a8006?isPublic=true'; // 设置方法和高德地图一致
}
```

### minZoom 最小缩放等级

地图最小缩放等级 {number}  default 0 Mapbox 0-24） 高德 （2-19）

### maxZoom 最大缩放等级

地图最大缩放等级 {number}  default 22 Mapbox（0-24） 高德 （2-19）

### rotateEnable 是否允许旋转

地图是否可旋转 {Boolean} default true

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
