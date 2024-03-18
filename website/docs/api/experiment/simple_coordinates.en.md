---
title: 简单坐标系（非地理坐标系）
order: 1
---

<embed src="@/docs/api/common/style.md"></embed>

We usually use longitude and latitude to describe geographical location, but in some special scenarios, we tend to use a simpler plane coordinate system (xyz) to describe the relative coordinates of a location. For this reason, L7 provides a simple coordinate system mode.

<img width="60%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*HenKR5VsXX0AAAAAAAAAAAAAARQnAQ'>

[Online case](/examples/point/text#simplecoordinate)

### Map

In order to use a simple coordinate system, we need to use the L7 custom Map map type and specify the version attribute of the map.

```javascript
import { Scene, ImageLayer, PointLayer } from '@antv/l7';
import { Map } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new Map({
    center: [500, 500],
    pitch: 0,
    zoom: 3,
    version: 'SIMPLE',
    mapSize: 1000,
    maxZoom: 5,
    minZoom: 2,
    pitchEnabled: false,
    rotateEnabled: false,
  }),
});
```

#### version

When using a custom coordinate system, users need to set the map type to 'SIMPLE'

#### mapSize: number

When using a custom coordinate system, users can set the size of the drawing area. The default drawing area is a rectangular area of ​​10000

<img width="50%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*qimkTLy0P6IAAAAAAAAAAAAAARQnAQ'>

#### pitchEnabled/rotateEnabled

When users use a custom coordinate system, it is recommended to set pitchEnabled/rotateEnabled to false

#### layer

When users use a custom coordinate system, they can use ordinary layers normally. The only difference is that they need to convert the original longitude and latitude coordinates into plane coordinates.

```javascript
const imagelayer = new ImageLayer({}).source(
   'https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*I0X5R4jAUQ4AAAAAAAAAAAAARQnAQ',
   {
   parser: {
      type: 'image',
      extent: [360, 400, 640, 600],
   },
   },
);

const textlayer = new PointLayer({ zIndex: 2 })
.source(
  [
    {
      x: 515,
      y: 575,
      t: 'hut',
    },
    ...
  ],
  {
    parser: {
      type: 'json',
      x: 'x',
      y: 'y',
    },
  },
)
.shape('t', 'text')
.size(12)
.active({
  color: '#00f',
  mix: 0.9
})
.color('rgb(86, 156, 214)')
.style({
  textAnchor: 'center', // The position of the text relative to the anchor point center|left|right|top|bottom|top-left
  spacing: 2, // character spacing
  fontWeight: '800',
  padding: [1, 1], // Text bounding box padding [horizontal, vertical], which affects the collision detection results and prevents adjacent texts from being too close.
  stroke: '#ffffff', // stroke color
  strokeWidth: 2, // Stroke width
  textAllowOverlap: true,
});

const lineData = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            testOpacity: 0.8,
          },
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [6000, 6000],
                [6000, 7000],
                [7000, 7000],
                [7000, 6000],
              ],
            ],
          },
        },
      ],
    };

    const linelayer = new LineLayer()
      .source(lineData)
      .shape('line')
      .size(10)
      .color('#0f0')
      .active(true);


const polygonData = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            testOpacity: 0.4,
          },
          geometry: {
            type: 'MultiPolygon',
            coordinates: [
              [
                [
                  [6000, 6000],
                  [6000, 7000],
                  [7000, 7000],
                  [7000, 6000],
                  [6000, 6000],
                ],
                [
                  [6300, 6300],
                  [6300, 6700],
                  [6700, 6700],
                  [6700, 6300],
                  [6300, 6300],
                ],
              ],
              [
                [
                  [5000, 5000],
                  [5000, 6000],
                  [6000, 6000],
                  [6000, 5000],
                  [5000, 5000],
                ],
              ],
            ],
          },
        },
      ],
    };

    const polygonLayer = new PolygonLayer()
      .source(polygonData)
      .shape('fill')
      .color('#f00')
      .style({
        opacity: 0.6,
      })
      .active(true);
```
