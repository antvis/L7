---
title: LayerPopup
order: 1
---

LayerPopup is a bubble encapsulated based on Popup and is specifically used to display layer element information.

<img src="https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*HC6BT6v3YRIAAAAAAAAAAAAAARQnAQ" width="300"/>

## illustrate

LayerPopup is designed to allow developers to quickly generate bubbles for displaying layer information through configuration. Developers can pass in the layers that need to display information bubbles and the fields that need to be displayed.

LayerPopup will listen to the mouse events of the target layer by itself. When the user clicks/hoveres on an element of the target layer, the Popup will automatically open and display the field value of the element.

## use

[Example](/examples/component/popup#layerpopup)[Custom content examples](/zh/examples/component/popup/#customContent)

```ts
import { Scene, LayerPopup, PointLayer } from '@antv/l7';

const scene = new Scene({
  id: 'map',
  map: new GaodeMapV2({
    // ...
  }),
});

scene.on('loaded', () => {
  const pointLayer = new PointLayer();
  pointLayer.source(
    [
      {
        lng: 120,
        lat: 30,
        name: 'Test 1',
      },
    ],
    {
      parser: {
        type: 'json',
        x: 'lng',
        y: 'lat',
      },
    },
  );
  scene.addLayer(pointLayer);
  const layerPopup = new LayerPopup({
    items: [
      {
        layer: pointLayer,
        fields: [
          {
            field: 'name',
            formatValue: (name?: string) => name.trim() ?? '-',
          },
        ],
      },
    ],
    trigger: 'hover',
  });
  scene.addPopup(popup);
});
```

## Configuration

| name    | illustrate                                                                                                                                 | type                          | default value |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------- | ------------- |
| items   | The layer configuration array of Popup needs to be displayed, and each option type is visible[LayerPopupConfigItem](#layerpopupconfigitem) | `Array<LayerPopupConfigItem>` | `[]`          |
| trigger | How the mouse triggers Popup display                                                                                                       | `'hover' \| 'click'`          | `'hover'`     |

### LayerPopupConfigItem

| name          | illustrate                                                                                                                                                                                                     | type                                             |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| layer         | Need to display the Popup's target layer instance, or its`id`or`name`                                                                                                                                          | `BaseLayer`\|`string`                            |
| fields        | Array of fields that need to be displayed, supporting the incoming field key value string, or detailed configuration for the field[LayerField](#layerfield)                                                    | `string`\|`LayerField`                           |
| customContent | Custom bubble content supports two ways of directly passing in custom content or returning custom content through a callback function.`fields`Under coexistence, the configuration is read first and rendered. | `ElementType \| ((feature: any) => ElementType)` |
| title         | Custom bubble title supports two ways of directly passing in custom content or returning custom content through a callback function.                                                                           | `ElementType \| ((feature: any) => ElementType)` |

### LayerField

| name        | illustrate                         | type                                                            |
| ----------- | ---------------------------------- | --------------------------------------------------------------- |
| field       | The key value string of the field  | `string`                                                        |
| formatField | Format the displayed key field     | `ElementType \| ((field: string, feature: any) => ElementType)` |
| formatValue | Format the displayed value value   | `ElementType \| ((value: any, feature: any) => ElementType)`    |
| getValue    | Customize the way to get the value | `(feature: any) => any`                                         |

### ElementType

```ts
type ElementType = HTMLElement | HTMLElement[] | DocumentFragment | Text | string;
```

## method

| name       | illustrate                                               | type                                                                 |
| ---------- | -------------------------------------------------------- | -------------------------------------------------------------------- |
| getOptions | Get the current Popup configuration                      | `() => IPopupOption`                                                 |
| setOptions | Update current Popup configuration                       | `(newOption: Partial<IPopupOption>) => this`                         |
| show       | Show Popup                                               | `() => this`                                                         |
| hide       | Hide Popup                                               | `() => this`                                                         |
| setLngLat  | Set the latitude and longitude of the Popup anchor point | `(lngLat: { lng: number; lat: number } \| [number, number]) => this` |
| panToPopup | Pan the map to the current Popup location                | `() => this`                                                         |

## event

| name  | illustrate                        | type         |
| ----- | --------------------------------- | ------------ |
| open  | Fired when Popup is added         | `() => void` |
| close | Triggered when Popup is removed   | `() => void` |
| show  | Triggered when Popup is displayed | `() => void` |
| hide  | Triggered when Popup is hidden    | `() => void` |
