---
title: Style
order: 4
---

<embed src="@/docs/api/common/style.md"></embed>

`style`The method is used to configure the style of the layer. The same layer has different`shape`graphics, different`shape`layer`style`Methods accept different parameters.

```js
layer.style({
  opacity: 0.5,
});
```

### common

Universal`style`Parameters, parameters supported by all graphics.

| style   | type     | describe             | default value |
| ------- | -------- | -------------------- | ------------- |
| opacity | `number` | Graphic transparency | `1`           |

<embed src="@/docs/api/common/layer/style_encode.en.md"></embed>

### 2D shape

`shape`For plane figures, such as triangles, squares, etc.

- [IFillShape](/api/point_layer/shape#shapefillshape-ifillshape)

| style         | type               | Whether to support data mapping | describe                    | default value |
| ------------- | ------------------ | ------------------------------- | --------------------------- | ------------- |
| stroke        | `string`           | yes                             | Graphic border color        | `#fff`        |
| strokeWidth   | `number`           | no                              | Graphic border width        | `0`           |
| strokeOpacity | `number`           | no                              | Graphic border transparency | `1`           |
| blur          | `number`           | no                              | Graphic blur radius         | `0`           |
| offsets       | `[number, number]` | yes                             | point offset                | `[0, 0]`      |
| rotation      | `number`           | yes                             | Rotation angle              | `0`           |
| raisingHeight | `number`           | no                              | Lifting height              | `0`           |
| heightfixed   | `boolean`          | no                              | Point size unit             | `pixel`       |

#### unit

- pixel default value
- meter unit is meter

```js
type IUnit = 'pixel' | 'meter';
```

The point layer supports equal-area points. The unit of point size is meters. The size is also set through the size method.

```javascript
import { PointLayer } from '@antv/l7';

const layer = PointLayer().source(data).shape('circle').size(100).color('#f00').style({
  unit: 'meter',
});
```

🌟 Starting from version v2.7.9, AMap, AMap 2.0, and Mapbox maps are supported

### 3D column

`shape`is a 3D column chart.

- [IColumn](/api/point_layer/shape#shapecolumn-icolumn)

| style       | type      | describe                                              | default value |
| ----------- | --------- | ----------------------------------------------------- | ------------- |
| depth       | `boolean` | Whether depth detection is enabled for graphics       | `true`        |
| pickLight   | `boolean` | Whether to calculate lighting when picking highlights | `false`       |
| lightEnable | `boolean` | Whether color participates in lighting calculations   | `true`        |
| heightfixed | `boolean` | Is it a fixed height?                                 | `false`       |

### 3D column linear

The column chart supports configuring gradient colors, which will be overwritten after configuring the gradient effect.`layer.color`Method to set the color.

| style         | type            | describe                         | default value |
| ------------- | --------------- | -------------------------------- | ------------- |
| sourceColor   | `color`         | Column bottom color              | `/`           |
| targetColor   | `color`         | Column top color                 | `/`           |
| opacityLinear | `IOpcityLinear` | Transparency gradient of pillars | `/`           |

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

`shape`for text.

- [text](/api/point_layer/shape#shapefield-string-text)

| style            | type                                            | describe                                   | Whether to support data mapping | default value |
| ---------------- | ----------------------------------------------- | ------------------------------------------ | ------------------------------- | ------------- |
| opacity          | `number`                                        | transparency                               | yes                             | `#fff`        |
| stroke           | `string`                                        | Graphic border color                       | yes                             | `#fff`        |
| strokeWidth      | `number`                                        | Graphic border color                       | no                              | `0`           |
| textOffset       | `[number, number]`                              | text offset                                | yes                             | `[0, 0]`      |
| textAnchor       | [anchorType](/api/point_layer/style#anchortype) | text alignment anchor`text`                | yes                             | `center`      |
| spacing          | `number`                                        | text spacing                               | no                              | `2`           |
| rotation         | `number`                                        | Rotation angle                             | yes                             | `0`           |
| padding          | `number`                                        | Text inner border width                    | no                              | `2`           |
| halo             | `number`                                        | Text edge glow width                       | no                              | `0.5`         |
| gamma            | `number`                                        | Text color parameters                      | no                              | `2`           |
| fontWeight       | `string`                                        | text size                                  | no                              | `400`         |
| fontFamily       | [font](/api/point_layer/style#font)             | font                                       | no                              | `sans-serif`  |
| textAllowOverlap | `boolean`                                       | Whether text is allowed to be overwritten  | no                              | `false`       |
| raisingHeight    | `number`                                        | Lifting height                             | no                              | `0`           |
| heightfixed      | `boolean`                                       | Does the lifting height vary?`zoom`Variety | no                              | `false`       |

#### anchorType

text alignment anchor

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

css font Family。

```js
const font = 'sans-serif';
const font2 = 'Times New Roman';
```

### simple

`shape`For simple point graphics (elves).

- [simple](/api/point_layer/shape#shapesimple)

| style         | type               | describe             | default value |
| ------------- | ------------------ | -------------------- | ------------- |
| stroke        | `string`           | Graphic border color | `#fff`        |
| strokeWidth   | `number`           | Graphic border color | `0`           |
| strokeOpacity | `number`           | Graphic border width | `1`           |
| offsets       | `[number, number]` | point offset         | `[0, 0]`      |

### icon

`shape`is the icon type.

- [icon](/api/point_layer/shape#shapeiconname-string)

| style         | type               | describe                                   | data mapping | default value |
| ------------- | ------------------ | ------------------------------------------ | ------------ | ------------- |
| offsets       | `[number, number]` | point offset                               | no           | `[0, 0]`      |
| raisingHeight | `number`           | Lifting height                             | no           | `0`           |
| heightfixed   | `boolean`          | Does the lifting height vary?`zoom`Variety | no           | `false`       |
| rotation      | `number`           | Rotation angle                             | yes          | `0`           |

#### rotation

The rotation angle of the icon.

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

### radar

`shape`is a radar chart.

- [radar](/api/point_layer/shape#shaperadar)

| style | type     | describe                                   | default value |
| ----- | -------- | ------------------------------------------ | ------------- |
| speed | `number` | The speed at which the radar chart rotates | `1`           |
