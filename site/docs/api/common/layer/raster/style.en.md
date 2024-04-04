`style`Method is used to configure the style of the layer,

- The single-channel drawing result is controlled by a single numerical value, such as a grayscale image. The color corresponding to the numerical value can be configured by expressing`rampColors`Ribbon control.

```js
layer.style({
  opacity: 0.5,
});
```

### Configuration

| style       | type               | describe                                                    | default value |
| ----------- | ------------------ | ----------------------------------------------------------- | ------------- |
| opacity     | `number`           | Graphic transparency                                        | `1`           |
| clampLow    | `boolean`          | Set as`true`, lower than`domain`data will not be displayed  | `false`       |
| clampHigh   | `boolean`          | Set as`true`, higher than`domain`data will not be displayed | `false`       |
| domain      | `[number, number]` | Data mapping interval                                       | `[ 0, 8000 ]` |
| noDataValue | `number`           | Values ​​that will not be displayed                         | `-9999999`    |
| rampColors  | `IRampColors`      | The color ramp for the range mapping color                  | `/`           |

<embed src="@/docs/api/common/layer/raster/rampcolors.en.md"></embed>
