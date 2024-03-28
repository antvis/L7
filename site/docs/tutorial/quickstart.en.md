---
title: Quick Start
order: 1
---

<embed src="@/docs/api/common/style.md"></embed>

`L7`Available online`CDN`as well as`NPM`Quick access in the form of packages. pass`L7`With the capabilities provided, we can quickly complete map visualization.

## Installation introduction

### Introduced via npm

```javascript
//Install L7 dependencies
npm install --save @antv/l7
//Install third-party basemap dependencies
npm install --save @antv/l7-maps
```

### Imported via CDN

```html
<head>
  <! --Introducing the latest version of L7-->
  <script src="https://unpkg.com/@antv/l7"></script>
  <! --Specify the version number to introduce L7-->
  <script src="https://unpkg.com/@antv/l7@2.0.11"></script>
</head>
```

CDN reference obtains and initializes all objects through the L7 namespace when used, such as L7.scene, L7.GaodeMap

```javascript
import { Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new L7.Scene({
  id: 'map',
  map: new L7.GaodeMap({
    style: 'dark',
    center: [110.770672, 34.159869],
    pitch: 45,
  }),
});
```

## Basic tutorial

### Map component usage

1. To initialize the map, you first need to add a DOM to the page for map initialization.

```html
<div style="min-height: 500px; justify-content: center;position: relative" id="map" />
```

2. Initialize Gaode map

```javascript
import { GaodeMap } from '@antv/l7-maps';
//Similarly you can also initialize a Mapbox map
const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    pitch: 35.210526315789465,
    style: 'dark',
    center: [104.288144, 31.239692],
    zoom: 4.4,
  }),
});
```

🌟 At this point, interactive map content will appear on the page.

### Draw fill plot

After the map initialization is completed, we can add visual data to the map. Here we take China's administrative district data as an example of how to visualize surface data.
Data source: Chinese provinces[GeoJSON](https://gw.alipayobjects.com/os/bmw-prod/d6da7ac1-8b4f-4a55-93ea-e81aa08f0cf3.json)data.

1. We use polygon layers to draw administrative division data and obtain geometric planes covering the map surface.

```javascript
import { PolygonLayer } from '@antv/l7';
const chinaPolygonLayer = new PolygonLayer({})
  .source(data)
  .color('name', [
    'rgb(239,243,255)',
    'rgb(189,215,231)',
    'rgb(107,174,214)',
    'rgb(49,130,189)',
    'rgb(8,81,156)',
  ]);
```

2. After the layer is created, we need to add it to`Scene`displayed in .

```javascript
scene.addLayer(chinaPolygonLayer);
```

![image.png](https://gw.alipayobjects.com/mdn/rms_5e897d/afts/img/A*iUZVSYBtKnMAAAAAAAAAAAAAARQnAQ)

3. Simple filling visualization is still not intuitive enough, we can use`LineLayer`and`PointLayer`Add administrative division strokes and administrative division text labels.

![image.png](https://gw.alipayobjects.com/mdn/rms_5e897d/afts/img/A*Tf95Qp43Z6IAAAAAAAAAAAAAARQnAQ)

4. The visualization becomes clearer after adding borders and text annotations.

[View full code](https://codesandbox.io/s/l7-tianchongtujiaocheng-275ix?file=/index.js)

### Interactive fill plot

Simply displaying the data does not meet my needs. We may need to view the relevant information of each block or add some highlighting effects.

#### Highlight by default

`L7`Add a default highlight effect to the layer, and the default highlight effect can change the color.

```javascript
chinaPolygonLayer.active(true); // Turn on the default highlighting effect

chinaPolygonLayer.active({ color: red }); // Turn on and set the highlight color to red
```

| **![image.png](https://gw.alipayobjects.com/mdn/rms_5e897d/afts/img/A*vik-Q7frCMMAAAAAAAAAAAAAARQnAQ)** | **![image.png](https://gw.alipayobjects.com/mdn/rms_5e897d/afts/img/A*RJiaS498G4wAAAAAAAAAAAAAARQnAQ)** |
| ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Default blue highlight effect                                                                           | Change highlight color                                                                                  |

#### Custom highlight effect

The default highlight effect can only change the color, which may not meet my needs. We may need a white stroke. Can this be achieved? The answer is definitely yes.

1. Add a new layer as the highlight layer, set the data to empty data and the shape to`line`

```javascript
const hightLayer = new LineLayer({
  zIndex: 4, //Set the display level
  name: 'highlight',
})
  .source({
    type: 'FeatureCollection',
    features: [],
  })
  .shape('line')
  .size(2)
  .color('red');
scene.addLayer(hightLayer);
```

2. In this way, we can listen to the mouse events of the layer that needs to be highlighted, obtain the currently selected data, and then update`hightLayer`It can also achieve stroke highlighting effect.

```javascript
chinaPolygonLayer.on('click', (feature) => {
  hightLayer.setData({
    type: 'FeatureCollection',
    features: [feature.feature],
  });
});
```

![image.png](https://gw.alipayobjects.com/mdn/rms_5e897d/afts/img/A*fr9DTY54rhUAAAAAAAAAAAAAARQnAQ)

3. Add a click highlight red stroke effect to the layer

At this point we have learned how to customize the highlight effect. Here is a small question: "How to achieve the double stroke highlight effect?"

[View example](https://codesandbox.io/s/zidingyigaoliang-7vkso?file=/index.js)

#### Add information Popup information window

During mouse interaction, in addition to highlighting the crossed area, we also need information related to the information area, here`L7`provided`Popup`Components are used to display relevant information on the map.

Introduce objects

```javascript
import { Popup } from '@antv/l7';
```

We can decide when to display Popup by listening to mouse events on Layer.

```javascript
layer.on('mousemove', (e) => {
  const popup = new Popup({
    offsets: [0, 0],
    closeButton: false,
  })
    .setLnglat(e.lngLat)
    .setHTML(
      `<span>地区: ${e.feature.properties.name}</span><br><span>确诊数: ${e.feature.properties.case}</span>`,
    );
  scene.addPopup(popup);
});
```

![image.png](https://gw.alipayobjects.com/mdn/rms_5e897d/afts/img/A*2isvTq-s0OMAAAAAAAAAAAAAARQnAQ)

[View example](https://codesandbox.io/s/popup-x3j00?file=/index.js)

### Add legend

Above we have learned how to visualize data. On the map we can treat different areas as different colors, but how to understand what different colors mean, we need to add a legend.

`L7`There is currently no default legend component. You need to create the legend yourself. Here we introduce how to`L7 Control`The base class creates a legend component. Of course, you can also implement an independent legend.`DOM`components.

`L7`Provides a default`Zoom`，`Scale`，`Logo`These components are all based on the same base class`Control`Components, today we are based on`Control`Implement a custom legend component.

1. introduce`Control`base class

```javascript
import { Control } from '@antv/l7';
```

2. Initialize base class

```javascript
const legend = new Control({
  position: 'bottomright',
});
```

3. set up`Control`Show content

by extension`Control`of`onAdd`We can freely customize the method`Control`Need to display content and interaction.

```javascript
legend.onAdd = function () {
  var el = document.createElement('div');
  el.className = 'infolegend legend';
  var grades = [0, 10, 20, 50, 100, 200, 500];
  for (var i = 0; i < grades.length; i++) {
    el.innerHTML +=
      '<i style="background:' +
      color[i] +
      '"></i> ' +
      grades[i] +
      (grades[i + 1] ? '–' + grades[i + 1] + '<br>' : '+');
  }
  return el;
};
```

4. Add to map

```javascript
scene.addControl(legend);
```

![image.png](https://gw.alipayobjects.com/mdn/rms_5e897d/afts/img/A*7VNfRodZ_8AAAAAAAAAAAAAAARQnAQ)

[View example](https://codesandbox.io/s/tuli-keov0?file=/index.js)

Here we introduce how to define it by yourself`Control`way to implement the legend, by customizing`Control`Many of our map components, such as full-screen components, positioning components, and many other components needed for business, lucky students can try them out.

### Timing change diagram

What we visualized above is static data, but many times our data changes with time. How to visualize time series data? Here we introduce two time series data visualization methods.

#### Prepare data

Geographical data:[U.S. state administrative division data](https://gw.alipayobjects.com/os/basement_prod/d36ad90e-3902-4742-b8a2-d93f7e5dafa2.json)Attribute data:[0908-1008 COVID-19 diagnosis data by state in the United States in the past 30 days](https://gw.alipayobjects.com/os/bmw-prod/bed5e504-04d5-4d96-a335-163e038dc65a.csv)。

#### update data

As time changes, the data will definitely change, so the simplest way is to update the data every time.

```javascript
otherPolygonLayer.setData(newData);
```

[Complete example](https://codesandbox.io/s/shujugengxin-kgwy0?file=/index.js)

#### update color

A large part of the scenarios for updating time series data are updating attribute data, such as data from different years in each province.`GDP`Data, spatial data itself has not changed (no increase or decrease and no boundary update). In this case, the surface layer may only need to be updated according to the new data. Pass of course`setData`It can also be achieved.`L7`Looking at the internal implementation mechanism Update`color`is more efficient than`setData`Much more efficient.

Update the data display by updating the color mapping field.

```javascript
const setColor = (d) => {
  return d > 100000
    ? color[7]
    : d > 80000
      ? color[6]
      : d > 40000
        ? color[5]
        : d > 20000
          ? color[4]
          : d > 10000
            ? color[3]
            : d > 5000
              ? color[2]
              : d > 1000
                ? color[1]
                : color[0];
};

chinaPolygonLayer.color('2020-09-01', setColor);
chinaPolygonLayer.color('2020-09-02', setColor);
```

Note that the updated color takes effect and needs to be called`Scene.render();`。

[View example](https://codesandbox.io/s/shujugengxin-forked-0zul8?file=/index.js)

### Add map label

`L7`Base`WebGL`It is relatively simple to draw simple points, lines, and surfaces. It is more difficult to implement more complex map annotations. In order to solve this problem`L7`Added`Marker`Components you can base on`DOM`Achieve various complex annotations.

```javascript
import { Marker } from '@antv/l7';
 const el = document.createElement('label');
 el.className = 'labelclass';
el.textContent = nodes[i].v + '℃';
el.style.background = 'red';
el.style.borderColor = '#fff;
const marker = new Marker({ element: el})
  .setLnglat({ lng: 112, lat: 30});
scene.addMarker(marker);
```

![image.png](https://gw.alipayobjects.com/mdn/rms_5e897d/afts/img/A*8X9uRZPI3-oAAAAAAAAAAAAAARQnAQ)

[View full code](https://codesandbox.io/s/nifty-yonath-k6zor?file=/index.html)

### Add map component

In addition to the map visualization layer, we may need to add auxiliary map tools such as zoom in and out, scale bar, layer list and other components.

```javascript
import { Scale, Zoom } from '@antv/l7';
const zoomControl = new Zoom({ position: 'topright' });
const scaleControl = new Scale({ position: 'bottomright' });
//Add to map scene
scene.addControl(zoomControl);
scene.addControl(scaleControl);
```

#### Custom component

The legend introduced above is a custom component. We can also add any component content or add map interaction to the component.
For more usage methods, please refer to`L7`Provides default components[Source code](https://github.com/antvis/L7/tree/master/packages/component/src/control)

## Use templates for different projects

Different project templates in`CodeSandbox`You can preview it or download it locally.

### React

[address](https://codesandbox.io/s/l720react-jfwyz)

### Vue

[address](https://codesandbox.io/s/l720vue-uef1x)

### Angular

[address](https://codesandbox.io/s/angulartest-chpff)

### HTML CDN

[address](https://codesandbox.io/s/l7cdndemo-gfg9m)
