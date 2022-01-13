---
title: Map
order: 1
---

`markdown:docs/common/style.md`

# 简介

L7 专注数据可视化层数据表达，目前 L7 还不支持独立的地图引擎，需要引入第三方引擎，目前支持高德地图和 MapBox 两种。
L7 在内部解决了不同地图底图之间差异，同时 L7 层面统一管理地图的操作方法。

## Map

### 引入 Map

```javascript
import { GaodeMap } from '@antv/l7-maps';

import { Mapbox } from '@antv/l7-maps';
```

### 实例化

⚠️ 使用地图申请地图 token，L7 内部设置了默认 token，仅供测试使用

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

⚠️ viewMode 设置为 3D 模式

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

[示例地址](/zh/examples/tutorial/map#amapInstance)
[代码地址](https://github.com/antvis/L7/blob/master/examples/tutorial/map/demo/amapInstance.js)

#### 传入 Mapbox 地图实例

```javascript
mapboxgl.accessToken =
  'pk.eyJ1IjoibHp4dWUiLCJhIjoiYnhfTURyRSJ9.Ugm314vAKPHBzcPmY1p4KQ';
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
