---
title: 腾讯地图
order: 3
---

<embed src="@/docs/common/style.md"></embed>

## 简介

L7 地理可视化侧重于地理数据的可视化表达，地图层需要依赖第三方地图，第三方地图通过 Scene 统一创建管理，只需要通过 Scene 传入地图配置项即可。

L7 在内部解决了不同地图底图之间差异，同时 L7 层面统一管理地图的操作方法。

L7 目前支持的腾讯地图是[JavaScript API GL](https://lbs.qq.com/webApi/javascriptGL/glGuide/glOverview)，也是腾讯地图官方推荐使用版本。

### 申请token

使用腾讯地图之前，需要注册腾讯地图账号并申请Key

1. 首先，[注册开发者账号](https://lbs.qq.com/dev/console/register?backurl=https%3A%2F%2Flbs.qq.com%2FwebApi%2FjavascriptGL%2FglGuide%2FglOverview)，成为腾讯位置服务开发者。

2. 登陆之后，在进入「应用管理」页面「创建应用」。

3. 为应用[添加 Key]，勾选用户协议并提交。

### import

```javascript
import { TencentMap } from '@antv/l7-maps';
```
### 实例化

L7 提供 TencentMap直接实例化地图，也可外部传入方式实例化地图。

新项目推荐 TencentMap 直接实例化，已有地图项目可外部传入方式，以便快速接入 L7 的能力。

⚠️  L7 内部设置了默认 token，仅供测试使用。

#### TencentMap 实例化

```js
import { TencentMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new TencentMap({
    // 填写腾讯地图的key值，此为测试token，不可用于生产
    token: 'OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77',
    style: 'style1',
    center: [ 107.054293, 35.246265 ],
    zoom: 4.056,
  }),
});
```

#### 外部传入实例化

⚠️ scene id 参数需要与 TMap.Map 实例是同个容器。

⚠️ 传入地图实例需要自行引入腾讯地图的 API。

```javascript
<script charset="utf-8" src="https://apis.map.qq.com/api/jue?key=您申请的key值"></script>
```

```javascript
const map = new TMap.Map("map", {
    pitch:45,
    zoom:12,
    center: new TMap.LatLng(39.984104, 116.307503)
});

const scene = new Scene({
  id: 'map',
  map: new TencentMap({
    mapInstance: map,
  }),
});
```

Tencentmap [示例地址](/examples/map/map/#tencentmap)、外部传入[示例地址](/examples/map/map/#tmapInstance)

<embed src="@/docs/common/map.zh.md"></embed>