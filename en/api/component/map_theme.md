---
title: "MapTheme"
description: "MapTheme"
language: "en"
canonical: "https://l7.antv.antgroup.com/en/api/component/map_theme/"
---

[Resource index](/llms.txt)

This control is used to switch the theme style of the map basemap.

<img src="https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*xb29TawbZDgAAAAAAAAAAAAAARQnAQ" width="400"/>

## illustrate

MapTheme will display the corresponding default theme options by default based on the current map basemap type (such as Mapbox, GaodeMapV2), and you can also pass in custom theme options.

## use

[Example](/en/examples/component/control/maptheme/)

```ts
import { Scene, MapTheme } from '@antv/l7';

const scene = new Scene({
  // ...
});

scene.on('loaded', () => {
  const mapTheme = new MapTheme({});
  scene.addControl(mapTheme);
});
```

## Configuration

| name    | illustrate                                                                                                  | type                        |
| ------- | ----------------------------------------------------------------------------------------------------------- | --------------------------- |
| options | User-defined map theme options, the type of each option is visible[IControlOptionItem](#icontroloptionitem) | `Array<IControlOptionItem>` |

## IControlOptionItem

```ts
export type IControlOptionItem = {
  //The text corresponding to the theme option
  text: string;
  //The theme option corresponds to the key value of the map theme style
  value: string;
  //Theme options correspond to the pictures displayed
  img?: string;
};
```

| 名称            | 说明                 | 类型                                |
| --------------- | -------------------- | ----------------------------------- |
| popperPlacement | 气泡相对于按钮的位置 | [PopperPlacement](#PopperPlacement) |
| popperTrigger   | 气泡弹出的触发方式   | `'click'` \| `'hover'`              |
| popperClassName | 气泡容器自定义样式名 | `string`                            |

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
