---
title: Marker 图层
order: 3
---

<embed src="@/docs/api/common/style.md"></embed>

MarkerLayer is an upgraded version of Marker. Marker is an independent map annotation, while MarkerLayer manages a large amount of Marker data in a unified manner.

**technical differences**

- Marker DOM draws a map element
- MarkerLayer manages multiple DomMarkers in a unified manner
- PointLayer draws elements via WebGL.

**Functional differences**

- The MarkerLayer element is highly customizable, and any combination of HTML+CSS can be drawn on the map.
- PointLayer is relatively weak in customization and has relatively high implementation costs. It has the advantage of being able to draw a large amount of data and has relatively good performance.

## use

```javascript
import { Marker, MarkerLayer } from '@antv/l7';
```

### Constructor

```javascript
const markerLayer = new MarkerLayer(option);

//Call the addMarker method to add multiple Markers to the Layer

scene.addMarkerLayer(markerLayer);
```

#### option

- cluster aggregation`boolean`default`false`

- clusterOption aggregation configuration

  - field `string`Aggregate statistical fields
  - method `sum| max| min| mean`
  - radius aggregate radius number default 40
  - minZoom: minimum aggregate zoom level number default 0
  - maxZoom: maximum aggregate zoom level number default 16
  - element `function`Set the style of the aggregate Marker through the callback function and return the dom element
    The callback function contains the following parameters
    - point_count defaults to the number of aggregated elements
    - clusterData `Array`Aggregate raw data of nodes
    - point_sum aggregate sum calculated based on field and method
    - point_max aggregate maximum value calculated based on field and method
    - point_min aggregate minimum value calculated based on field and method
    - point_mean aggregated mean calculated based on field and method

### method

#### addMarker

parameter

- marker `IMarker`Markers that need to be added

Add Marker

Instantiate a Marker through the Marker object

```javascript
const marker = new Marker().setLnglat(); // To add a Marker, you must set the longitude and latitude before adding it
markerLayer.addMarker(marker);
```

Add attribute information to Marker,

If the aggregation parameter sets the statistics configuration item`field| method`Need to add attribute information to Marker

extData via Marker[Configuration items](/api/complement/marker#options)Set Marker property information

```javascript
const marker = new Marker({
  extData: nodes.features[i].properties,
}).setLnglat({
  lng: coordinates[0],
  lat: coordinates[1],
});
```

#### removeMarker

Remove Marker from MarkerLayer

#### getMarkers

Get all Markers in MarkerLayer

#### clear

Clear all markers

####

### Scene

#### addMarkerLayer

Add MarkerLayer

```javascript
scene.addMarkerLayer(layer);
```

#### removeMarkerLayer

Remove MarkerLayer

```javascript
scene.removeMarkerLayer(layer);
```

### demo address

[markerLayer ](/examples/point/marker#markerlayer)

[markerLayer aggregation](/examples/point/marker#clustermarker)
