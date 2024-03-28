---
title: Symbol
order: 5
---

<embed src="@/docs/api/common/style.md"></embed>

The point layer supports drawing icons and placing different pictures as symbols on geographical areas, usually representing the distribution of different geographical features.

<div>
  <div style="width:60%;float:left; margin: 10px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*oVyHT5S3sv0AAAAAAAAAAABkARQnAQ'>
  </div>
</div>

### accomplish

Let's introduce how to draw a common symbol map.

- you can`L7`Found on the official website[Online case](/examples/point/image/#image)

```javascript
import { Scene, PointLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'light',
    center: [121.434765, 31.256735],
    zoom: 14.83,
  }),
});
scene.addImage(
  '00',
  'https://gw.alipayobjects.com/zos/basement_prod/604b5e7f-309e-40db-b95b-4fac746c5153.svg',
);
scene.addImage(
  '01',
  'https://gw.alipayobjects.com/zos/basement_prod/30580bc9-506f-4438-8c1a-744e082054ec.svg',
);
scene.addImage(
  '02',
  'https://gw.alipayobjects.com/zos/basement_prod/7aa1f460-9f9f-499f-afdf-13424aa26bbf.svg',
);
scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/basement_prod/893d1d5f-11d9-45f3-8322-ee9140d288ae.json')
    .then((res) => res.json())
    .then((data) => {
      const imageLayer = new PointLayer()
        .source(data, {
          parser: {
            type: 'json',
            x: 'longitude',
            y: 'latitude',
          },
        })
        .shape('name', ['00', '01', '02'])
        .size(25);
      scene.addLayer(imageLayer);
    });
});
```

### addImage(field: string, url: string): void

In order to draw an icon using a point layer, we need to`scene`Add corresponding image resources globally. Then we can click on the layer`shape`Specify the corresponding image in the method.

```js
scene.addImage(
  '02',
  'https://gw.alipayobjects.com/zos/basement_prod/7aa1f460-9f9f-499f-afdf-13424aa26bbf.svg',
);
```

### shape

we need to pass`shape`The method specifies the image resources that need to be loaded for the current point layer.`ID`，`ID`is used by users`scene.addImage(id, url)`When adding image resources globally`ID`, that is, the symbolic diagram needs to`shape`set as picture`id`。

```javascript
scene.addImage(
  '00',
  'https://gw.alipayobjects.com/zos/basement_prod/604b5e7f-309e-40db-b95b-4fac746c5153.svg',
);
scene.addImage(
  '01',
  'https://gw.alipayobjects.com/zos/basement_prod/604b5e7f-309e-40db-b95b-4fac746c5153.svg',
);

layer.shape('00');
```

⚠️ Symbol diagram`ID`It cannot be the same as the existing shape name of the point layer. For example, it cannot be set.`circle`。

Same symbol diagram`shape`Data mapping is also supported

```javascript
const scatter = new PointLayer()
  .source(data)
  .shape('name', (v) => {
    switch (v) {
      case 'p1':
        return '00';
      case 'p2':
        return '01';
    }
  })
  .size(5)
  .style({
    opacity: 0.3,
    strokeWidth: 1,
  });
```

⚠️ Symbol diagram should not be set`color`Pass in color,`color`The color you set will override the color of the image.

⚠️ In order to get a better realistic effect (the picture is clear and has no obvious aliasing), we should keep it consistent when selecting the picture and setting the icon size, or the icon size set in the L7 layer is slightly smaller than the pixel size of the actual picture.

[Online case](/examples/point/image#image)

### style

#### billboard

1. Pass by default`PointLayer`instantiated`image`It is essentially a sprite map, so it always faces the camera, and the size of the map is also limited by the device.
2. Since the sprite always faces the camera, we can't customize the configuration either`image`of rotation angle.

In order to solve the above two problems (1. Limited size, 2. Unable to customize the rotation angle), we provide a separate non-elf mode`billboard`mode.

Just configure billboard in style as`false`

```javascript
const imageLayer = new PointLayer({ layerType: 'fillImage' })
  .source(data, {
    parser: {
      type: 'json',
      x: 'longitude',
      y: 'latitude',
    },
  })
  .shape('name', ['00', '01', '02'])
  .style({
    rotation: 0,
    billboard: false,
  })
  .size(45);
```

##### rotation

We support using`rotation`Customize the rotation angle of the configuration icon (clockwise, angle system).

- `rotation`: number|undefined // Angle unit 0-360

```ts
layer.style({
  rotation: 90,
});
```

rotation supports constants and data mapping

```ts
layer.style({
  rotation: {
    field: 'rotate',
    value: [0, 360],
  },
});
```

```tsx
layer.style({
  rotation: {
    field: 'rotate',
    value: (rotate) => {
      return rotate;
    },
  },
});
```

<img width="60%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*1kBZTaains4AAAAAAAAAAAAAARQnAQ'>

[Online case](/examples/point/image#fillimage)

Non-billboard mode support for symbol graphs`rotation`Method maps rotation angle based on data.

```javascript
const imageLayer = new PointLayer()
  .source(data)
  .shape('wind', (wind) => {
    if (wind === 'up') {
      return 'arrBlue';
    }
    return 'arrRed';
  })
  .size(15)
  .style({
    rotation: 0, //
    billboard: false,
  });
scene.addLayer(imageLayer);
```

[Online case](/examples/point/image#monsoon)
