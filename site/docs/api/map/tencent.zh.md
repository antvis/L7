---
title: 腾讯地图
order: 3
---

<embed src="@/docs/api/common/style.md"></embed>

## 简介

L7 地理可视化侧重于地理数据的可视化表达，地图层需要依赖第三方地图，第三方地图通过 Scene 统一创建管理，只需要通过 Scene 传入地图配置项即可。

L7 在内部解决了不同地图底图之间差异，同时 L7 层面统一管理地图的操作方法。

L7 目前支持的腾讯地图是[JavaScript API GL](https://lbs.qq.com/webApi/javascriptGL/glGuide/glOverview)，也是腾讯地图官方推荐使用版本。

### 申请token

使用腾讯地图之前，需要申请腾讯地图密钥，如何申请腾讯地图密钥[点我查看](https://lbs.qq.com/webApi/javascriptGL/glGuide/glBasic)。

⚠️ L7 内部设置了默认 token，仅供测试使用。

### import

```javascript
import { TencentMap } from '@antv/l7-maps';
```

## 初始化地图

```ts
import { Scene, PointLayer } from '@antv/l7';
import { TencentMap } from '@antv/l7-maps';
const scene = new Scene({
  id: 'map',
  map: new TencentMap({
    zoom: 10,
    minZoom: 5,
    maxZoom: 18,
  }),
});
```

腾讯底图 [示例地址](/examples/map/map/#tencentmap)、腾讯地图实例化[示例地址](/examples/map/map/#tmapInstance)

<embed src="@/docs/api/common/map.zh.md"></embed>
