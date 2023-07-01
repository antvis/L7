---
title: Style
order: 8
---

<embed src="@/docs/common/style.md"></embed>

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

### line

`shape` 为 `line` 的普通线图层。

- [line](/api/line_layer/shape#shapeline)
- [支持渐变](/api/line_layer/style#linear)
- [支持纹理](/api/line_layer/style#texture)
- [支持虚线](/api/line_layer/style#dash)
- [支持箭头](/api/line_layer/style#arrow)

| style         | 类型                       | 描述                       | 默认值      |
| ------------- | -------------------------- | -------------------------- | ----------- |
| borderColor   | `string`                   | 图形边框颜色               | `#fff`      |
| borderWidth   | `number`                   | 图形边框半径               | `0`         |
| blur          | `[number, number, number]` | 图形模糊分布               | `[1, 1, 1]` |
| raisingHeight | `number`                   | 抬升高度                   | `0`         |
| heightfixed   | `boolean`                  | 抬升高度是否随 `zoom` 变化 | `false`     |

### arc

`shape` 为 `arc` 平面的弧线。

- [arc](/api/line_layer/shape#shapearc)
- [支持渐变](/api/line_layer/style#linear)
- [支持纹理](/api/line_layer/style#texture)
- [支持虚线](/api/line_layer/style#dash)

| style         | 类型     | 描述                               | 默认值  |
| ------------- | -------- | ---------------------------------- | ------- |
| segmentNumber | `number` | 弧线分段，分段越多越平滑，消耗越大 | `30`    |
| thetaOffset   | `number` | 弧线的弧度参数                     | `0.314` |

### arc3d

`shape` 为 `arc3d` 的弧线图层。

- [arc3d](/api/line_layer/shape#shapearc3d)
- [支持渐变](/api/line_layer/style#linear)
- [支持纹理](/api/line_layer/style#texture)
- [支持虚线](/api/line_layer/style#dash)

| style         | 类型     | 描述                               | 默认值 |
| ------------- | -------- | ---------------------------------- | ------ |
| segmentNumber | `number` | 弧线分段，分段越多越平滑，消耗越大 | `30`   |

### greatcircle

`shape` 为大圆弧线图层。

- [greatcircle](/api/line_layer/shape#shapegreatcircle)
- [支持渐变](/api/line_layer/style#linear)
- [支持纹理](/api/line_layer/style#texture)
- [支持虚线](/api/line_layer/style#dash)

| style         | 类型     | 描述                               | 默认值 |
| ------------- | -------- | ---------------------------------- | ------ |
| segmentNumber | `number` | 弧线分段，分段越多越平滑，消耗越大 | `30`   |

### flowline

| style         | 类型     | 描述                               | 默认值 |
| ------------- | -------- | ---------------------------------- | ------ |
| opacity | `number` | 透明度，支持数据映射 | `1`   |
| strokeOpacity | `number` |描边透明度 | `30`   |
| stroke | `number` | 弧线分段，分段越多越平滑，消耗越大 | `#000`   |
| strokeWidth | `number` | 描边宽度 | `1`   |
| gapWidth | `number` | 不同方向两条线间距 | `2`   |
| offsets | `[number,number]` | 两端偏移量，支持数据映射 | `[0,0]`   |

flowline opacity 和 offsets 支持数据映射，数据驱动设置数据大小

#### opacity
```ts
layer.style({
  opacity: {
    field: 'count', // 映射字段
    value: [0.2,0.4,0.6,0.8], // 映射值,支持回调函数，支持设置scale
  }

// field 和 value  等同于 layer.color('count',[0.2,0.4,0.6,0.8])
```
#### offsets

```ts
layer.style({
  offsets:{
     field: 'count',
     values:() => {
      return [10 + Math.random()*20, 10 + Math.random()*20]
     }
})

```

### wall

`shape` 为 `wall` 地理围栏弧线图层。

- [wall](/api/line_layer/shape#shapewall)
- [支持渐变](/api/line_layer/style#linear)
- [支持纹理](/api/line_layer/style#texture)

### simple

`shape` 为 `simple` 简单线图层。

- [simple](/api/line_layer/shape#shapesimple)
- [支持渐变](/api/line_layer/style#linear)

### arrow

- [line](/api/line_layer/shape#shapeline)

线图层支持配置箭头，箭头有额外的样式。

```js
layer.style({
  arrow: {
    enable: true,
    arrowWidth: 2,
    arrowHeight: 3,
    tailWidth: 1,
  },
});
```

| style       | 类型           | 描述         | 默认值 |
| ----------- | -------------- | ------------ | ------ |
| arrow       | `IArrowOption` | 箭头的样式   | `/`    |
| arrowWidth  | `number`       | 箭头的宽度   | `2`    |
| arrowHeight | `number`       | 箭头的长度   | `3`    |
| tailWidth   | `number`       | 箭头尾部宽度 | `1`    |

### linear

- line、arc、arc3d、greatcircle、wall、simple

线图层支持配置渐变效果，在配置渐变效果后会覆盖 `layer.color` 方法设置的颜色。

| style       | 类型         | 描述       | 默认值     |
| ----------- | ------------ | ---------- | ---------- |
| sourceColor | `IColor`     | 线起始颜色 | `/`        |
| targetColor | `IColor`     | 线结尾颜色 | `/`        |
| linearDir   | `ILinearDir` | 线渐变方向 | `vertical` |

#### IColor

```js
const color = `rgb(200, 100, 50)`;
const color2 = '#ff0';
```

#### ILinearDir

- vertical 纵向（沿线方向）
- horizontal 横向

```js
type ILinearDir = 'vertical' | 'horizontal';
```

### texture

- line、arc、arc3d、greatcircle

线图层支持纹理以及纹理动画，纹理样式有自己的参数。

| style        | 类型            | 描述                           | 默认值   |
| ------------ | --------------- | ------------------------------ | -------- |
| lineTexture  | `boolean`       | 时候开启纹理能力               | `false`  |
| textureBlend | `ITextureBlend` | 纹理混合方式                   | `normal` |
| iconStep     | `number`        | 纹理贴图在线图层上面排布的间隔 | `100`    |

#### ITextureBlend

线图层的纹理在和线本身的颜色进行融合的时候支持两种，`normal` 和 `replace`。

- normal 纹理和线颜色混合
- replace 使用纹理替换线颜色

```js
type ITextureBlend = 'normal' | 'replace';
```

#### texture advance

✨ animate  
当线图层 (shape 为 arc/arc3d) 开启动画模式的时候，纹理在线图层上的分布还会和 animate 的参数相关

线图层上排列的纹理的数量大致为 duration/interval

```javascript
.animate({
    duration: 1,
    interval: 0.2,
    trailLength: 0.1
});

// 此时 纹理贴图数量为  duration / interval = 5
```

✨ textureBlend 参数  
通过控制 style 方法中的 textureBlend 参数，我们可以控制纹理图层和线图层的混合情况

- normal
- replace

```javascript
.style({
    lineTexture: true, // 开启线的贴图功能
    iconStep: 30, // 设置贴图纹理的间距
    textureBlend: 'replace', // 设置纹理混合方式，默认值为 normal，可选值有 normal/replace 两种
  });

```

### dash

- line、arc、arc3d、greatcircle

线图层支持配置虚线，虚线有自己额外的样式参数。

```js
layer.style({
    lineType: 'dash'
    dashArray: [5, 5]
})
```

| style     | 类型         | 描述       | 默认值  |
| --------- | ------------ | ---------- | ------- |
| lineType  | `ILineType`  | 线的类别   | `solid` |
| dashArray | `IDashArray` | 虚线的间隔 | `/`     |

#### ILineType

- solid 实线
- dash 虚线

#### IDashArray

`dashArray` 只有在 `ILineType` 为 `solid` 的时候才会生效。

```js
// len1 实线长度 len2 间隔长度
type IDashArray = [len1: number, len2: number]
```
