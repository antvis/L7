---
title: "控件"
description: "控件"
language: "zh"
canonical: "https://l7.antv.antgroup.com/zh/api/component/control/"
---

[资料索引](/llms.txt)

地图控件指的是悬停在地图四周，可以对地图以及图层等元素进行**信息呈现**或**交互**的组件。

![](https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*zgFeTocc-_oAAAAAAAAAAAAAARQnAQ)

## 使用

```ts
import { Scene, Zoom } from '@antv/l7';

const scene = new Scene({
  // ...
});

scene.on('loaded', () => {
  // 实例化 Zoom 控件，可以在构造器中传入控件的配置
  const zoom = new Zoom({
    position: 'leftbottom',
    className: 'my-test-class',
  });

  // 将实例化的控件添加至 L7 中
  scene.addControl(zoom);
});
```

## 更新配置

在控件实例化之后，如果需要更新配置，可以调用控件实例的 `setOptions` 方法，同时传入需要更新的配置对象即可。

```ts
const zoom = new Zoom({
  position: 'leftbottom',
});

const onPositionChange = () => {
  // 通过 setOptions 传入需要更新的配置对象
  zoom.setOptions({
    position: 'topright',
  });
};
```

## 插槽

当前 L7 中的控件支持插入到地图的**左上、左下、右上、右下、上、左、下、右**八个位置插槽或者用户自定义的 `DOM` 中，并且在同一地图插槽中，多个控件之间支持**横向**和**纵向**排列。

在初始化所有的控件类时，可以传入 `position` 参数来设置控件对应的插槽以及排列方式。

![](https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*BfG1TI231ysAAAAAAAAAAAAAARQnAQ)

## 配置

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
