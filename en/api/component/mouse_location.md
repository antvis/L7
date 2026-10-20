---
title: "MouseLocation"
description: "MouseLocation"
language: "en"
canonical: "https://l7.antv.antgroup.com/en/api/component/mouse_location/"
---

[Resource index](/llms.txt)

Used to display the longitude and latitude corresponding to the current cursor on the map in real time.

<img src="https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*i4F5QZ4K650AAAAAAAAAAAAAARQnAQ" width="400"/>

## use

[Example](/en/examples/component/control/mouselocation/)

```ts
import { Scene, MouseLocation } from '@antv/l7';

const scene = new Scene({
  // ...
});

scene.on('loaded', () => {
  const mouseLocation = new MouseLocation({
    transform: (position) => {
      return position;
    },
  });
  scene.addControl(mouseLocation);
});
```

## Configuration

| name      | illustrate                                                            | type                                               |
| --------- | --------------------------------------------------------------------- | -------------------------------------------------- |
| transform | Callback function to convert the longitude and latitude of the cursor | `(position: [number, number]) => [number, number]` |

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

| name           | illustrate                                                      | type                                   |
| -------------- | --------------------------------------------------------------- | -------------------------------------- |
| locationChange | Triggered when the longitude and latitude of the cursor changes | `(position: [number, number]) => void` |

| Name   | Description                            | Type             |
| ------ | -------------------------------------- | ---------------- |
| add    | Event when component is added          | `(this) => void` |
| remove | Event when component is removed        | `(this) => void` |
| show   | Events when the component is displayed | `(this) => void` |
| hide   | Event when component is hidden         | `(this) => void` |
