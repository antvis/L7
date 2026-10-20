---
title: "Logo 标志"
description: "Logo 标志"
language: "zh"
canonical: "https://l7.antv.antgroup.com/zh/api/component/logo/"
---

[资料索引](/llms.txt)

用于在地图上展示 Logo 图片的控件，并且支持超链接点击跳转。

![](https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*CbdSRLizMLIAAAAAAAAAAAAAARQnAQ)

## 说明

当前 L7 会默认在地图左下角展示该控件，如需隐藏可以在 Scene 实例化时配置：

```ts
import { Scene } from '@antv/l7';

const scene = new Scene({
  // ...

  // 关闭默认 L7 Logo
  logoVisible: false,
});
```

## 使用

[示例](/zh/examples/component/control/logo/)

```ts
import { Scene, Logo } from '@antv/l7';

const scene = new Scene({
  //...
  logoVisible: false,
});

scene.on('loaded', () => {
  const logo = new Logo({
    // 图片 url
    img: 'https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*GRb1TKp4HcMAAAAAAAAAAAAAARQnAQ',
    // 跳转地址
    href: 'https://l7.antv.antgroup.com',
  });
  scene.addControl(logo);
});
```

## 配置

| 名称 | 说明                                                 | 类型     |
| ---- | ---------------------------------------------------- | -------- |
| img  | Logo 展示的图片 url                                  | `string` |
| href | 点击 Logo 跳转的超链接，不传则纯展示图片，点击不跳转 | `string` |

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
