---
title: MapTheme
order: 11
---

This control is used to switch the theme style of the map basemap.

<img src="https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*xb29TawbZDgAAAAAAAAAAAAAARQnAQ" width="400"/>

## illustrate

MapTheme will display the corresponding default theme options by default based on the current map basemap type (such as Mapbox, GaodeMapV2), and you can also pass in custom theme options.

## use

[Example](/examples/component/control#maptheme)

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

<embed src="@/docs/api/common/control/popper-api.zh.md"></embed>

<embed src="@/docs/api/common/control/btn-api.en.md"></embed>

<embed src="@/docs/api/common/control/api.en.md"></embed>

## method

<embed src="@/docs/api/common/control/method.en.md"></embed>

## event

<embed src="@/docs/api/common/control/event.en.md"></embed>

<embed src="@/docs/api/common/control/popper-event.en.md"></embed>

<embed src="@/docs/api/common/control/select-event.en.md"></embed>
