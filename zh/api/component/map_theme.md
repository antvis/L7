---
title: "MapTheme 地图主题"
description: "MapTheme 地图主题"
language: "zh"
canonical: "https://l7.antv.antgroup.com/zh/api/component/map_theme/"
---

[资料索引](/llms.txt)

该控件用于切换地图底图的主题样式。

<img src="https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*xb29TawbZDgAAAAAAAAAAAAAARQnAQ" width="400"/>

## 说明

MapTheme 会根据当前地图底图类型（如 Mapbox、GaodeMapV2），默认展示相对应的默认主题选项，用于也可以传入自定义的主题选项

## 使用

[示例](/zh/examples/component/control/maptheme/)

```ts
import { Scene, MapTheme } from '@antv/l7';

const scene = new Scene({
  // ...
});

scene.on('loaded', () => {
  const mapTheme = new MapTheme({});
  scene.addControl(mapTheme);
});
```

## 配置

| 名称    | 说明                                                                                   | 类型                        |
| ------- | -------------------------------------------------------------------------------------- | --------------------------- |
| options | 用户自定义的地图主题选项，每个选项的类型可见 [IControlOptionItem](#icontroloptionitem) | `Array<IControlOptionItem>` |

## IControlOptionItem

```ts
export type IControlOptionItem = {
  // 主题选项对应的文本
  text: string;
  // 主题选项对应地图主题 style 的 key 值
  value: string;
  // 主题选项对应展示的图片
  img?: string;
};
```

| 名称            | 说明                 | 类型                                |
| --------------- | -------------------- | ----------------------------------- |
| popperPlacement | 气泡相对于按钮的位置 | [PopperPlacement](#PopperPlacement) |
| popperTrigger   | 气泡弹出的触发方式   | `'click'` \| `'hover'`              |
| popperClassName | 气泡容器自定义样式名 | `string`                            |

### PopperPlacement

```ts
export type PopperPlacement =
  | 'top-start'
  | 'top'
  | 'top-end'
  | 'left-start'
  | 'left'
  | 'left-end'
  | 'bottom-start'
  | 'bottom'
  | 'bottom-end'
  | 'right-start'
  | 'right'
  | 'right-end';
```


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


| 名称       | 说明             | 类型             |
| ---------- | ---------------- | ---------------- |
| popperShow | 气泡显示时的回调 | `(this) => void` |
| popperHide | 气泡隐藏时的回调 | `(this) => void` |


| 名称 | 说明 | 类型 |
| ------------ | ---------------------- | -------- | ------------------ |
| selectChange | 当所选值发生改变时触发 | `(string | string[]) => void` |
