---
title: GeoLocate 定位
order: 6
---

使用浏览器环境的 `nagigator` 的 `getlocation` 方法，使用浏览器打开位置感应能力获取当前用户所在经纬度。

<img src="https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*BOsBRJyYeMEAAAAAAAAAAAAAARQnAQ" width="400"/>

## 说明

[示例](/examples/component/control#geolocate)

**注意：**

- 在使用该能力时，会需要用户对浏览器打开位置感知能力进行鉴权。
- 当前浏览器获取到的坐标是 `WGS84` 地理坐标系，在高德地图上使用会有偏差，可以使用 `transform` 配置进行坐标系的转换。

## 使用

```ts
import { Scene, GeoLocate } from '@antv/l7';
import gcoord from 'gcoord';

const scene = new Scene({
  // ...
});

scene.on('loaded', () => {
  const geoLocate = new GeoLocate({
    transform: (position) => {
      // 将获取到基于 WGS84 地理坐标系 的坐标转成 GCJ02 坐标系
      return gcoord.transform(position, gcoord.WGS84, gcoord.GCJ02);
    },
  });
  scene.addControl(geoLocate);
});
```

## 配置

| 名称      | 说明                                                                    | 类型                                               |
| --------- | ----------------------------------------------------------------------- | -------------------------------------------------- |
| transform | 格式化通过 `getlocation` 获取到的经纬度的函数，可以用于地理坐标系的转换 | `(position: [number, number]) => [number, number]` |

<embed src="@/docs/api/common/control/btn-api.zh.md"></embed>

<embed src="@/docs/api/common/control/api.zh.md"></embed>

## 方法

| 名称           | 说明                   | 类型                              |
| -------------- | ---------------------- | --------------------------------- |
| getGeoLocation | 获取当前用户所在经纬度 | `() => Promise<[number, number]>` |

<embed src="@/docs/api/common/control/method.zh.md"></embed>

## 事件

<embed src="@/docs/api/common/control/event.zh.md"></embed>
