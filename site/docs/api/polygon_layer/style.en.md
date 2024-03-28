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

### fill

`shape`Fills the plane with geometry.

- [fill](/api/polygon_layer/shape#shapefill)

| style         | type             | describe             | default value |
| ------------- | ---------------- | -------------------- | ------------- |
| raisingHeight | `number`         | Lifting height       | `0`           |
| opacityLinear | `IOpacityLinear` | transparent gradient | `/`           |

#### opacityLinear

```js
type IDir = 'in' | 'out';

interface IOpacityLinear {
  enable: false;
  dir: IDir;
}
```

### extrude

`shape`for extruded geometry.

- [extrude](/api/polygon_layer/shape#shapeextrude)

| style         | type      | describe                                   | default value |
| ------------- | --------- | ------------------------------------------ | ------------- |
| raisingHeight | `number`  | Lifting height                             | `0`           |
| heightfixed   | `boolean` | Does the lifting height vary?`zoom`Variety | `false`       |
| topsurface    | `boolean` | Whether to display the top                 | `true`        |
| sidesurface   | `boolean` | Whether to display on the side             | `true`        |
| sourceColor   | `IColor`  | Side bottom color                          | `/`           |
| targetColor   | `IColor`  | side top color                             | `/`           |

### extrusion

`shape`for extruded geometry.

- [extrusion](/api/polygon_layer/shape#extrusion)

| style         | type     | describe              | Whether to support data mapping | default value |
| ------------- | -------- | --------------------- | ------------------------------- | ------------- |
| extrusionBase | `number` | Base height in meters | support                         | `0`           |

#### linear

The geometry layer supports configuring gradient effects (sourceColor, targetColor), which will be overwritten after configuring the gradient effect.`layer.color`Method to set the color.

### water

`shape`is the water surface geometry.

- [water](/api/polygon_layer/shape#shapewater)

| style        | type     | describe              | default value |
| ------------ | -------- | --------------------- | ------------- |
| speed        | `number` | water wave speed      | `0.5`         |
| waterTexture | `string` | water surface texture | `0`           |

`waterTexture`The default value is '<https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*EojwT4VzSiYAAAAAAAAAAAAAARQnAQ>'

### ocean

`shape`is the ocean surface geometry.

- [ocean](/api/polygon_layer/shape#shapeocean)

| style       | type     | describe    | default value |
| ----------- | -------- | ----------- | ------------- |
| watercolor  | `IColor` | water color | `#6D99A8`     |
| watercolor2 | `IColor` | water color | `#0F121C`     |

### other

Others supported by geometry layers`shape`There are corresponding layers. You can refer to the style parameters of the corresponding layers.
