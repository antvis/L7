---
title: "Control"
description: "Control"
language: "en"
canonical: "https://l7.antv.antgroup.com/en/api/component/control/"
---

[Resource index](/llms.txt)

The map control refers to hovering around the map, and you can perform operations on the map, layers and other elements.**information presentation**or**interaction**s component.

![](https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*zgFeTocc-_oAAAAAAAAAAAAAARQnAQ)

## use

```ts
import { Scene, Zoom } from '@antv/l7';

const scene = new Scene({
  // ...
});

scene.on('loaded', () => {
  //Instantiate the Zoom control, you can pass in the control configuration in the constructor
  const zoom = new Zoom({
    position: 'leftbottom',
    className: 'my-test-class',
  });

  //Add the instantiated control to L7
  scene.addControl(zoom);
});
```

## Update configuration

After the control is instantiated, if you need to update the configuration, you can call the control instance's`setOptions`method, and pass in the configuration object that needs to be updated.

```ts
const zoom = new Zoom({
  position: 'leftbottom',
});

const onPositionChange = () => {
  // Pass in the configuration object that needs to be updated through setOptions
  zoom.setOptions({
    position: 'topright',
  });
};
```

## slot

Currently the controls in L7 support inserting into the map**Upper left, lower left, upper right, lower right, upper, left, lower, right**Eight position slots or user-defined`DOM`, and support between multiple controls in the same map slot**Horizontal**and**portrait**arrangement.

When initializing all control classes, you can pass in`position`Parameters to set the corresponding slot and arrangement of the control.

![](https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*BfG1TI231ysAAAAAAAAAAAAAARQnAQ)

## Configuration

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
