---
title: Source
order: 2
---

<embed src="@/docs/common/style.md"></embed>

<embed src="@/docs/common/layer/source.md"></embed>

### GeoJSON

```js
// 传入 GeoJSON 类型数据 *** L7 默认支持，不需要 parser 解析
const data = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: [
          [106.5234375, 57.51582286553883],
          [136.40625, 61.77312286453146],
        ],
      },
    },
  ],
};

const layer = new LineLayer().source(data);
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

new LineLayer().source(data, {
  parser: {
    type: 'csv',
    x: 'lng1',
    y: 'lat1',
    x1: 'lng2',
    y1: 'lat2',
  },
});
```

### JSON

```js
// 传入 JSON 类型的数据
var data = [
  {
    lng: 120,
    lat: 30,
    lng1: 125,
    lat1: 30
  },
  ...
]

var layer = new LineLayer()
.source(data, {
  parser: {
    type: 'json',
    x: 'lng',
    y: 'lat',
    x1: 'lng1',
    y1: 'lat1'
  }
})
```
