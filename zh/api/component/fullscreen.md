---
title: "Fullscreen 全屏"
description: "Fullscreen 全屏"
language: "zh"
canonical: "https://l7.antv.antgroup.com/zh/api/component/fullscreen/"
---

[资料索引](/llms.txt)

用于控制地图区域的**全屏**和**退出全屏**的控制按钮控件。

<img src="https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*CcOXRqK5ARgAAAAAAAAAAAAAARQnAQ" width="400"/>

## 使用

[示例](/zh/examples/component/control/fullscreen/)

```ts
import { Scene, Fullscreen } from '@antv/l7';

const scene = new Scene({
  // ...
});

scene.on('loaded', () => {
  const fullscreen = new Fullscreen({
    btnText: '全屏',
    exitBtnText: '退出全屏',
  });
  scene.addControl(fullscreen);
});
```

## 配置

| 名称     | 说明                                                    | 类型                          |
| -------- | ------------------------------------------------------- | ----------------------------- |
| btnIcon  | 按钮图标                                                | `HTMLElement` \| `SVGElement` |
| btnText  | 按钮内容文本                                            | `string`                      |
| title    | 按钮的 `title` 属性                                     | `string`                      |
| vertical | 在 btnIcon 有值的情况下，按钮内的图标和文案是否纵向排列 | `boolean`                     |


| 名称        | 说明                              | 类型                          |
| ----------- | --------------------------------- | ----------------------------- |
| exitBtnIcon | 退出全屏按钮的图标                | `HTMLElement` \| `SVGElement` |
| exitBtnText | 退出全屏按钮的文本                | `string`                      |
| exitTitle   | 退出全屏按钮的文本的 `title` 属性 | `string`                      |

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

| 名称             | 说明                            | 类型         |
| ---------------- | ------------------------------- | ------------ |
| toggleFullscreen | 进入/退出全屏地图部分的全屏状态 | `() => void` |

| 名称         | 说明                                          | 类型                                   |
| ------------ | --------------------------------------------- | -------------------------------------- |
| setOptions   | 更新配置，参数需要参考对应组件的[配置](#配置) | `(newOption: Partial<Option>) => void` |
| getOptions   | 获取当前[配置](#配置)                         | `() => Option`                         |
| show         | 显示组件                                      | `() => void`                           |
| hide         | 隐藏组件                                      | `() => void`                           |
| getContainer | 获取当前控件对应的 `DOM` 容器                 | `() => HTMLElement`                    |


## 事件

| 名称             | 说明                     | 类型                              |
| ---------------- | ------------------------ | --------------------------------- |
| fullscreenChange | 当全屏状态发生变化时触发 | `(isFullscreen: boolean) => void` |

| 名称   | 说明               | 类型             |
| ------ | ------------------ | ---------------- |
| add    | 组件被添加时的事件 | `(this) => void` |
| remove | 组件被移除时的事件 | `(this) => void` |
| show   | 组件显示时的事件   | `(this) => void` |
| hide   | 组件隐藏时的事件   | `(this) => void` |
