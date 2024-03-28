---
title: Popup
order: 0
---

Popup is a bubble used to specify the latitude and longitude location on the map and display customized content.

<img src="https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*N2hWTq-m-8EAAAAAAAAAAAAAARQnAQ" width="300"/>

## illustrate

The anchor point position of Popup is expressed by longitude and latitude. When the map is zoomed/panned, Popup will automatically calculate the coordinates relative to the current map and automatically shift. In other words, if a developer needs to**Specify latitude and longitude location**To display information bubbles, you can consider using the Popup component to achieve the corresponding effect.

Developers can customize the main display content of Popup:

- Plain text can pass`text`configure or`setText`Method controls the Popup's display text.
- Custom DOM can be created via`html`configure or`setHTML`Method supports passing in HTML strings or DOM elements or arrays to control the display content of the Popup.

## use

[Example](/examples/component/popup#popup)

```ts
import { Scene, Popup } from '@antv/l7';

const scene = new Scene({
  id: 'map',
  map: new GaodeMapV2({
    // ...
  }),
});

scene.on('loaded', () => {
  const popup = new Popup({
    //Initial anchor point latitude and longitude
    lngLat: {
      lng: 120,
      lat: 30,
    },
    // Popup title
    title: 'Popup Title',
    // Popup content
    html: 'Popup Content',
  });
  scene.addPopup(popup);

  //Update Popup anchor point latitude and longitude
  popup.setLngLat({
    lng: 130,
    lat: 40,
  });

  //Update Popup content
  popup.setHTML('New Popup Content');
});
```

## Configuration

| name               | illustrate                                                                                                                 | type                           | default value |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------ | ------------- |
| lngLat             | The latitude and longitude where the Popup is located                                                                      | `{ lng: number; lat: number }` | -             |
| text               | Text content displayed by Popup content                                                                                    | `string`                       | -             |
| html               | Custom HTML for Popup content display, you can pass HTML string, DOM object or array                                       | [ElementType](#elementtype)    | -             |
| title              | Custom HTML displayed in the Popup title, you can pass HTML string, DOM object or array                                    | [ElementType](#elementtype)    | -             |
| closeOnClick       | Whether to close the current Popup when clicking on the map area                                                           | `boolean`                      | `false`       |
| closeOnEsc         | Whether to close the current Popup when clicking the Esc key                                                               | `boolean`                      | `false`       |
| maxWidth           | Popup's maximum width                                                                                                      | `string`                       | `240px`       |
| anchor             | The position of the Popup arrow can control the placement of the Popup relative to the latitude and longitude points.      | [AnchorType](#anchortype)      | `'bottom'`    |
| offsets            | Popup offset relative to anchor point                                                                                      | `[number, number]`             | `[0, 0]`      |
| autoPan            | When the Popup is displayed or its location changes, whether the map should automatically pan to the location of the Popup | `boolean`                      | `false`       |
| autoClose          | Whether to automatically close the current bubble when there are other Popups displayed                                    | `boolean`                      | `true`        |
| followCursor       | Whether Popup follows the cursor movement, if set to`true`,but`lngLat`Invalid configuration                                | `boolean`                      | `false`       |
| closeButton        | Whether to display the close Popup icon                                                                                    | `boolean`                      | `true`        |
| closeButtonOffsets | Turn off relative offset of Popup icons                                                                                    | `[number, number]`             | -             |
| stopPropagation    | Whether mouse events on Popup should be prevented from bubbling                                                            | `boolean`                      | `true`        |

### ElementType

```ts
type ElementType = HTMLElement | HTMLElement[] | DocumentFragment | Text | string;
```

### AnchorType

```ts
type AnchorType =
  | 'center'
  | 'top'
  | 'top-left'
  | 'top-right'
  | 'bottom'
  | 'bottom-left'
  | 'bottom-right'
  | 'left'
  | 'right';
```

## method

| name       | illustrate                                               | type                                                                 |
| ---------- | -------------------------------------------------------- | -------------------------------------------------------------------- |
| getOptions | Get the current Popup configuration                      | `() => IPopupOption`                                                 |
| setOptions | Update current Popup configuration                       | `(newOption: Partial<IPopupOption>) => this`                         |
| show       | Show Popup                                               | `() => this`                                                         |
| hide       | Hide Popup                                               | `() => this`                                                         |
| getIsShow  | Determine whether the current bubble is displayed        | `() => boolean`                                                      |
| setTitle   | Set the HTML displayed by the Popup title                | `(title: ElementType) => this`                                       |
| setHTML    | Set the HTML for Popup content display                   | `(html: ElementType) => this`                                        |
| setText    | Set the text displayed by Popup content                  | `(text: string) => this`                                             |
| setLngLat  | Set the latitude and longitude of the Popup anchor point | `(lngLat: { lng: number; lat: number } \| [number, number]) => this` |
| panToPopup | Pan the map to the current Popup location                | `() => this`                                                         |

## event

| name  | illustrate                        | type         |
| ----- | --------------------------------- | ------------ |
| open  | Fired when Popup is added         | `() => void` |
| close | Triggered when Popup is removed   | `() => void` |
| show  | Triggered when Popup is displayed | `() => void` |
| hide  | Triggered when Popup is hidden    | `() => void` |
