---
title: Shape
order: 3
---

`markdown:docs/common/style.md`

### shape

`shape` 枚举值

| shape          | 类型     | 描述                                                       |
| -------------- | -------- | ---------------------------------------------------------- |
| circle         | 圆形     | 贴地显示                                                   |
| triangle       | 三角形   | 贴地显示                                                   |
| square         | 正方形   | 贴地显示                                                   |
| pentagon       | 五边形   | 贴地显示                                                   |
| hexagon        | 六边形   | 贴地显示                                                   |
| octogon        | 八边形   | 贴地显示                                                   |
| hexagram       | 六角星形 | 贴地显示                                                   |
| rhombus        | 斜方形   | 贴地显示                                                   |
| vesica         | 椭圆形   | 贴地显示                                                   |
| cylinder       | 圆柱     | 3D 圆柱                                                    |
| triangleColumn | 三角柱   | 3D 三角柱                                                  |
| squareColumn   | 四角柱   | 3D 四角柱                                                  |
| hexagonColumn  | 六角柱   | 3D 六角柱                                                  |
| dot            | 点精灵   | 正方形，始终面向相机，最大尺寸受限                         |
| simple         | 圆形     | 始终面向相机，最大尺寸受限                                 |
| radar          | 雷达图   | 贴地显示                                                   |
| `iconName`     | 图标     | 点图层绘制图标，参数为 `scene.addImage` 全局添加的图片资源 |

`shape` 方法
使用 `shape` 方法来指定绘制 `text` 文字

#### text

`shape(field, ‘text’)` 绘制文字，第一个参数为数值中的字段，第二个参数固定为 `text`

#### icon

`shape(iconName)` 指定绘制图标名字（传入数据中的图标字段）  
`shape(iconName, () => ...)` 绘制图标，第一个参数为数值中的字段，第二个参数为回调函数，返回值为图标名字  
`shape(iconName, ['icon1', 'icon2', ...])` 绘制图标，第一个参数为数值中的字段，第二个参数映射的图标名字数组

#### 2D 符号图

<img width="60%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*iN0nTYRDd3AAAAAAAAAAAABkARQnAQ'>

```
'circle', 'square', 'hexagon', 'triangle'，  'pentagon',  'octogon', 'hexagram','rhombus',  'vesica',
```

```js
const point = new PointLayer().shape('circle');
```

🌟 若是使用简单的圆点图层，建议使用 simple 代替 circle 以获得更好的性能

#### 3D 柱图

<img width="60%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*tvpvQZLv_xYAAAAAAAAAAABkARQnAQ'>

```
'cylinder', 'triangleColumn', 'hexagonColumn', 'squareColumn'
```

```js
const point = new PointLayer().shape('cylinder');
```

#### 点精灵

```
'simple', 'dot',
```

```js
const point = new PointLayer().shape('simple');
```

#### 文字

```js
const point = new PointLayer()
  .source([{ lng: 120, lat: 30, name: 'test' }], {
    parser: 'json',
    x: 'lng',
    y: 'lat',
  })
  .shape('test', 'text');
```

#### 图标

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

#### 雷达图

```js
const layer = new PointLayer()
  .source(
    [
      {
        lng: 120,
        lat: 30,
        t: 'text1',
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

🌟 雷达图需要设置 animate 为 `true`
