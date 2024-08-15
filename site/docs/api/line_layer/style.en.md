---
title: Style
order: 8
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

### line

`shape`for`line`normal line layer.

- [line](/api/line_layer/shape#shapeline)
- [Support gradient](/api/line_layer/style#linear)
- [Supports textures](/api/line_layer/style#texture)
- [Support dashed lines](/api/line_layer/style#dash)
- [Support arrows](/api/line_layer/style#arrow)

| style         | type                       | describe                                   | default value |
| ------------- | -------------------------- | ------------------------------------------ | ------------- |
| borderColor   | `string`                   | Graphic border color                       | `#fff`        |
| borderWidth   | `number`                   | Graphic border radius                      | `0`           |
| blur          | `[number, number, number]` | Graphic fuzzy distribution                 | `[1, 1, 1]`   |
| raisingHeight | `number`                   | Lifting height                             | `0`           |
| heightfixed   | `boolean`                  | Does the lifting height vary?`zoom`Variety | `false`       |

### arc

`shape`for`arc`Plane arc.

- [arc](/api/line_layer/shape#shapearc)
- [Support gradient](/api/line_layer/style#linear)
- [Supports textures](/api/line_layer/style#texture)
- [Support dashed lines](/api/line_layer/style#dash)

| style         | type     | describe                                                                           | default value |
| ------------- | -------- | ---------------------------------------------------------------------------------- | ------------- |
| segmentNumber | `number` | Arc segmentation, the more segments, the smoother and the greater the consumption. | `30`          |
| thetaOffset   | `number` | The radian parameter of the arc                                                    | `0.314`       |

### arc3d

`shape`for`arc3d`arc layer.

- [arc3d](/api/line_layer/shape#shapearc3d)
- [Support gradient](/api/line_layer/style#linear)
- [Supports textures](/api/line_layer/style#texture)
- [Support dashed lines](/api/line_layer/style#dash)

| style         | type     | describe                                                                           | default value |
| ------------- | -------- | ---------------------------------------------------------------------------------- | ------------- |
| segmentNumber | `number` | Arc segmentation, the more segments, the smoother and the greater the consumption. | `30`          |

### greatcircle

`shape`It is a large arc layer.

- [greatcircle](/api/line_layer/shape#shapegreatcircle)
- [Support gradient](/api/line_layer/style#linear)
- [Supports textures](/api/line_layer/style#texture)
- [Support dashed lines](/api/line_layer/style#dash)

| style         | type     | describe                                                                           | default value |
| ------------- | -------- | ---------------------------------------------------------------------------------- | ------------- |
| segmentNumber | `number` | Arc segmentation, the more segments, the smoother and the greater the consumption. | `30`          |

### flowline

| style         | type              | describe                                                                           | default value |
| ------------- | ----------------- | ---------------------------------------------------------------------------------- | ------------- |
| opacity       | `number`          | Transparency, supports data mapping                                                | `1`           |
| strokeOpacity | `number`          | stroke transparency                                                                | `30`          |
| stroke        | `number`          | Arc segmentation, the more segments, the smoother and the greater the consumption. | `#000`        |
| strokeWidth   | `number`          | stroke width                                                                       | `1`           |
| gapWidth      | `number`          | The distance between two lines in different directions                             | `2`           |
| offsets       | `[number,number]` | Offsets at both ends, supporting data mapping                                      | `[0,0]`       |

flowline opacity and offsets support data mapping, data-driven setting of data size

#### opacity

```ts
layer.style({
  opacity: {
    field: 'count', // map field
    value: [0.2,0.4,0.6,0.8], // Mapping value, supports callback function, supports setting scale
  }

// field and value are equivalent to layer.color('count',[0.2,0.4,0.6,0.8])
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

`shape`for`wall`Geofence arc layer.

- [wall](/api/line_layer/shape#shapewall)
- [Support gradient](/api/line_layer/style#linear)
- [Supports textures](/api/line_layer/style#texture)

### simple

`shape`for`simple`Simple line layer.

- [simple](/api/line_layer/shape#shapesimple)
- [Support gradient](/api/line_layer/style#linear)

### arrow

- [line](/api/line_layer/shape#shapeline)

Line layers support configuring arrows, which have additional styles.

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

| style       | type           | describe         | default value |
| ----------- | -------------- | ---------------- | ------------- |
| arrow       | `IArrowOption` | Arrow style      | `/`           |
| arrowWidth  | `number`       | Arrow width      | `2`           |
| arrowHeight | `number`       | length of arrow  | `3`           |
| tailWidth   | `number`       | Arrow tail width | `1`           |

### linear

- line、arc、arc3d、greatcircle、wall、simple

The line layer supports configuring gradient effects, which will be overwritten after configuring the gradient effect.`layer.color`Method to set the color.

| style       | type         | describe                | default value |
| ----------- | ------------ | ----------------------- | ------------- |
| sourceColor | `IColor`     | Line start color        | `/`           |
| targetColor | `IColor`     | Line end color          | `/`           |
| linearDir   | `ILinearDir` | Line gradient direction | `vertical`    |

#### IColor

```js
const color = `rgb(200, 100, 50)`;
const color2 = '#ff0';
```

#### ILinearDir

- vertical vertical (along the direction)
- horizontal

```js
type ILinearDir = 'vertical' | 'horizontal';
```

### texture

- line、arc、arc3d、greatcircle

Line layers support textures and texture animations, and texture styles have their own parameters.

| style        | type            | describe                                                       | default value |
| ------------ | --------------- | -------------------------------------------------------------- | ------------- |
| lineTexture  | `boolean`       | When to turn on texture capabilities                           | `false`       |
| textureBlend | `ITextureBlend` | Texture blending method                                        | `normal`      |
| iconStep     | `number`        | The spacing between texture maps arranged above the line layer | `100`         |

#### ITextureBlend

The texture of the line layer supports two types when blended with the color of the line itself.`normal`and`replace`。

- normal texture and line color blending
- replace Replace line color using texture

```js
type ITextureBlend = 'normal' | 'replace';
```

#### texture advance

✨ animate\
When the line layer (shape is arc/arc3d) turns on the animation mode, the distribution of the texture on the line layer will also be related to the parameters of animate

The number of textures arranged on a line layer is roughly duration/interval

```javascript
.animate({
    duration: 1,
    interval: 0.2,
    trailLength: 0.1
});

// At this time, the number of texture maps is duration / interval = 5
```

✨ textureBlend parameters\
By controlling the textureBlend parameter in the style method, we can control the blending of texture layers and line layers.

- normal
- replace

```javascript
.style({
    lineTexture: true, // Enable line mapping function
    iconStep: 30, // Set the spacing of the texture
    textureBlend: 'replace', //Set the texture blending method. The default value is normal. The optional values ​​are normal/replace.
  });
```

### dash

- line、arc、arc3d、greatcircle

The line layer supports configuring dashed lines, which have their own additional style parameters.

```js
layer.style({
    lineType: 'dash'
    dashArray: [5, 5]
})
```

| style     | type         | describe             | default value |
| --------- | ------------ | -------------------- | ------------- |
| lineType  | `ILineType`  | Line category        | `solid`       |
| dashArray | `IDashArray` | dotted line interval | `/`           |

#### ILineType

- solid solid line
- dash dashed line

#### IDashArray

`dashArray`only at`ILineType`for`dashed`will take effect.

```js
// len1 solid line length len2 interval length
type IDashArray = [len1: number, len2: number]
```
