---
title: Style
order: 4
---

<embed src="@/docs/api/common/style.md"></embed>

`style` 方法用于配制图层的样式，相同图层拥有不同的 `shape` 图形，不同 `shape` 的图层 `style` 方法接受不同的参数。

```js
layer.style({
  opacity: 0.5,
});
```

### common

通用 `style` 参数，所有图形都支持的参数。

| style   | 类型     | 描述         | 默认值 |
| ------- | -------- | ------------ | ------ |
| opacity | `number` | 图形的透明度 | `1`    |

<embed src="@/docs/api/common/layer/style_encode.zh.md"></embed>

### 2D shape

`shape` 为平面图形、如三角形、正方等。

- [IFillShape](/api/point_layer/shape#shapefillshape-ifillshape)

| style         | 类型               | 是否支持数据映射 | 描述           | 默认值   |
| ------------- | ------------------ | ---------------- | -------------- | -------- |
| stroke        | `string`           | 是               | 图形边框颜色   | `#fff`   |
| strokeWidth   | `number`           | 否               | 图形边框宽度   | `0`      |
| strokeOpacity | `number`           | 否               | 图形边框透明度 | `1`      |
| blur          | `number`           | 否               | 图形模糊半径   | `0`      |
| offsets       | `[number, number]` | 是               | 点偏移         | `[0, 0]` |
| rotation      | `number`           | 是               | 旋转角度       | `0`      |
| raisingHeight | `number`           | 否               | 抬升高度       | `0`      |
| heightfixed   | `boolean`          | 否               | 点大小单位     | `pixel`  |

#### unit

- pixel 默认值
- meter 单位为米

```js
type IUnit = 'pixel' | 'meter';
```

点图层支持等面积点，点大小的单位是米，同样通过 size 方法设置大小

```javascript
import { PointLayer } from '@antv/l7';

const layer = PointLayer().source(data).shape('circle').size(100).color('#f00').style({
  unit: 'meter',
});
```

🌟 从 v2.7.9 版本开始支持高德地图、高德地图 2.0、Mapbox 地图

### 3D column

`shape` 为 3D 柱图。

- [IColumn](/api/point_layer/shape#shapecolumn-icolumn)

| style       | 类型      | 描述                 | 默认值  |
| ----------- | --------- | -------------------- | ------- |
| depth       | `boolean` | 图形是否开启深度检测 | `true`  |
| pickLight   | `boolean` | 拾取高亮是否计算光照 | `false` |
| lightEnable | `boolean` | 颜色是否参与光照计算 | `true`  |
| heightfixed | `boolean` | 是否是固定高度       | `false` |

### 3D column linear

柱图支持配置渐变色，在配置渐变效果后会覆盖 `layer.color` 方法设置的颜色。

| style         | 类型            | 描述             | 默认值 |
| ------------- | --------------- | ---------------- | ------ |
| sourceColor   | `color`         | 柱子底部颜色     | `/`    |
| targetColor   | `color`         | 柱子顶部颜色     | `/`    |
| opacityLinear | `IOpcityLinear` | 柱子的透明度渐变 | `/`    |

#### color

```js
const color = `rgb(200, 100, 50)`;
const color2 = '#ff0';
```

#### opacityLinear

```js
type IDir = 'up' | 'down';
interface IOpcityLinear = {
  enable: boolean;
  dir: IDir;
}
```

### text

`shape` 为文字。

- [text](/api/point_layer/shape#shapefield-string-text)

| style            | 类型                                            | 描述                       | 是否支持数据映射 | 默认值       |
| ---------------- | ----------------------------------------------- | -------------------------- | ---------------- | ------------ |
| opacity          | `number`                                        | 透明度                     | 是               | `#fff`       |
| stroke           | `string`                                        | 图形边框颜色               | 是               | `#fff`       |
| strokeWidth      | `number`                                        | 图形边框颜色               | 否               | `0`          |
| textOffset       | `[number, number]`                              | 文字的偏移                 | 是               | `[0, 0]`     |
| textAnchor       | [anchorType](/api/point_layer/style#anchortype) | 文字对齐锚点 `text`        | 是               | `center`     |
| spacing          | `number`                                        | 文字间隔                   | 否               | `2`          |
| rotation         | `number`                                        | 旋转角度                   | 是               | `0`          |
| padding          | `number`                                        | 文字内边框宽度             | 否               | `2`          |
| halo             | `number`                                        | 文字边缘光晕宽度           | 否               | `0.5`        |
| gamma            | `number`                                        | 文字的颜色参数             | 否               | `2`          |
| fontWeight       | `string`                                        | 文字的大小                 | 否               | `400`        |
| fontFamily       | [font](/api/point_layer/style#font)             | 字体                       | 否               | `sans-serif` |
| textAllowOverlap | `boolean`                                       | 文字是否允许覆盖           | 否               | `false`      |
| raisingHeight    | `number`                                        | 抬升高度                   | 否               | `0`          |
| heightfixed      | `boolean`                                       | 抬升高度是否随 `zoom` 变化 | 否               | `false`      |

#### anchorType

文字对齐锚点

```javascript
export enum anchorType {
  'CENTER' = 'center',
  'TOP' = 'top',
  'TOP-LEFT' = 'top-left',
  'TOP-RIGHT' = 'top-right',
  'BOTTOM' = 'bottom',
  'BOTTOM-LEFT' = 'bottom-left',
  'LEFT' = 'left',
  'RIGHT' = 'right',
}
```

#### font

css fontFamily。

```js
const font = 'sans-serif';
const font2 = 'Times New Roman';
```

### simple

`shape` 为简单点图形（精灵)。

- [simple](/api/point_layer/shape#shapesimple)

| style         | 类型               | 描述         | 默认值   |
| ------------- | ------------------ | ------------ | -------- |
| stroke        | `string`           | 图形边框颜色 | `#fff`   |
| strokeWidth   | `number`           | 图形边框颜色 | `0`      |
| strokeOpacity | `number`           | 图形边框宽度 | `1`      |
| offsets       | `[number, number]` | 点偏移       | `[0, 0]` |

### icon

`shape` 为图标类型。

- [icon](/api/point_layer/shape#shapeiconname-string)

| style         | 类型               | 描述                                                                       | 数据映射 | 默认值   |
| ------------- | ------------------ | -------------------------------------------------------------------------- | -------- | -------- |
| offsets       | `[number, number]` | 点偏移                                                                     | 否       | `[0, 0]` |
| raisingHeight | `number`           | 抬升高度                                                                   | 否       | `0`      |
| heightfixed   | `boolean`          | 抬升高度是否随 `zoom` 变化                                                 | 否       | `false`  |
| rotation      | `number`           | 旋转角度                                                                   | 是       | `0`      |
| allowOverlap  | `boolean`          | 图标是否允许压盖，`false` 时开启碰撞避让自动隐藏重叠图标                   | 否       | `true`   |
| padding       | `[number, number]` | 碰撞检测包围盒的额外边距 `[水平, 垂直]`，仅在 `allowOverlap: false` 时生效 | 否       | `[0, 0]` |

#### rotation

图标的旋转角度。

```js
const imageLayer = new PointLayer({ layerType: 'fillImage' })
  .source(data)
  .shape('wind', (wind) => {
    if (wind === 'up') {
      return 'arrBlue';
    }
    return 'arrRed';
  })
  .size(15)
  .style({
    rotation: 0,
  });
```

#### allowOverlap

控制图标在屏幕上是否允许相互压盖。设置为 `false` 时，L7 会在每次地图缩放或平移后对所有图标执行碰撞检测，自动隐藏与已放置图标重叠的图标，效果与 `textAllowOverlap` 一致。

```js
const imageLayer = new PointLayer()
  .source(data, { parser: { type: 'json', x: 'lng', y: 'lat' } })
  .shape('icon')
  .size(15)
  .style({
    allowOverlap: false, // 开启碰撞避让
    padding: [4, 4], // 图标之间保留 4px 间距
  });
```

### radar

`shape` 为雷达图。

- [radar](/api/point_layer/shape#shaperadar)

| style | 类型     | 描述             | 默认值 |
| ----- | -------- | ---------------- | ------ |
| speed | `number` | 雷达图旋转的速度 | `1`    |
