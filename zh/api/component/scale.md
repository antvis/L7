---
title: "Scale 缩放尺"
description: "Scale 缩放尺"
language: "zh"
canonical: "https://l7.antv.antgroup.com/zh/api/component/scale/"
---

[资料索引](/llms.txt)

该控件用于显示地图上的距离与地面上相应距离的比率。

<img src="https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*r3iSQI4SekYAAAAAAAAAAAAAARQnAQ" width="400"/>

## 使用

[示例](/zh/examples/component/control/scale/)

```ts
import { Scene, Scale } from '@antv/l7';

const scene = new Scene({
  //...
});

scene.on('loaded', () => {
  const scale = new Scale({
    zoomInTitle: '放大',
    zoomOutTitle: '缩小',
  });
  scene.addControl(scale);
});
```

## 配置

| 名称           | 说明                                 | 类型      | 默认值  |
| -------------- | ------------------------------------ | --------- | ------- |
| lockWidth      | 是否固定容器宽度                     | `boolean` | `true`  |
| maxWidth       | 组件的容器最大宽度                   | `number`  | `100`   |
| metric         | 展示**千米**格式的比例尺             | `boolean` | `true`  |
| imperial       | 展示**英里**格式的比例尺             | `boolean` | `false` |
| updateWhenIdle | 是否只在拖拽和缩放结束后才更新比例尺 | `boolean` | `false` |

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
