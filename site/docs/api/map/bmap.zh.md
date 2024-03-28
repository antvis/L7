---
title: 百度地图
order: 2
---

<embed src="@/docs/api/common/style.md"></embed>

## 简介

L7 地理可视化侧重于地理数据的可视化表达，地图层需要依赖第三方地图，第三方地图通过 Scene 统一创建管理，只需要通过 Scene 传入地图配置项即可。

L7 在内部解决了不同地图底图之间差异，同时 L7 层面统一管理地图的操作方法。

L7 目前支持的百度地图是[API GL版本](https://lbsyun.baidu.com/index.php?title=jspopularGL)，也是百度地图官方推荐使用版本。

### 申请token

使用百度地图之前，需要申请百度地图密钥，如何申请百度地图密钥[点我查看](https://lbs.baidu.com/index.php?title=jspopularGL/guide/getkey)。

⚠️ L7 内部设置了默认 token，仅供测试使用

### import

```javascript
import { BaiduMap } from '@antv/l7-maps';
```

### 实例化

L7 提供 BaiduMap直接实例化地图，也可外部传入方式实例化地图。

新项目推荐 BaiduMap 直接实例化，已有地图项目可外部传入方式，以便快速接入 L7 的能力。

#### BaiduMap 实例化

```js
import { BaiduMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new BaiduMap({
    // 填写百度地图密钥，此为测试token，不可用于生产
    token: 'zLhopYPPERGtpGOgimcdKcCimGRyyIsh',
    center: [103, 30],
    pitch: 4,
    zoom: 10,
    rotation: 19,
  }),
});
```

#### 外部传入实例化

⚠️ scene id 参数需要与 BMapGL.Map 实例是同个容器。

⚠️ 传入地图实例需要自行引入[百度地图的 API](https://lbs.baidu.com/index.php?title=jspopularGL/guide/show)

```javascript
const map = new BMapGL.Map('map', {
  zoom: 11, // 初始化地图层级
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

BaiduMap [示例地址](/examples/map/map/#baidumap)、外部传入[示例地址](/examples/map/map/#bmapInstance)

<embed src="@/docs/api/common/map.zh.md"></embed>
