---
title: ExportImage
order: 7
---

Take a screenshot of the current map part and generate a picture`Base64`String.

<img src="https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*Yc78QZaeJWkAAAAAAAAAAAAAARQnAQ" width="400"/>

## illustrate

[Example](/examples/component/control#exportimage)

The captured targets when taking screenshots only include:

- map base map
- Layers (excluding MarkerLayer)

**Note: Since the current map base map corresponds to`Canvas`The buffer is enabled by default, so the basemap portion of the map cannot be captured by default.**

Therefore, if the developer needs the complete screenshot capability, the following parameters should be passed when initializing the map instance to turn it off.`Canvas`buffer.

```ts
new GaodeMapV2({
  WebGLParams: {
    preserveDrawingBuffer: true,
  },
});

new Mapbox({
  preserveDrawingBuffer: true,
});
```

## use

```ts
import { Scene, ExportImage } from '@antv/l7';

const scene = new Scene({
  id: 'map',
  map: new GaodeMapV2({
    // Close the map buffer, otherwise the map part cannot be captured when taking screenshots
    WebGLParams: {
      preserveDrawingBuffer: true,
    },
  }),
});

scene.on('loaded', () => {
  const zoom = new ExportImage({
    onExport: (base64: string) => {
      // download(base64)
    },
  });
  scene.addControl(zoom);
});
```

## Configuration

| name      | illustrate                                                                                                    | type                       |
| --------- | ------------------------------------------------------------------------------------------------------------- | -------------------------- |
| imageType | Screenshot image format                                                                                       | `'png'`\|`'jpeg'`          |
| onExport  | After the screenshot is successfully taken, it is used to receive the picture`Base64`String callback function | `(base64: string) => void` |

<embed src="@/docs/api/common/control/btn-api.zh.md"></embed>

<embed src="@/docs/api/common/control/api.zh.md"></embed>

## method

| name     | illustrate                              | type                    |
| -------- | --------------------------------------- | ----------------------- |
| getImage | Get the Base64 string of the screenshot | `() => Promise<string>` |

<embed src="@/docs/api/common/control/method.en.md"></embed>

## event

<embed src="@/docs/api/common/control/event.en.md"></embed>
