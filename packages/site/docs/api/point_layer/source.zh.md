---
title: Source
order: 1
---

`markdown:docs/common/style.md`

### source

点数据的展示，根据经纬点绘制图形，数据源支持 JSON、GeoJSON、CSV 三种数据格式。

- [GeoJSON](../source/geojson/#point)
- [CSV](../source/csv/#parser)
- [JSON](../source/json/#点数据)

🌟 通常每种数据都需要相应的 parser 解析数据

```javascript
// 传入 JSON 类型的数据
var data = [
  {
    lng: 120,
    lat: 30
  },
  ...
]

var layer = new PointLayer()
.source(data, {
  parser: {
    type: 'json',
    x: 'lng',
    y: 'lat',
  }
})

// 传入 GeoJSON 类型数据 *** L7 默认支持，不需要 parser 解析
var data = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: [
              [120, 30],
              ...
            ]
          },
        },
      ],
    };

var layer = new PointLayer()
.source(data)

// 传入 txt 类型数据
var data = `from,to,value,type,lng1,lat1,lng2,lat2
鎷夎惃,娴疯タ,6.91,move_out,91.111891,29.662557,97.342625,37.373799
鎷夎惃,鎴愰兘,4.79,move_out,91.111891,29.662557,104.067923,30.679943
鎷夎惃,閲嶅簡,2.41,move_out,91.111891,29.662557,106.530635,29.544606
鎷夎惃,鍖椾含,2.05,move_out,91.111891,29.662557,116.395645,39.929986
...`

var layer = new PointLayer()
.source(data, {
   parser: {
      type: 'csv',
      x: 'lng1',
      y: 'lat1',
   }
})
```

### style

点图层支持等面积点，点大小的单位是米，同样通过 size 方法设置大小

```javascript
import { PointLayer } from '@antv/l7';

const layer = PointLayer()
  .source(data)
  .shape('circle')
  .size(100)
  .color('#f00')
  .style({
    unit: 'meter',
  });
```

🌟 从 v2.7.9 版本开始支持高德地图、高德地图 2.0、Mapbox 地图
