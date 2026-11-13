---
title: "Scale"
description: "Scale"
language: "en"
canonical: "https://l7.antv.antgroup.com/en/api/component/scale/"
---

[Resource index](/llms.txt)

This control displays the ratio of distances on the map to the corresponding distances on the ground.

<img src="https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*r3iSQI4SekYAAAAAAAAAAAAAARQnAQ" width="400"/>

## use

[Example](/en/examples/component/control/scale/)

```ts
import { Scene, Scale } from '@antv/l7';

const scene = new Scene({
  //...
});

scene.on('loaded', () => {
  const scale = new Scale({
    zoomInTitle: '放大',
    zoomOutTitle: '缩小',
  });
  scene.addControl(scale);
});
```

## Configuration

| name           | illustrate                                                               | type      | default value |
| -------------- | ------------------------------------------------------------------------ | --------- | ------------- |
| lockWidth      | Whether to fix the container width                                       | `boolean` | `true`        |
| maxWidth       | The maximum width of the component's container                           | `number`  | `100`         |
| metric         | exhibit**km**format scale                                                | `boolean` | `true`        |
| imperial       | exhibit**mile**format scale                                              | `boolean` | `false`       |
| updateWhenIdle | Whether to only update the scale after dragging and zooming are complete | `boolean` | `false`       |

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
