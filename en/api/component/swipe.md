---
title: "Swipe"
description: "Swipe"
language: "en"
canonical: "https://l7.antv.antgroup.com/en/api/component/swipe/"
---

[Resource index](/llms.txt)

Swipe is a control that add a split screen to compare two map overlays.

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*jwqFSKUjVaoAAAAAAAAAAAAADmJ7AQ/original" width="400"/>

## Notice

Layers can be added to left (top) or right (bottom) side of the map. Layers that are not added are displayed on both sides.

## Use

[Example](/en/examples/component/control/swipe/)

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

| name         | illustrate                                                                                                  | type                                   |
| ------------ | ----------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| setOptions   | Update configuration, parameters need to refer to the corresponding component[Configuration](Configuration) | `(newOption: Partial<Option>) => void` |
| getOptions   | Get current[Configuration](Configuration)                                                                   | `() => Option`                         |
| show         | display component                                                                                           | `() => void`                           |
| hide         | Hidden component                                                                                            | `() => void`                           |
| getContainer | Get the information corresponding to the current control`DOM`container                                      | `() => HTMLElement`                    |


| name         | illustrate             | type                                                             |
| ------------ | ---------------------- | ---------------------------------------------------------------- |
| addLayer     | Add a layer to clip.   | `(layer: ILayer ｜ ILayer[], addRight: boolean = false) => void` |
| removeLayer  | Remove a layer to clip | `(layer: ILayer ｜ ILayer[]) => void`                            |
| removeLayers | Remove all layers      | `() => void`                                                     |

## Event

| Name   | Description                            | Type             |
| ------ | -------------------------------------- | ---------------- |
| add    | Event when component is added          | `(this) => void` |
| remove | Event when component is removed        | `(this) => void` |
| show   | Events when the component is displayed | `(this) => void` |
| hide   | Event when component is hidden         | `(this) => void` |


| name   | illustrate         | type                                                |
| ------ | ------------------ | --------------------------------------------------- |
| moving | swipe moving event | `(data: {size: number[], ratio: number[]}) => void` |
