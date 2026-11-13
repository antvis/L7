---
title: "Zoom"
description: "Zoom"
language: "en"
canonical: "https://l7.antv.antgroup.com/en/api/component/zoom/"
---

[Resource index](/llms.txt)

Used to control the map**enlarge**and**zoom out**control, and when the map reaches the maximum or minimum zoom ratio, the corresponding zoom button is disabled.

<img src="https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*CJx3Tby-XlEAAAAAAAAAAAAAARQnAQ" width="400"/>

## use

[Example](/en/examples/component/control/zoom/)

```ts
import { Scene, Zoom } from '@antv/l7';

const scene = new Scene({
  //...
});

scene.on('loaded', () => {
  const zoom = new Zoom({
    zoomInTitle: '放大',
    zoomOutTitle: '缩小',
  });
  scene.addControl(zoom);
});
```

## Configuration

| name         | illustrate                                                                              | type                |
| ------------ | --------------------------------------------------------------------------------------- | ------------------- |
| zoomInText   | Enlarge button display content                                                          | `Element`\|`string` |
| zoomInTitle  | magnify button`title`Attributes                                                         | `string`            |
| zoomOutText  | Reduce button display content                                                           | `Element`\|`string` |
| zoomOutTitle | shrink button`title`Attributes                                                          | `string`            |
| showZoom     | Whether to display the current real-time zoom value of the map, rounded down by default | `boolean`           |

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

| name    | illustrate     | type         |
| ------- | -------------- | ------------ |
| zoomIn  | Enlarge map    | `() => void` |
| zoomOut | Reduce basemap | `() => void` |

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
