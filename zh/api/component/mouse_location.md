---
title: "MouseLocation 光标经纬度"
description: "MouseLocation 光标经纬度"
language: "zh"
canonical: "https://l7.antv.antgroup.com/zh/api/component/mouse_location/"
---

[资料索引](/llms.txt)

用于实时展示当前光标在地图上所对应的经纬度。

<img src="https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*i4F5QZ4K650AAAAAAAAAAAAAARQnAQ" width="400"/>

## 使用

[示例](/zh/examples/component/control/mouselocation/)

```ts
import { Scene, MouseLocation } from '@antv/l7';

const scene = new Scene({
  // ...
});

scene.on('loaded', () => {
  const mouseLocation = new MouseLocation({
    transform: (position) => {
      return position;
    },
  });
  scene.addControl(mouseLocation);
});
```

## 配置

| 名称      | 说明                         | 类型                                               |
| --------- | ---------------------------- | -------------------------------------------------- |
| transform | 转换光标所在经纬度的回调函数 | `(position: [number, number]) => [number, number]` |

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

| 名称           | 说明                         | 类型                                   |
| -------------- | ---------------------------- | -------------------------------------- |
| locationChange | 光标所在经纬度发生变化时触发 | `(position: [number, number]) => void` |

| 名称   | 说明               | 类型             |
| ------ | ------------------ | ---------------- |
| add    | 组件被添加时的事件 | `(this) => void` |
| remove | 组件被移除时的事件 | `(this) => void` |
| show   | 组件显示时的事件   | `(this) => void` |
| hide   | 组件隐藏时的事件   | `(this) => void` |
