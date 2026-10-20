---
title: "BaseLayer"
description: "BaseLayer"
language: "en"
canonical: "https://l7.antv.antgroup.com/en/api/base_layer/base/"
---

[Resource index](/llms.txt)

## Introduction

The L7 Layer interface design follows graphics syntax, and all layers inherit from the base class (baseLayer).

Syntax example

```javascript
const layer = new BaseLayer(option) // option - the parameter object passed into the constructor, providing the initial state of the layer
  .source(...) // Pass in the data required by the layer and related parsers
  .filter() //data filtering method
  .shape(...) // Specify a specific shape for the layer, such as: circle/triangle, etc.
  .color(...) //Specify the color configuration of the layer
  .texture(...) //Specify the texture referenced by the layer
  .size(...) //Set the size of layer elements
  .animate(...) //Set the animation mode of layer elements
  .active(...) //Specify whether the layer element supports swipe selection
  .select(...) //Specify whether the layer element supports click selection
  .style(...); // Specify the configuration of the layer's custom style

scene.addLayer(layer);
```

## options

### name

_string_ **optional** *default:*automatic numbering

Set the layer name, you can get the layer based on name

```javascript
scene.getLayerByName(name);
```

### visible

_bool_ **optional** _default:_ true

Is the layer visible?

### zIndex

_int_ **optional** *default:*0

Layer drawing order, larger values ​​are drawn on the upper layer, and you can control the upper and lower levels of layer drawing.

L7 uses a queue rendering mechanism. All layers are stored in an array internally. The rendering of each frame will sort the layer array according to the zIndex value, and then traverse the array to render the qualified layers to the scene. middle

### minZoom

_number_ **optional** *default:*Mapbox (0-24) Gaode (2-19)

Layer shows minimum zoom level

### maxZoom

_number_ **optional** *default:*Mapbox (0-24) Gaode (2-19)

Layer shows maximum zoom level

### autoFit

_bool_ **optional** _default:_ false

After layer initialization is completed, whether the map will automatically zoom to the layer range.

### pickingBuffer

_bool_ **optional** *default:*0

The layer picking cache mechanism, for example, a 1px width line is difficult to pick up (click) with the mouse. By setting this parameter, you can expand the picking range (enlarge the size of the layer object)

### blend

_string_ **optional** _default:_'normal'

Layer element blending effects

- normal Normal effect Default When occlusion occurs, only the color of the previous layer will be displayed.
- Additive overlay mode displays the superposition of the colors of the front and rear layers when occlusion occurs.
- subtractive subtraction mode: when occlusion occurs, the subtraction of the colors of the front and rear layers is displayed.
- max maximum value When occlusion occurs, the maximum value of the layer color rgb is displayed.

### enablePropagation

_boolean_ **optional** _default:_'false'Layer events, by default only respond to the top layer, setting to true will allow events to be transmitted transparently

⚠️ The use of mask and maskfence is not recommended. After configuring 2.14.x, the version will take effect.

Template layer: a layer used as a template. PointLayer, LineLayer, and PolygonLayer can all be used as templates.
Mask layer: the layer cut by the template

### maskLayers

Mask layer takes effect

_array Layer_ **optional** _default:_\[]

### enableMask

Mask layer takes effect

Whether to enable the mask. It is enabled by default. It will take effect when maskLayers is not empty.

_bool_ **optional** _default:_ true

### maskInside

```
Mask layer takes effect
```

_boolean_ **optional** _default:_ true

Used to describe the content of the current layer and mask boundary display.

- `true`Show inside the mask
- `false`Show outside mask

### maskOpetation mask method

Template layer takes effect _enumerate_ **optional** _default:_ andIt is invalid when there are multiple maskLayers and needs to be set on the template layer.

- or intersection
- and union

Usage example

```ts
const polygonLayer = new Polygon();
const rasterLayer = new Raster({
  // Raster layer uses polygon mask
  maskLayers: [polygonLayer],
  enableMask: true,
  maskInside: true,
});
```



## data method

-----|---

### source data

Set layer data and parsing configuration`source(data, config)`。

- data { geojson | json | csv }
- config optional data source configuration items
  - parser data analysis, the default is the parsing layer geojson
  - transforms \[transform, transform ] Multiple data processing transformations can be set

`parser`and `transforms` [See source documentation](/en/api/source/source)。

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

[Online case](/en/examples/point/image/image/)

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


### style

The style method is usually used to describe the specific style of a layer. Most layers will support some more general properties, such as the opacity property. At the same time, each layer will also have properties that are only supported by this layer, such as only
The windowColor attribute supported by CityBuildingLayer. Please check the detailed documentation of each layer for how to configure the attribute for each layer.

- opacity sets transparency, supported by most layers

- stroke line fill color only supported by point layer

- strokeWidth The width of the line. Only supported by point layers.

```javascript
layer.style({
  opacity: 0.8,
  stroke: 'white',
});
```

- Style data mapping🌟\
  Under normal circumstances, the style parameters will apply to all graphics on a layer. For example, if there are ten points in a PointLayer, we set opacity = 0.5, so that the transparency of the ten points is 0.5.\
  In special cases, we may need to set a transparency for each point. In this case, directly setting the opacity value of the style method in the original way cannot meet the needs. For this reason, we need to provide a special assignment method.\
  Usually we will set separate values ​​for each graphic of the layer based on the data passed into the layer, so we call it "style data mapping".\
  We support several ways of setting parameters in style to dynamically obtain values ​​from source data.

```javascript
//Set the transparency of each point of the point layer based on the value of the v field in the data
const data = [
  {
    lng: 120,
    lat: 30,
    v: 0.5
  },
  ...
]
const layer = new PointLayer()
  .source(data, {
    parser: {
      x: 'lng',
      y: 'lat'
    }
  })
  .shape('circle')
  .color('#f00')
  .size({
    // The first way to write is to get the value directly from data based on the field.
    opacity: 'v'// opacity = 0.5
  });
scene.addLayer(layer);
```

[Online case](/en/examples/point/text/style-map/)

from`L7 2.5`Starting from the beginning, each layer style will gradually support style data mapping. Currently, all layer styles support style data mapping.`style`The parameters are as follows:

| layer type/shape       | Supported style fields                               | Remark                                             |
| ---------------------- | ---------------------------------------------------- | -------------------------------------------------- |
| pointLayer/fill        | opacity、strokeOpacity、strokeWidth、stroke、offsets | shape circle、triangle...                          |
| pointLayer/image       | opacity、offsets                                     | offsets latitude and longitude offsets             |
| pointLayer/normal      | opacity、offsets                                     |                                                    |
| pointLayer/text        | opacity、strokeWidth、stroke、textOffset             | textOffset offset relative to text canvas position |
| pointLayer/extrude     | opacity                                              |                                                    |
| polygonLayer/fill      | opacity                                              |                                                    |
| polygonLayer/extrude   | opacity                                              |                                                    |
| lineLayer/line         | opacity                                              |                                                    |
| lineLayer/arc          | opacity、thetaOffset                                 | thetaOffset the curvature of the arc               |
| lineLayer/arc3d        | opacity                                              |                                                    |
| lineLayer/great_circle | opacity                                              |                                                    |

<img width="60%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*iz3ERZdg2SkAAAAAAAAAAAAAARQnAQ'>

[Online case](/en/examples/point/scatter/scatter-style-map/)


### texture

Currently, texture methods are only supported on line layers.

- The texture method supports passing in global icon texture resources added by the scene.addImage method.

```javascript
// First load image resources globally
scene.addImage(
  'plane',
  'https://gw.alipayobjects.com/zos/bmw-prod/0ca1668e-38c2-4010-8568-b57cb33839b9.svg',
);

const layer = new LineLayer({
  blend: 'normal',
})
  .source(data, {
    parser: {
      type: 'json',
      x: 'lng1',
      y: 'lat1',
      x1: 'lng2',
      y1: 'lat2',
    },
  })
  .size(25)
  .shape('arc')
  .texture('plane') // Bind texture to layer
  .color('#8C1EB2')
  .style({
    lineTexture: true, // Enable line mapping function
    iconStep: 30, // Set the spacing of the texture
    textureBlend: 'replace', //Set the texture blending method. The default value is normal. The optional values ​​are normal/replace.
  });
```

<img width="60%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*KEupSZ_p0pYAAAAAAAAAAAAAARQnAQ'>

[Online case](/en/examples/line/animate/plane-animate2/)


## Layer update method

If a layer has been added and you need to modify the layer display style, you can call the graphics mapping method again, and then call`scene.render()`Just update the rendering

### scale update

Recall the scale method

```tsx
layer.scale('value', {
  type: 'quantile',
});
scene.render();
```

### data mapping

Recall color/size/filter/shape and other methods

```javascript
layer.color('blue');
layer.size(10);

scene.render();
```

### layer.style

```javascript
layer.style({
  opacity: 1,
});

scene.render();
```

### setData(data, option?: {})

Update Source data

parameter:

- data data
- option defaults to the same as the initial configuration item. If the data format is the same, it does not need to be set.

Calling the setData method will automatically update the layer rendering

```javascript
layer.setData(data);
```

### setBlend(type: string)

Set layer overlay method
parameter:

- type blend 类型 normal ｜ additive ｜ subtractive ｜ max


## Layer control methods

### show()

Layer display

```javascript
layer.show();
```

### hide()

Layer hidden

```javascript
layer.hide();
```

### isVisible(): boolean

Is the layer visible?

```javascript
layer.isVisible();
```

### setIndex(zIndex: int)

Set layer drawing order

```javascript
layer.setIndex(1);
```

### fitBounds()

Zoom to layer extents

```javascript
layer.fitBounds();
```

### setMinZoom(zoom: number)

Set the minimum zoom level of the layer

```javascript
layer.setMinZoom(zoom);
```

### setMaxZoom(zoom: number)

Set the maximum zoom level of the layer

```javascript
layer.setMinZoom(zoom);
```

Set the maximum zoom level of the layer

parameter

- zoom {number}

```javascript
layer.setMinZoom(zoom);
```


## Layer interaction methods

### active(activeOption | boolean)

- Turn on or off mousehover element highlighting effect
- `activeOption`
  - `color`: Highlight color
  - `mix`: Optional parameter, the default is 0, which means the highlight color is the specified solid color. The maximum valid value is 1, which means the highlight color is all the background color.

```javascript
activeOption: {
  color: '#f00';
  mix: 0.6;
}
```

```javascript
// Turn on Active and use the default highlight color
layer.active(true);

// Turn on Active custom highlight color

layer.active({
  color: 'red',
  mix: 0.6,
});

//Turn off the highlight effect
layer.active(false);
```

### setActive(featured: in)

Set hover highlight of specified element based on element ID

🌟 Specifying element highlighting is not equal to layer highlighting. A layer contains multiple elements. Generally, a layer has as many elements as there are single pieces of data in the data array passed to source.

```javascript
layer.setActive(featureId);
```

### select(selectOption | boolean)

- Turn on or off mouseclick element selection highlighting effect
- selectOption
  - `color`: Select highlight color
  - `mix`: Optional parameter, the default is 0, which means that the selected highlight color is the specified solid color. The maximum effective value is 1, which means that all the selected highlight colors are background colors.

```javascript
selectOption: {
  color: '#f00';
  mix: 0.6;
}
```

```javascript
// Turn on Active and use the default highlight color
layer.select(true);

// Turn on Active custom highlight color

layer.select({
  color: 'red',
  mix: 0.6,
});

//Turn off the highlight effect
layer.select(false);
```

### setSelect(featureId: int)

Set the specified element according to the element ID click to select and highlight

🌟 Specifying element highlighting is not equal to layer highlighting. A layer contains multiple elements. Generally, a layer has as many elements as there are single pieces of data in the data array passed to source.

```javascript
layer.setSelect(featureId);
```

### setAutoFit(autoFit: boolean)

Allows users to actively set the autoFit parameters of layers\
🌟 After setting this method, it will take effect when the layer is updated, such as triggered after setData

```javascript
// Instructions
layer.setAutoFit(true);
// Internal implementation
public setAutoFit(autoFit: boolean): ILayer {
    this.updateLayerConfig({
      autoFit,
    });
    return this;
  }
```

### getScale(attr: string)

Supports separately obtaining the value of a graphic after scale calculation to meet the user's need to obtain certain feature values ​​of the layer.

- attribute value of attr scale

```javascript
const data = [
  { lng: 120, lat: 30, name: 'n1' },
  { lng: 120, lat: 30, name: 'n2' },
];
const layer = new PointLayer()
  .source(data, {
    parser: {
      x: 'lng',
      y: 'lat',
      type: 'json',
    },
  })
  .shape('circle')
  .color('name', ['#f00', '#ff0'])
  .size('name', [20, 40]);

scene.addLayer(layer);

// Draw two points on the scene at this time
// A point with a color of yellow and a size of 40, corresponding to name n1
// A point with a color of red and a size of 20, corresponding to name n2

const colorScale = layer.getScale('color'); // Get the scale generated by the color method
const color1 = colorScale('n1'); // '#ff0'
const color1 = colorScale('n2'); // '#f00'

const sizeScale = layer.getScale('size'); // Get the scale generated by the size method
const size1 = sizeScale('n1'); // 40
const size2 = sizeScale('n2'); // 20
```

### getLegendItems(type: string)

Get legend configuration

- type legend type
- index optional default

```javascript
layer.getLegendItems('color');

layer.getLegendItems('size');
```

### getLegend(type: string)

Get the legend getLegendItems enhanced version returns more information

return value

- type legend type
- field mapping field
- items legend items

```javascript
layer.getLegend('color');

layer.getLegend('size');
```


## layer mask method

### addMask

```
Add Mask layer
```

```ts
const polygonLayer = new Polygon();
layer.addMask(polygonLayer);
scene.render();
```

### removeMask

```ts
const polygonLayer = new Polygon();
layer.removeMask(polygonLayer);
scene.render();
```

### disableMask

```ts
layer.disableMask();
scene.render();
```

### enableMask

```ts
layer.disableMask();
scene.render();
```


## mouse events

Mouse event callback parameter target

```javascript
layer.on(eventName, (target) => console.log(target));
```

- x: number x coordinate of the mouse at the map location
- y: number The y coordinate of the mouse's position on the map
- type: string mouse event type
- lngLat: longitude object {lng:number, lat: number}; the latitude and longitude of the mouse location
- feature: any; geographical feature information selected by the data
- featureId: number | null; ID of the geographical feature selected in the data

### click

click event

```javascript
layer.on('click', (e) => console.log(e));
```

### dblclick

double click

```javascript
layer.on('dblclick', (e) => console.log(e));
```

### mousemove

mouse move event

```javascript
layer.on('mousemove', (e) => console.log(e));
```

### mouseout

mouse removal

```javascript
layer.on('mouseout', (e) => console.log(e));
```

### mouseup

mouse raised

```javascript
layer.on('mouseup', (e) => console.log(e));
```

### mousedown

mouse pressed

```javascript
layer.on('mousedown', (e) => console.log(e));
```

### contextmenu

right click

```javascript
layer.on('contextmenu', (e) => console.log(e));
```

### dblclick

Double click to pick element

```javascript
layer.on('dblclick', (e) => console.log(e));
```

### unclick

No element was picked up by clicking

```javascript
layer.on('unclick', (e) => console.log(e));
```

### unmousemove

Element not picked up by mouse movement

```javascript
layer.on('unmousemove', (e) => console.log(e));
```

### unmouseup

The element is not picked up when the mouse is raised

```javascript
layer.on('unmouseup', (e) => console.log(e));
```

### unmousedown

The element is not picked up when the mouse is pressed

```javascript
layer.on('unmousedown', (e) => console.log(e));
```

### uncontextmenu

Select the element with the right mouse button

```javascript
layer.on('uncontextmenu', (e) => console.log(e));
```

### unpick

All mouse events are not picked up

```javascript
layer.on('unpick', (e) => console.log(e));
```

Usage example

```javascript
layer.on('click', (ev) => {}); // Left mouse button click event on layer
layer.on('mouseenter', (ev) => {}); // The mouse enters the layer element
layer.on('mousemove', (ev) => {}); // Triggered when the mouse moves on the layer
layer.on('mouseout', (ev) => {}); // Triggered when the mouse moves out of the layer element
layer.on('mouseup', (ev) => {}); // Triggered when the mouse is clicked and raised on the layer
layer.on('mousedown', (ev) => {}); // Triggered when the mouse is clicked on the layer
layer.on('contextmenu', (ev) => {}); // Right-click menu of layer elements

//Events when the mouse is outside the layer
layer.on('unclick', (ev) => {}); // Click outside the layer
layer.on('unmousemove', (ev) => {}); // Move outside the layer
layer.on('unmouseup', (ev) => {}); // Mouse up outside the layer
layer.on('unmousedown', (ev) => {}); // Triggered when clicked outside the layer
layer.on('uncontextmenu', (ev) => {}); // Right-click outside the layer
layer.on('unpick', (ev) => {}); // All events for operations outside the layer
```


## layer events

### inited

Parameter option

- target current layer
- type event type

Triggered after layer initialization is completed

```javascript
layer.on('inited', (option) => {});
```

### add

Add layer to scene

Parameter option

- target current layer
- type event type

```javascript
layer.on('add', (type) => console.log(type));
```

### remove

Fires when a layer is removed

Parameter option

- target current layer
- type event type

```javascript
layer.on('remove', (type) => console.log(type));
```

### legend

Data mapping is updated, the legend changes, mainly color and size

### legend:color

The data mapping is updated, the legend changes, and the color changes
Parameter option

- type legend type
- field mapping field
- items legend items

```js
layer.on('legend:color', (ev) => console.log(ev));
```

### legend:size

The data mapping is updated, the legend changes, and the size changes
Parameter option

- type legend type
- field mapping field
- items legend items

```js
layer.on('legend:size', (ev) => console.log(ev));
```

## Layer selection

### boxSelect

Parameter option

- box \[x1: number, y1: number, x2: number, y2: number] compared to
- cb (...args: any\[]) => void callback method passed in, returns the feature inside the box selection

```javascript
layer.boxSelect(box, cb);
// (x1, y1), (x2, y2) The pixel coordinates of the upper left corner and lower right corner of the selected box relative to the upper left corner of the map
//cb is the callback function passed in. The parameter returned by the callback function is the selected feature object array. The fields of the object are related to the data passed in by the user.
```
