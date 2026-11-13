---
title: "GeoLocate 定位"
description: "GeoLocate 定位"
language: "zh"
canonical: "https://l7.antv.antgroup.com/zh/api/component/geolocate/"
---

[资料索引](/llms.txt)

使用浏览器环境的 `nagigator` 的 `getlocation` 方法，使用浏览器打开位置感应能力获取当前用户所在经纬度。

<img src="https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*BOsBRJyYeMEAAAAAAAAAAAAAARQnAQ" width="400"/>

## 说明

[示例](/zh/examples/component/control/geolocate/)

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

| 名称     | 说明                                                    | 类型                          |
| -------- | ------------------------------------------------------- | ----------------------------- |
| btnIcon  | 按钮图标                                                | `HTMLElement` \| `SVGElement` |
| btnText  | 按钮内容文本                                            | `string`                      |
| title    | 按钮的 `title` 属性                                     | `string`                      |
| vertical | 在 btnIcon 有值的情况下，按钮内的图标和文案是否纵向排列 | `boolean`                     |


| 名称      | 说明                                                                                      | 类型                  |
| --------- | ----------------------------------------------------------------------------------------- | --------------------- |
| position  | 控件被添加到地图中的位置以及排列方式，详情可见 [控件插槽](/zh/api/component/control#插槽) | [Position](#position) |
| className | 自定义样式名                                                                              | `string`              |
| style     | 自定义样式                                                                                | `string`              |

### Position

```ts
export type Position =
  | 'topleft' // ↖ 左上角，纵向排列
  | 'lefttop' // ↖ 左上角，横向排列
  | 'topright' // ↗ 右上角，纵向排列
  | 'righttop' // ↗ 右上角，横向排列
  | 'bottomleft' // ↙ 左下角，纵向排列
  | 'leftbottom' // ↙ 左下角，横向排列
  | 'bottomright' // ↘ 右下角，纵向排列
  | 'rightbottom' // ↘ 右下角，横向排列
  | 'topcenter' // ↑ 上方中央，横向排列
  | 'bottomcenter' // ↓ 下方中间，横向排列
  | 'leftcenter' // ← 左边中间，纵向排列
  | 'rightcenter' // → 右边中间，纵向排列
  | Element; // 传入 DOM 作为当前控件的容器
```


## 方法

| 名称           | 说明                   | 类型                              |
| -------------- | ---------------------- | --------------------------------- |
| getGeoLocation | 获取当前用户所在经纬度 | `() => Promise<[number, number]>` |

| 名称         | 说明                                          | 类型                                   |
| ------------ | --------------------------------------------- | -------------------------------------- |
| setOptions   | 更新配置，参数需要参考对应组件的[配置](#配置) | `(newOption: Partial<Option>) => void` |
| getOptions   | 获取当前[配置](#配置)                         | `() => Option`                         |
| show         | 显示组件                                      | `() => void`                           |
| hide         | 隐藏组件                                      | `() => void`                           |
| getContainer | 获取当前控件对应的 `DOM` 容器                 | `() => HTMLElement`                    |


## 事件

| 名称   | 说明               | 类型             |
| ------ | ------------------ | ---------------- |
| add    | 组件被添加时的事件 | `(this) => void` |
| remove | 组件被移除时的事件 | `(this) => void` |
| show   | 组件显示时的事件   | `(this) => void` |
| hide   | 组件隐藏时的事件   | `(this) => void` |
