---
title: "GeoLocate"
description: "GeoLocate"
language: "en"
canonical: "https://l7.antv.antgroup.com/en/api/component/geolocate/"
---

[Resource index](/llms.txt)

using browser environment`nagigator`of`getlocation`Method, use the browser to turn on the location sensing capability to obtain the longitude and latitude of the current user.

<img src="https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*BOsBRJyYeMEAAAAAAAAAAAAAARQnAQ" width="400"/>

## illustrate

[Example](/en/examples/component/control/geolocate/)

**Notice:**

- When using this capability, the user will be required to authenticate the browser to enable location awareness.
- The coordinates currently obtained by the browser are`WGS84`The geographical coordinate system will be biased when used on the Gaode map, so it can be used`transform`Configure the coordinate system conversion.

## use

```ts
import { Scene, GeoLocate } from '@antv/l7';
import gcoord from 'gcoord';

const scene = new Scene({
  // ...
});

scene.on('loaded', () => {
  const geoLocate = new GeoLocate({
    transform: (position) => {
      //Convert the coordinates obtained based on the WGS84 geographical coordinate system into the GCJ02 coordinate system
      return gcoord.transform(position, gcoord.WGS84, gcoord.GCJ02);
    },
  });
  scene.addControl(geoLocate);
});
```

## Configuration

| name      | illustrate                                                                                                                              | type                                               |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| transform | Format passed`getlocation`The function of the obtained longitude and latitude can be used to convert the geographical coordinate system | `(position: [number, number]) => [number, number]` |

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

| name           | illustrate                                                    | type                              |
| -------------- | ------------------------------------------------------------- | --------------------------------- |
| getGeoLocation | Get the latitude and longitude of the current user's location | `() => Promise<[number, number]>` |

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
