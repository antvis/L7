---
title: 简单坐标系（非地理坐标系）
order: 1
---

<embed src="@/docs/common/style.md"></embed>

我们通常使用经纬度来描述地理位置，但是在某些特殊的场景，我们往往倾向于使用更加简单的平面坐标系(xyz)来描述位置的相对坐标，为此 L7 提供了简单坐标系的模式。

<img width="60%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*HenKR5VsXX0AAAAAAAAAAAAAARQnAQ'>

[在线案例](/examples/point/text#simplecoordinate)

### Map

为了使用简单坐标系，我们需要是使用 L7 自定义的 Map 地图类型，同时制定 map 的 version 属性

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

用户在使用自定义坐标系的时候，需要将地图的类型设置成 'SIMPLE'

#### mapSize: number

用户在使用自定义坐标系的时候，可以设置绘图区域的大小。绘图区域默认是 10000 X 10000 的矩形区域，坐标起点是左下角，水平向右为 X 正方向，垂直向上是 Y 正方向。

<img width="50%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*qimkTLy0P6IAAAAAAAAAAAAAARQnAQ'>

#### pitchEnabled/rotateEnabled

用户在使用自定义坐标系的时候，推荐将 pitchEnabled/rotateEnabled 设置为 false

#### layer

用户在使用自定义坐标系的时候，可以正常使用普通的图层，唯一的区别就是需要将原本的经纬度坐标转化为平面坐标

```javascript
const imagelayer = new ImageLayer({}).source(
   'https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*I0X5R4jAUQ4AAAAAAAAAAAAAARQnAQ',
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
      t: '小屋',
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
  textAnchor: 'center', // 文本相对锚点的位置 center|left|right|top|bottom|top-left
  spacing: 2, // 字符间距
  fontWeight: '800',
  padding: [1, 1], // 文本包围盒 padding [水平，垂直]，影响碰撞检测结果，避免相邻文本靠的太近
  stroke: '#ffffff', // 描边颜色
  strokeWidth: 2, // 描边宽度
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
