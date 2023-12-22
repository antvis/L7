---
title: Source
order: 2
---

<embed src="@/docs/api/common/style.md"></embed>

<embed src="@/docs/api/common/layer/source.zh.md"></embed>

🌟 热力图的数据使用和点图层保持一致。

### GeoJSON

```js
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

var layer = new HeatmapLayer()
.source(data)
```

### CSV

```js
// 传入 txt 类型数据
var data = `from,to,value,type,lng1,lat1,lng2,lat2
鎷夎惃,娴疯タ,6.91,move_out,91.111891,29.662557,97.342625,37.373799
鎷夎惃,鎴愰兘,4.79,move_out,91.111891,29.662557,104.067923,30.679943
鎷夎惃,閲嶅簡,2.41,move_out,91.111891,29.662557,106.530635,29.544606
鎷夎惃,鍖椾含,2.05,move_out,91.111891,29.662557,116.395645,39.929986
...`;

var layer = new HeatmapLayer().source(data, {
  parser: {
    type: 'csv',
    x: 'lng1',
    y: 'lat1',
  },
});
```

### JSON

```js
// 传入 JSON 类型的数据
var data = [
  {
    lng: 120,
    lat: 30
  },
  ...
]

var layer = new HeatmapLayer()
.source(data, {
  parser: {
    type: 'json',
    x: 'lng',
    y: 'lat',
  }
})
```
