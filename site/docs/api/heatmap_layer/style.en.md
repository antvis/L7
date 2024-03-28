---
title: Style
order: 4
---

<embed src="@/docs/api/common/style.md"></embed>

`style`The method is used to configure the style of the layer. The same layer has different`shape`graphics, different`shape`layer`style`Methods accept different parameters.

🌟 Honeycomb heat map and grid heat map`style`The style can refer to the actual drawn layer.

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

### heatmap

`shape`for`heatmap`、`heatmap3D`type, draw a classic heat map.

| style      | type     | describe                   | default value |
| ---------- | -------- | -------------------------- | ------------- |
| intensity  | `number` | intensity of heat          | `10`          |
| radius     | `number` | The radius of the hot spot | `10`          |
| rampColors | `number` | thermal color value        | `1`           |

#### rampColors

- colors color array
- positions data interval

Configure the color band of the value range mapping color. The range of the value range is`[0 - 1]`, correspondingly we need to provide each`position`Position sets a color value.

⚠️ colors, positions must be the same length

```javascript
layer.style({
  rampColors: {
    colors: ['#FF4818', '#F7B74A', '#FFF598', '#91EABC', '#2EA9A1', '#206C7C'],
    positions: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
  },
});
```

### hexagon

Draw cellular heat maps.

| style    | type     | describe                | default value |
| -------- | -------- | ----------------------- | ------------- |
| angle    | `number` | Graphic rotation angle  | `0`           |
| coverage | `number` | graphics coverage ratio | `0.9`         |

### grid

Draw a grid heat map.

| style    | type     | describe                | default value |
| -------- | -------- | ----------------------- | ------------- |
| coverage | `number` | graphics coverage ratio | `1`           |
