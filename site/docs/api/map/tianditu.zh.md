---
title: 天地图
order: 10
---

<embed src="@/docs/api/common/style.md"></embed>

## 简介

L7 地理可视化侧重于地理数据的可视化表达，地图层需要依赖第三方地图，第三方地图通过 Scene 统一创建管理，只需要通过 Scene 传入地图配置项即可。

L7 在内部解决了不同地图底图之间差异，同时 L7 层面统一管理地图的操作方法。

- [天地图 官网](http://lbs.tianditu.gov.cn/api/js4.0/guide.html)

## 申请 token

天地图 JavaScript API 4.0 支持 HTTP 和 HTTPS，免费对外开放，可直接使用。使用 API 之前，需要[申请应用 Key](https://console.tianditu.gov.cn/api/key)。

## import

```javascript
import { TdtMap } from '@antv/l7-maps';
```

## 使用

```ts
import { Scene } from '@antv/l7';
import { TdtMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new TdtMap({
    token: '你的天地图 token',
    center: [120, 30],
    zoom: 10,
  }),
});

scene.on('loaded', () => {
  // 添加图层
});
```

## 配置项

| 名称        | 说明                 | 类型               | 默认值                           |
| ----------- | -------------------- | ------------------ | -------------------------------- |
| token       | 天地图 API 的 Key    | `string`           | 内置测试 token（生产环境请替换） |
| center      | 地图初始中心经纬度   | `[number, number]` | `[121.30654, 31.25744]`          |
| zoom        | 地图初始缩放等级     | `number`           | `3`                              |
| minZoom     | 地图最小缩放等级     | `number`           | `1`                              |
| maxZoom     | 地图最大缩放等级     | `number`           | `18`                             |
| mapInstance | 传入已有的天地图实例 | `T.Map`            | -                                |

<embed src="@/docs/api/common/map.zh.md"></embed>
