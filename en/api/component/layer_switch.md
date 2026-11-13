---
title: "LayerSwitch"
description: "LayerSwitch"
language: "en"
canonical: "https://l7.antv.antgroup.com/en/api/component/layer_switch/"
---

[Resource index](/llms.txt)

Used to control the target layer group**show**and**hide**operate.

<img src="https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*SiQWT5RnMDYAAAAAAAAAAAAAARQnAQ" width="400"/>

## illustrate

**Notice**: The layer name displayed in the control will read the layer's name by default.`name`property, so the user needs to pass in the corresponding name of the layer when initializing the layer.

## use

[Example](/en/examples/component/control/layerswitch/)

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

## Configuration

| name   | illustrate                                                                                                                                             | type                      |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------- |
| layers | need to be controlled`layer`Array, supports passing in layer example or layer id. If not passed, all layers in the current L7 will be read by default. | `Array<ILayer \| string>` |

| name            | illustrate                                        | type                                |
| --------------- | ------------------------------------------------- | ----------------------------------- |
| popperPlacement | The position of the bubble relative to the button | [PopperPlacement](#PopperPlacement) |
| popperTrigger   | How to trigger bubble pop-up                      | `'click'`\|`'hover'`                |
| popperClassName | Bubble container custom style name                | `string`                            |

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


| name     | illustrate                                                                                 | type                        |
| -------- | ------------------------------------------------------------------------------------------ | --------------------------- |
| btnIcon  | button icon                                                                                | `HTMLElement`\|`SVGElement` |
| btnText  | Button content text                                                                        | `string`                    |
| title    | button`title`Attributes                                                                    | `string`                    |
| vertical | When btnIcon has a value, whether the icons and text in the button are arranged vertically | `boolean`                   |


| name      | illustrate                                                                                                                         | type                  |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| position  | The location and arrangement of controls when they are added to the map, see details[control slot](/en/api/component/control#slot) | [Position](#position) |
| className | Custom style name                                                                                                                  | `string`              |
| style     | Custom style                                                                                                                       | `string`              |

### Position

```ts
export type Position =
  | 'topleft' // ↖ upper left corner, vertical arrangement
  | 'lefttop' // ↖ Upper left corner, arranged horizontally
  | 'topright' // ↗ Upper right corner, vertical arrangement
  | 'righttop' // ↗ Upper right corner, arranged horizontally
  | 'bottomleft' // ↙ lower left corner, arranged vertically
  | 'leftbottom' // ↙ lower left corner, arranged horizontally
  | 'bottomright' // ↘ Lower right corner, arranged vertically
  | 'rightbottom' // ↘ Lower right corner, arranged horizontally
  | 'topcenter' // ↑ top center, arranged horizontally
  | 'bottomcenter' // ↓ bottom center, arranged horizontally
  | 'leftcenter' // ← left center, arranged vertically
  | 'rightcenter' // → middle right, arranged vertically
  | Element; // Pass in DOM as the container of the current control
```


## method

| name         | illustrate                                                                                                  | type                                   |
| ------------ | ----------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| setOptions   | Update configuration, parameters need to refer to the corresponding component[Configuration](Configuration) | `(newOption: Partial<Option>) => void` |
| getOptions   | Get current[Configuration](Configuration)                                                                   | `() => Option`                         |
| show         | display component                                                                                           | `() => void`                           |
| hide         | Hidden component                                                                                            | `() => void`                           |
| getContainer | Get the information corresponding to the current control`DOM`container                                      | `() => HTMLElement`                    |


## event

| Name   | Description                            | Type             |
| ------ | -------------------------------------- | ---------------- |
| add    | Event when component is added          | `(this) => void` |
| remove | Event when component is removed        | `(this) => void` |
| show   | Events when the component is displayed | `(this) => void` |
| hide   | Event when component is hidden         | `(this) => void` |


| name       | illustrate                        | type             |
| ---------- | --------------------------------- | ---------------- |
| popperShow | Callback when bubble is displayed | `(this) => void` |
| popperHide | Callback when bubble is hidden    | `(this) => void` |


| name         | illustrate                            | type      |                      |
| ------------ | ------------------------------------- | --------- | -------------------- |
| selectChange | Fires when the selected value changes | \`(string | string\[]) => void\` |
