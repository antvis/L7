---
title: Shape
order: 3
---

<embed src="@/docs/common/style.md"></embed>

`shape` 方法用于指定点图层绘制什么样的图形，如绘制三角形或者是正方形，还是文字、图标之类的。

### shape(fillShape: IFillShape)

点图层的贴地的几何图形，如圆形、正方形、三角形等。

🌟 若是使用简单的圆点图层，建议使用 `simple` 代替 `circle` 以获得更好的性能。

<div>
  <div style="width:40%;float:right; margin-left: 16px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*iN0nTYRDd3AAAAAAAAAAAABkARQnAQ'>
  </div>
</div>

```js
// shape 支持的各种形状
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

点的类型为垂直地图的柱子。

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

`simple` 点精灵是特殊的点图层，始终面向相机，且大小受到设备的限制。

```js
layer.shape('simple');
```

### shape('dot')

`dot` 点精灵是特殊的点图层，始终面向相机，且大小受到设备的限制。

```js
layer.shape('dot');
```

### shape(field: string, 'text')

绘制文字，第一个参数为数值中的字段，第二个参数固定为 `text`。

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

`shape` 的值为 `scene.addImage` 全局添加的图片资源的名称。

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

🌟 雷达图需要设置 `animate` 为 `true`
