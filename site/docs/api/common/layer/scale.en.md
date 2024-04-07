`scale`Method sets the data field mapping method, which is used to convert map data values ​​(numbers, dates, categories, etc.) into visual values ​​(color, size, shape). Scales Scales are a fundamental component of data visualization because they determine the nature of the visual encoding.

### scale(field: string, scaleConfig: IScaleConfig)

- `field`Specify the field name used for mapping in the data passed in source
- `scaleConfig`Column definition configuration, object type

```javascript
interface IScaleConfig {
  type: ScaleTypeName;
  domain?: any[];
  ...
}

layer.color('id', ['#f00', '#ff0'])
.size('mag', [1, 80])
.scale('mag', {
  type: 'linear',
  domain: [ 1, 50]
})；
```

### ScaleTypeName

`scale`The types can be divided into`3`kind`11`species, different`Scale`The difference is that`domain->range`The conversion method is different.\
`range`and`domain`yes`Scale`two very important parameters.

- domain: definition interval of map data values
- range: interval definition of visual value

| type of data   | Measurement type                                                  |
| -------------- | ----------------------------------------------------------------- |
| continuous     | linear、log、pow、time、sequential、quantize、quantile、threshold |
| Classification | cat、time                                                         |
| constant       | identity                                                          |

#### Cat

Cat refers to the enumeration type, which is used to display categorical data, such as the distribution of crop planting areas. Different categories such as rice, corn, and soybeans need to be mapped to different colors.

```js
// The three crops will be converted into corresponding colors respectively.
// domain = ['corn','rice', 'soybean'];
// range = ['red','white','blue'];
const data = [
  { lng: 120, lat: 30, t: 'corn' },
  { lng: 121, lat: 30, t: 'rice' },
  { lng: 122, lat: 30, t: 'soybean' },
];
layer.source(data, {
  parser: {
    type: 'type',
    x: 'lng',
    y: 'lat',
  },
});
layer.scale('t', { type: 'cat' });
layer.color('t', ['red', 'white', 'blue']);
```

#### identify

Constant measure A field is a constant that does not change.

#### linear

Linear is a mapping method for continuous data. Data and visual values ​​are converted using linear methods. For example, the data value 1-100 is linearly mapped to an offline gradient color from red to blue. Each number corresponds to a color.

#### quantize

Equal intervals divide the range of attribute values ​​into several equally sized subranges. Equal intervals work best with common data ranges, such as percentages and temperatures. This method emphasizes the amount of a certain attribute value relative to other values.

#### quantile

Each class contains an equal number of features. Quantile classification is well suited for linearly distributed data. Quantiles assign an equal number of data values ​​to each class. There is no empty class, nor a class with too many or too few values.
Because "quantile" classification is used to group features into each class in equal numbers, the resulting map is often misleading. You might place similar features into adjacent classes, or place features with widely different values ​​into the same class. This distortion can be minimized by increasing the number of classes.

#### threshold

It allows mapping any subset (non-uniform segment) of the domain to a range of discrete values. The input domain remains continuous and divided into slices based on a set of thresholds provided to the domain attributes. The range attribute must have N+1 elements, where N is the number of threshold boundaries provided in the domain

Manual interval Manual interval Manually set the classification interval. Some data will have corresponding industry standards or require some special display. For example, air quality data has strict data segmentation standards

```
-1   => "red"
0    => "white"
0.5  => "white"
1.0  => "blue"
1000 => "blue
```

#### diverging || Sequential

A uniform non-rational B-spline interpolator function that returns the given array of colors to be converted to RGB colors.

```js
const scaleColors = d3interpolate.interpolateRgbBasis(colors);
```

### IScaleConfig

```js
interface IScaleConfig {
  type: ScaleTypeName;
  domain?: any[];
  range?: any[];
  neutral?: number;
  field?: string;
  unknown?: string;
  ticks?: any[];
  nice?: boolean;
  clamp?: boolean;
  format?: () => any;
}
```
