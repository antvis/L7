---
title: "LayerSwitch 图层显隐"
description: "LayerSwitch 图层显隐"
language: "zh"
canonical: "https://l7.antv.antgroup.com/zh/api/component/layer_switch/"
---

[资料索引](/llms.txt)

用于控制目标图层组的**显示**和**隐藏**操作。

<img src="https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*SiQWT5RnMDYAAAAAAAAAAAAAARQnAQ" width="400"/>

## 说明

**注意**： 在控件中展示的图层名称会默认读取图层的 `name` 属性，因此需要用户在初始化图层时传入图层对应的名称。

## 使用

[示例](/zh/examples/component/control/layerswitch/)

```ts
import { Scene, LayerSwitch } from '@antv/l7';

const scene = new Scene({
  // ...
});

scene.on('loaded', () => {
  const layer = new PointLayer({
    name: '自定义图层名称',
  });
  scene.addLayer(layer);

  const layerSwitch = new LayerSwitch({
    layers: [layer],
  });
  scene.addControl(layerSwitch);
});
```

## 配置

| 名称     | 说明                                                                                       | 类型                                         |
| -------- | ------------------------------------------------------------------------------------------ | -------------------------------------------- |
| layers   | 需要被控制的 `layer` 数组，支持传入图层示例或者图层 id，不传则默认读取当前 L7 中所有的图层 | `Array<ILayer \| string \| LayerSwitchItem>` |
| multiple | 控件内的图层选项是否为多选，单选模式下默认展示第一个选项对应的图层                         | `boolean`                                    |

### LayerSwitchItem

| 名称  | 说明                      | 类型                  |
| ----- | ------------------------- | --------------------- |
| layer | 需要被控制的 `layer` 实例 | `ILayer`              |
| name  | 展示的图层名称            | `string \| undefined` |
| img   | 展示的图层图片 `URL`      | `string \| undefined` |

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
