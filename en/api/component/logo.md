---
title: "Logo"
description: "Logo"
language: "en"
canonical: "https://l7.antv.antgroup.com/en/api/component/logo/"
---

[Resource index](/llms.txt)

A control used to display logo images on the map, and supports click-to-jump hyperlinks.

![](https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*CbdSRLizMLIAAAAAAAAAAAAAARQnAQ)

## illustrate

Currently, L7 will display this control in the lower left corner of the map by default. If it needs to be hidden, it can be configured when the Scene is instantiated:

```ts
import { Scene } from '@antv/l7';

const scene = new Scene({
  // ...

  // Close the default L7 Logo
  logoVisible: false,
});
```

## use

[Example](/en/examples/component/control/logo/)

```ts
import { Scene, Logo } from '@antv/l7';

const scene = new Scene({
  //...
  logoVisible: false,
});

scene.on('loaded', () => {
  const logo = new Logo({
    // 图片 url
    img: 'https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*GRb1TKp4HcMAAAAAAAAAAAAAARQnAQ',
    // 跳转地址
    href: 'https://l7.antv.antgroup.com',
  });
  scene.addControl(logo);
});
```

## Configuration

| name | illustrate                                                                                                           | type     |
| ---- | -------------------------------------------------------------------------------------------------------------------- | -------- |
| img  | Logo display image url                                                                                               | `string` |
| href | Click the logo to jump to the hyperlink. If it is not uploaded, the image will be displayed. Clicking will not jump. | `string` |

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
