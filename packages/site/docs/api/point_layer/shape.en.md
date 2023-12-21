---
title: Shape
order: 3
---

<embed src="@/docs/api/common/style.md"></embed>

`shape`The method is used to specify what kind of graphics the point layer draws, such as drawing triangles or squares, text, icons, etc.

### shape(fillShape: IFillShape)

Point layer's ground-mounted geometric shapes, such as circles, squares, triangles, etc.

🌟 If you are using a simple dot layer, it is recommended to use`simple`replace`circle`for better performance.

<div>
  <div style="width:40%;float:right; margin-left: 16px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*iN0nTYRDd3AAAAAAAAAAAABkARQnAQ'>
  </div>
</div>

```js
// Various shapes supported by shape
type IFillShape =
  | 'circle'
  | 'square'
  | 'hexagon'
  | 'triangle'
  | 'pentagon'
  | 'octogon'
  | 'hexagram'
  | 'rhombus'
  | 'vesica';

layer.shape('circle');
```

### shape(column: IColumn)

The point type is a vertical map pillar.

<div>
  <div style="width:40%;float:right; margin-left: 16px;">
    <img width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*tvpvQZLv_xYAAAAAAAAAAABkARQnAQ'>
  </div>
</div>

```js
type IColumn = 'cylinder' | 'triangleColumn' | 'hexagonColumn' | 'squareColumn';

layer.shape('cylinder');

layer.shape('triangleColumn');

layer.shape('hexagonColumn');

layer.shape('squareColumn');
```

### shape('simple')

`simple`Point sprites are special point layers that always face the camera and are limited in size by the device.

```js
layer.shape('simple');
```

### shape('dot')

`dot`Point sprites are special point layers that always face the camera and are limited in size by the device.

```js
layer.shape('dot');
```

### shape(field: string, 'text')

To draw text, the first parameter is the field in the value, and the second parameter is fixed to`text`。

```js
const point = new PointLayer()
  .source([{ lng: 120, lat: 30, name: 'test' }], {
    parser: 'json',
    x: 'lng',
    y: 'lat',
  })
  .shape('test', 'text');
```

### shape(iconName: string)

`shape`The value is`scene.addImage`The name of the globally added image resource.

```js
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
const imageLayer = new PointLayer()
  .source(
    [
      {
        longitude: 120,
        latitude: 30,
        name: 'name',
      },
    ],
    {
      parser: {
        type: 'json',
        x: 'longitude',
        y: 'latitude',
      },
    },
  )
  .shape('name', ['00', '01', '02']) // shape 支持映射写法
  .size(25);
scene.addLayer(imageLayer);

const imageLayer2 = new PointLayer()
  .source(
    [
      {
        longitude: 122,
        latitude: 30,
        name: 'name',
      },
    ],
    {
      parser: {
        type: 'json',
        x: 'longitude',
        y: 'latitude',
      },
    },
  )
  .shape('00') // shape 直接传值
  .size(25);
scene.addLayer(imageLayer2);
```

### shape('radar')

```js
const layer = new PointLayer()
  .source(
    [
      {
        lng: 120,
        lat: 30,
      },
    ],
    {
      parser: {
        type: 'json',
        x: 'lng',
        y: 'lat',
      },
    },
  )
  .size(25)
  .color('#f00')
  .shape('radar')
  .animate(true);
```

🌟 Radar chart needs to be set up`animate`for`true`
