---
title: Style
order: 4
---

`markdown:docs/common/style.md`

`style` 方法用于配制图层的样式，不同的图形之间存在不同的 `style` 参数。
```js
layer.style({
  opacity: 0.5
})
```

#### common style
通用 `style` 参数，所有图形都支持的参数。

| style            | 类型               | 描述 & 生效图层                      | 默认值   |
| ---------------- | ----------------- | ---------------------------------- | -------- |
| opacity          | `number`           | 图形的透明度                         | `1`     |


### 2D symbol style

平面 2D 图形、如三角形、正方形等支持的样式。

| style            | 类型               | 描述 & 生效图层                      | 默认值   |
| ---------------- | ----------------- | ---------------------------------- | -------- |
| stroke           | `string`          | 图形边框颜色                         | `#fff`   |
| strokeWidth      | `number`          | 图形边框颜色                         | `0`      |
| strokeOpacity    | `number`          | 图形边框宽度                         | `1`      |
| blur             | `number`           | 图形模糊半径                        | `0`      |
| offsets          | `[number, number]`| 点偏移                              | `[0, 0]` |
| raisingHeight    | `number` | 抬升高度                                      | `0` |
| unit             | `string` | 点大小单位                                    | `l7size` |


#### unit

- l7size 默认值
- meter 单位为米
```js
type IUnit = 'l7size' | 'meter';
```

### 3D column style

3D 柱图支持的样式。

| style            | 类型               | 描述 & 生效图层                      | 默认值   |
| ---------------- | ----------------- | ---------------------------------- | -------- |
| depth            | `boolean`         | 图形是否开启深度检测                  |  `true`  |
| pickLight        | `boolean`         | 拾取高亮是否计算光照                  | `false`  |
| sourceColor      | `color`           | 柱子底部颜色                         | `/`     |
| targetColor      | `color`           | 柱子顶部                            | `/`      |
| opacityLinear    | `IOpcityLinear`   | 柱子的透明度渐变                      | `/`      |
| lightEnable      | `boolean`         | 颜色是否参与光照计算                   | `true`   |

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

### text style

文字图形支持的样式。

| style            | 类型               | 描述 & 生效图层                      | 默认值   |
| ---------------- | ----------------- | ---------------------------------- | -------- |
| stroke           | `string`          | 图形边框颜色                         | `#fff`   |
| strokeWidth      | `number`          | 图形边框颜色                         | `0`      |
| textOffset       | `[number, number]` | 文字的偏移                          | `[0, 0]` |
| textAnchor       | [anchorType](/zh/docs/api/point_layer/style#anchortype) | 文字对齐锚点 `text` | `center` |
| spacing          | `number` | 文字间隔                                      | `2`  |
| padding          | `number` | 文字内边框宽度                                 | `2` |
| halo             | `number` | 文字边缘光晕宽度                               | `0.5` |
| gamma            | `number` | 文字的颜色参数                                 | `2` |
| fontWeight       | `string` | 文字的大小                                     | `400` |
| fontFamily       | [font](/zh/docs/api/point_layer/style#font) | 字体        | `sans-serif` |
| textAllowOverlap | `boolean`| 文字是否允许覆盖                                | `false` |
| raisingHeight    | `number` | 抬升高度                                         | `0` |
| heightfixed      | `boolean`         | 抬升高度是否随 `zoom` 变化             | `0` |

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

### simple style

简单点图形（精灵）支持的样式。

| style            | 类型               | 描述 & 生效图层                      | 默认值   |
| ---------------- | ----------------- | ---------------------------------- | -------- |
| stroke           | `string`          | 图形边框颜色                         | `#fff`   |
| strokeWidth      | `number`          | 图形边框颜色                         | `0`      |
| strokeOpacity    | `number`          | 图形边框宽度                         | `1`      |
| offsets          | `[number, number]`| 点偏移                              | `[0, 0]` |

### icon style

[图标的样式](/zh/docs/api/point_layer/shape#图标)

| style            | 类型               | 描述 & 生效图层                      | 默认值   |
| ---------------- | ----------------- | ---------------------------------- | -------- |
| offsets          | `[number, number]`| 点偏移                              | `[0, 0]` |
| raisingHeight    | `number`          | 抬升高度                             | `0`      |
| heightfixed      | `boolean`         | 抬升高度是否随 `zoom` 变化            | `0`      |
| rotation         | `number`          | 图标的偏移                           | `0` |


### radar style

雷达图支持的样式。

| style            | 类型               | 描述 & 生效图层                      | 默认值   |
| ---------------- | ----------------- | ---------------------------------- | -------- |
| speed            | `number`          | 雷达图旋转的速度                      | `1`      |


#### font

css fontFamily。

```js
const font = 'sans-serif';
const font2 = 'Times New Roman';
```

#### rotation

图标的旋转角度。

```js
const imageLayer = new PointLayer({layerType: 'fillImage'})
  .source(data)
  .shape('wind', wind => {
    if (wind === 'up') {
      return 'arrBlue';
    }
    return 'arrRed';

  })
  .rotate('r', r => Math.PI * r)
  .size(15)
  .style({
    rotation: 0,
    
  });
```