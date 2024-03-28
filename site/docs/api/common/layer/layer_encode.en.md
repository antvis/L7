-----|---

### source data

Set layer data and parsing configuration`source(data, config)`。

- data { geojson | json | csv }
- config optional data source configuration items
  - parser data analysis, the default is the parsing layer geojson
  - transforms \[transform, transform ] Multiple data processing transformations can be set

`parser`and `transforms` [See source documentation](/api/source/source)。

```javascript
layer.source(data, {
  parser: {
    type: 'csv',
    x: 'lng',
    y: 'lat',
  },
  transforms: [
    {
      type: 'map',
      callback: function (item) {
        const [x, y] = item.coordinates;
        item.lat = item.lat * 1;
        item.lng = item.lng * 1;
        item.v = item.v * 1;
        item.coordinates = [x * 1, y * 1];
        return item;
      },
    },
    {
      type: 'hexagon',
      size: 6000,
      field: 'v',
      method: 'sum',
    },
  ],
});
```

### cluster

we are using`cluster`After configuring the aggregation graph, you can use some aggregation methods to obtain the corresponding parameters.

#### getClusters(zoom: number): IFeatureCollection

Get aggregated data for a specified zoom level

- `zoom`Zoom level

#### getClustersLeaves(id: string): IFeatureCollection

according to`id`Get the data of the aggregation node. Each aggregation node will have a unique`ID`。

- `id`aggregation node`id`

```ts
const source = layer.getSource();
source.getClustersLeaves(id);
layer.on('click', (e) => {
  console.log(source.getClustersLeaves(e.feature.cluster_id));
});
```

## scale data measure

Scale measures convert map data values ​​(numbers, dates, categories, etc.) into visual values ​​(color, size, shape). Scales Scales are a fundamental component of data visualization because they determine the nature of the visual encoding. L7 currently supports Scale for continuous, discrete, and enumerated type data, and supports mapping of position, shape, size, and color coding.

When using L7, there is no need to configure Scale by default because L7 will infer scale based on the data type. The inference process is as follows:

Check whether the user has set Scale, if not:

Determine the field type of the first data of the field, if the corresponding field does not exist in the data:

Consider a constant as a fixed value

'linear' if numeric;

If it is string type 'cat';

### scale

[Scale details](https://mp.weixin.qq.com/s/QyD1_ypu0PDwMxEz45v6Jg)

参数： (field: string, scaleOptions: IscaleOptions)

- `field`Specify the field name used for mapping in the data passed in source
- `scaleOptions`Column definition configuration, object type
  - type scale type
  - unknown unmatched color optional default transparent
  - domain value range optional

```javascript
interface IscaleOptions {
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

#### type

Range and domain are two very important parameters in Scale

domain: definition interval of map data values
range: range of visual values
The difference between different Scales lies in the different conversion methods of domain->range

- domain: definition interval of map data values
- range: interval definition of visual value

|Data Class|Measurement Type|
\|---|
\| Continuous | linear, log, pow |
\| Continuous classification | quantize quantile,threshold,diverging |
\| Classification Enumeration | cat |

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

The data value and the mapped value are the same
For example, the value field in the data records the color of each element, and the value is the result value s to be mapped.

```
// Set to identify
layer.scale('value', { type: 'identify' });

// or

layer.scale('value'); // L7 can be automatically inferred as identify
```

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

#### diverging

Discrete classification is often used with two opposite hues to show the change from negative values ​​to center to positive values. These types of maps show the magnitude of values ​​in relation to each other.

### getScale(scaleName:string)

Get the scale instance based on the visual channel name. Make sure the layer has been initialized before calling.

```ts
const scale = layer.getScale('color');
const color = scale(1); //Convert numerical value to color
```

More of a method<a  target="_blank" href='https://github.com/antvis/L7/blob/master/packages/layers/src/core/BaseLayer.ts#L1176'>scale example usage</a>

## visual coding methods

Visual coding is the process of converting data into visual form. L7 currently supports three visual channels: shape, size, and color. You can specify data fields and set different graphic attributes for different elements.

<img width="100%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*PzoTRJnY-fIAAAAAAAAAAAAAARQnAQ'>

### filter

Data filtering method, supports callback function, maps data to true | false, visible when the result is true

```ts
pointLayer.filter('type', (type) => {
  // Callback
  if (type === 'a') {
    return false;
  }
  return true;
});
```

### size

A method for mapping data values ​​to the size of graphics. For specific parameters of the size method, you can view the detailed documentation of the corresponding layer.

```javascript
pointLayer.size(10); // constant
pointLayer.size('type'); // Use fields to map to sizes
pointLayer.size('type', [0, 10]); // Use fields to map to sizes and specify maximum and minimum values
pointLayer.size('type', (type) => {
  // Callback
  if (type === 'a') {
    return 10;
  }
  return 5;
});
```

#### size(value）

Pass in a numeric constant, such as`pointLayer.size(20)`

#### size(field)

Map the size according to the value of the field field, using the default`最大值 max:10` and`最小值 min: 1`。

#### size(field, callback)

Use callback functions to control graph size.

- `callback`: function callback function.

```javascript
pointLayer.size('age', (value) => {
  if (value === 1) {
    return 5;
  }
  return 10;
});
```

### color

A method for mapping data values ​​to the colors of a graph.

```javascript
layer.color('red'); // constant color
layer.color('type'); //Map the type field and use the built-in color
layer.color('type', ['red', 'blue']); // Specify color
layer.color('type', (type) => {
  // through callback function
  if (type === 'a') {
    return 'red';
  }
  return 'blue';
});
layer.color('type*value', (type, value) => {
  //Multiple parameters, through callback function
  if (type === 'a' && value > 100) {
    return 'red';
  }
  return 'blue';
});
```

#### color(value)

parameter:`value`：string

Only supports receiving one parameter, value can be:

- The data source field name mapped to the color attribute. If this field name does not exist in the data source, it will be parsed according to constants. In this case, the color provided by L7 by default will be used.

- You can also directly specify a specific color value, such as '#fff', 'white', 'rgba(255,0,0,0.5)', rgb(255,0,1), etc.

If the data is mapped to color, the transparent color will not be displayed by default. If you need to set the color, you need to set it in scale.

Example

```javascript
layer.color('name'); // Mapping data fields
layer.color('white'); //Specify color
```

#### color(field, colors)

parameter:

- `field`: stringfield is the name of the data source field mapped to the color attribute. It also supports specifying multiple parameters.

- `colors`: string | array | function

The parameters of colors have the following conditions: If it is empty, that is, an array of colors is not specified, then the built-in global color is used; if a color needs to be specified, it needs to be passed in in array format, then the color of the classification is determined according to the color in the array.

```javascript
layer.scale('name',{
  type: 'quantile'
  unknown:'#ccc' // Set invalid color
})
layer.color('name'); // use identity
layer.color('name', ['red', 'blue']); // Use the specified color passed in
```

- If colors is a callback function, the parameters of the callback function are the values ​​of the corresponding fields. The specific usage is as follows. When color is mapped to multiple fields, the parameters are passed in in the order in which the fields are declared:

```javascript
layer.color('gender', (value) => {
  if (value === 1) {
    return 'red';
  }
  return 'blue';
});
layer.color('gender*age', (gender, age) => {
  if (age === 20 && gender == ' 男') {
    return 'red';
  }
  return 'blue';
});
```

### shape

Usually a layer can have multiple representations. The shape method is used to specify the specific representation of the layer. Take the shape of PointLayer as an example:

```javascript
shape('circle'); // circle
shape('triangle'); // triangle
shape('cylinder'); // cylinder
```

<img width="60%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*iN0nTYRDd3AAAAAAAAAAAABkARQnAQ'>

**shape(shape)**

parameter`shape` string

- Only supports receiving one parameter, specifying the shape drawn by the geometric image object. The following table lists the shapes supported by the different layer geometry objects.

| layer type | shape type                                                                             | Remark |
| ---------- | -------------------------------------------------------------------------------------- | ------ |
| point      | 2d:point,circle, square, triangle,hexagon,image,text 3d:circle,triangle,hexagon,square |        |
| line       | line,arc, arc3d, greatcircle                                                           |        |
| polygon    | fill,line, extrude                                                                     |        |

**shape(field, shapes)**

- shape specifies the row shape based on the field, such as specifying the icon type of PointLayer/imageLayer based on the field.

```javascript
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
  .source(data, {
    parser: {
      type: 'json',
      x: 'longitude',
      y: 'latitude',
    },
  })
  .shape('name', ['00', '01', '02'])
  .size(20);
scene.addLayer(imageLayer);
```

<img width="60%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*oVyHT5S3sv0AAAAAAAAAAABkARQnAQ'>

[Online case](/examples/point/image#image)

**shape(field, callback)**

- Shape also supports writing callback functions

```javascript
.shape('key', value => {
  if(value > 10) {
    return 'circle';
  } else {
    return 'triangle';
  }
}
```
