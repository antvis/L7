---
title: Source
order: 2
---

<embed src="@/docs/api/common/style.md"></embed>

<embed src="@/docs/api/common/layer/source.en.md"></embed>

### GeoJSON

```js
// Pass in GeoJSON type data *** L7 supports it by default and does not require parser analysis
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
```

### CSV

```js
// Pass in txt type data
var data = `from,to,value,type,lng1,lat1,lng2,lat2
鎷夎惃,仙魔タ,6.91,move_out,91.111891,29.662557,97.342625,37.373799
鎷厎惃,鎴愰嘘,4.79,move_out,91.111891,29.662557,104.067923,30.679943
鎷厎惃,玷夎惃,月充经,2.41,move_out,91.111891,29.662557,106.530635,29.544606
鎷厎惃,鍖椾han,2.05,move_out,91.111891,29.662557,116.395645,39.929986
...`;

var layer = new PointLayer().source(data, {
  parser: {
    type: 'csv',
    x: 'lng1',
    y: 'lat1',
  },
});
```

### JSON

```js
// Pass in JSON type data
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
```
