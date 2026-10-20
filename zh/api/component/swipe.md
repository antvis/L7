---
title: "Swipe 卷帘"
description: "Swipe 卷帘"
language: "zh"
canonical: "https://l7.antv.antgroup.com/zh/api/component/swipe/"
---

[资料索引](/llms.txt)

该控件用于分屏对比两个地图上叠加图层。

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*jwqFSKUjVaoAAAAAAAAAAAAADmJ7AQ/original" width="400"/>

## 说明

图层可以添加到地图的左侧（顶部）或右侧（底部）。未添加到卷帘上的图层将显示在两侧。

## 使用

[示例](/zh/examples/component/control/swipe/)

```ts
import { Scene, Swipe } from '@antv/l7';

const scene = new Scene({
  // ...
});

scene.on('loaded', () => {
  const swipe = new Swipe({
    orientation: 'vertical',
    ratio: 0.5,
    layers: [],
    rightLayers: [],
  });
  scene.addControl(swipe);
});
```

## 配置

| 名称        | 说明                                        | 类型                       |
| ----------- | ------------------------------------------- | -------------------------- |
| orientation | 卷帘方向设置，默认 'vertical'               | `'vertical'｜'horizontal'` |
| ratio       | 卷帘的位置，值域为 0 到 1, 默认正中间为 0.5 | `number`                   |
| layers      | 卷帘左侧（竖向）或顶部（横向）的图层        | `ILayer[]`                 |
| rightLayers | 卷帘右侧（竖向）或底部（横向）的图层        | `ILayer[]`                 |
| className   | 自定义样式名                                | `string`                   |
| style       | 自定义样式                                  | `string`                   |

## 方法

| 名称         | 说明                                          | 类型                                   |
| ------------ | --------------------------------------------- | -------------------------------------- |
| setOptions   | 更新配置，参数需要参考对应组件的[配置](#配置) | `(newOption: Partial<Option>) => void` |
| getOptions   | 获取当前[配置](#配置)                         | `() => Option`                         |
| show         | 显示组件                                      | `() => void`                           |
| hide         | 隐藏组件                                      | `() => void`                           |
| getContainer | 获取当前控件对应的 `DOM` 容器                 | `() => HTMLElement`                    |


| 名称         | 说明             | 类型                                                             |
| ------------ | ---------------- | ---------------------------------------------------------------- |
| addLayer     | 添加要剪裁的图层 | `(layer: ILayer ｜ ILayer[], addRight: boolean = false) => void` |
| removeLayer  | 移除剪裁的图层   | `(layer: ILayer ｜ ILayer[]) => void`                            |
| removeLayers | 清除所有图层     | `() => void`                                                     |

## 事件

| 名称   | 说明               | 类型             |
| ------ | ------------------ | ---------------- |
| add    | 组件被添加时的事件 | `(this) => void` |
| remove | 组件被移除时的事件 | `(this) => void` |
| show   | 组件显示时的事件   | `(this) => void` |
| hide   | 组件隐藏时的事件   | `(this) => void` |


| 名称   | 说明         | 类型                                                |
| ------ | ------------ | --------------------------------------------------- |
| moving | 卷帘移动事件 | `(data: {size: number[], ratio: number[]}) => void` |
