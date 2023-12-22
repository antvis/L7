---
title: Swipe 卷帘
order: 12
---

该控件用于分屏对比两个地图上叠加图层。

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*jwqFSKUjVaoAAAAAAAAAAAAADmJ7AQ/original" width="400"/>

## 说明

图层可以添加到地图的左侧（顶部）或右侧（底部）。未添加到卷帘上的图层将显示在两侧。

## 使用

[示例](/examples/component/control#swipe)

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
| layers      | 卷帘左侧的图层                              | `ILayer[]`                 |
| rightLayers | 卷帘左侧的图层                              | `ILayer[]`                 |
| className   | 自定义样式名                                | `string`                   |
| style       | 自定义样式                                  | `string`                   |

## 方法

<embed src="@/docs/api/common/control/method.zh.md"></embed>

| 名称         | 说明             | 类型                                                             |
| ------------ | ---------------- | ---------------------------------------------------------------- |
| addLayer     | 添加要剪裁的图层 | `(layer: ILayer ｜ ILayer[], addRight: boolean = false) => void` |
| removeLayer  | 移除剪裁的图层   | `(layer: ILayer ｜ ILayer[]) => void`                            |
| removeLayers | 清除所有图层     | `() => void`                                                     |

## 事件

<embed src="@/docs/api/common/control/event.zh.md"></embed>

| 名称   | 说明         | 类型                                                |
| ------ | ------------ | --------------------------------------------------- |
| moving | 卷帘移动事件 | `(data: {size: number[], ratio: number[]}) => void` |
