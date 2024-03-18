---
title: Swipe
order: 12
---

Swipe is a control that add a split screen to compare two map overlays.

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*jwqFSKUjVaoAAAAAAAAAAAAADmJ7AQ/original" width="400"/>

## Notice

Layers can be added to left (top) or right (bottom) side of the map. Layers that are not added are displayed on both sides.

## Use

[Example](/examples/component/control#swipe)

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

## Configuration

| name        | illustrate                               | type                       |
| ----------- | ---------------------------------------- | -------------------------- |
| orientation | vertical or horizontal, default vertical | `'vertical'｜'horizontal'` |
| ratio       | swipe [0,1], default 0.5                 | `number`                   |
| layers      | layers to swipe                          | `ILayer[]`                 |
| rightLayers | layers to swipe on right side            | `ILayer[]`                 |
| className   | control class name                       | `string`                   |
| style       | control style                            | `string`                   |

## Method

<embed src="@/docs/api/common/control/method.en.md"></embed>

| name         | illustrate             | type                                                             |
| ------------ | ---------------------- | ---------------------------------------------------------------- |
| addLayer     | Add a layer to clip.   | `(layer: ILayer ｜ ILayer[], addRight: boolean = false) => void` |
| removeLayer  | Remove a layer to clip | `(layer: ILayer ｜ ILayer[]) => void`                            |
| removeLayers | Remove all layers      | `() => void`                                                     |

## Event

<embed src="@/docs/api/common/control/event.en.md"></embed>

| name   | illustrate         | type                                                |
| ------ | ------------------ | --------------------------------------------------- |
| moving | swipe moving event | `(data: {size: number[], ratio: number[]}) => void` |
