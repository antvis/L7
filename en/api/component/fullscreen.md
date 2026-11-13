---
title: "Fullscreen"
description: "Fullscreen"
language: "en"
canonical: "https://l7.antv.antgroup.com/en/api/component/fullscreen/"
---

[Resource index](/llms.txt)

Used to control map areas**full screen**and**Exit Full Screen**control button control.

<img src="https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*CcOXRqK5ARgAAAAAAAAAAAAAARQnAQ" width="400"/>

## use

[Example](/en/examples/component/control/fullscreen/)

```ts
import { Scene, Fullscreen } from '@antv/l7';

const scene = new Scene({
  // ...
});

scene.on('loaded', () => {
  const fullscreen = new Fullscreen({
    btnText: '全屏',
    exitBtnText: '退出全屏',
  });
  scene.addControl(fullscreen);
});
```

## Configuration

| name     | illustrate                                                                                 | type                        |
| -------- | ------------------------------------------------------------------------------------------ | --------------------------- |
| btnIcon  | button icon                                                                                | `HTMLElement`\|`SVGElement` |
| btnText  | Button content text                                                                        | `string`                    |
| title    | button`title`Attributes                                                                    | `string`                    |
| vertical | When btnIcon has a value, whether the icons and text in the button are arranged vertically | `boolean`                   |


| name        | illustrate                                    | type                        |
| ----------- | --------------------------------------------- | --------------------------- |
| exitBtnIcon | Exit full screen button icon                  | `HTMLElement`\|`SVGElement` |
| exitBtnText | Text for exit full screen button              | `string`                    |
| exitTitle   | Exit full screen button text`title`Attributes | `string`                    |

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

| name             | illustrate                                                      | type         |
| ---------------- | --------------------------------------------------------------- | ------------ |
| toggleFullscreen | Enter/exit the full screen state of the full screen map section | `() => void` |

| name         | illustrate                                                                                                  | type                                   |
| ------------ | ----------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| setOptions   | Update configuration, parameters need to refer to the corresponding component[Configuration](Configuration) | `(newOption: Partial<Option>) => void` |
| getOptions   | Get current[Configuration](Configuration)                                                                   | `() => Option`                         |
| show         | display component                                                                                           | `() => void`                           |
| hide         | Hidden component                                                                                            | `() => void`                           |
| getContainer | Get the information corresponding to the current control`DOM`container                                      | `() => HTMLElement`                    |


## event

| name             | illustrate                                   | type                              |
| ---------------- | -------------------------------------------- | --------------------------------- |
| fullscreenChange | Triggered when the full screen state changes | `(isFullscreen: boolean) => void` |

| Name   | Description                            | Type             |
| ------ | -------------------------------------- | ---------------- |
| add    | Event when component is added          | `(this) => void` |
| remove | Event when component is removed        | `(this) => void` |
| show   | Events when the component is displayed | `(this) => void` |
| hide   | Event when component is hidden         | `(this) => void` |
