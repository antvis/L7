---
title: CSV
order: 3
---

<embed src="@/docs/api/common/style.md"></embed>

L7 supports CSV comma delimited CSV data loading.

CSV is a text data structure and it is difficult to express complex geographic data structures, so CSV only supports two data structures.

- Point data: longitude and latitude coordinates need to be specified
- Line segment and arc data: need to be specified**Starting and ending points**longitude and latitude coordinates

## parser

- type string required json
- x string point data represents longitude
- y string point data represents latitude
- x1 string longitude
- x2 string latitude

### Point data loaded via CSV

```javascript
layer.source(data, {
  parser: {
    type: 'csv',
    x: 'lng',
    y: 'lat',
  },
});
```

[CSV data demo example](/examples/point/bubble#scatter)

### Segment arc data is loaded via CSV

```javascript
layer.source(data, {
  parser: {
    type: 'csv',
    x: 'lng1',
    y: 'lat1',
    x1: 'lng1',
    y1: 'lat2',
  },
});
```

[CSV line segment data demo example](/examples/gallery/basic#arccircle)
