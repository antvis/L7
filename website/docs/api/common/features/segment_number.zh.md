#### segmentNumber

arc 图层的弧线默认分段数是 30，然而有有些时候用户并不需要这么多的分段数，适当降低分段数量可以在保证效果的情况下提高性能。

```javascript
const layer = new LineLayer({})
  .source(data, {
    parser: {
      type: 'csv',
      x: 'lng1',
      y: 'lat1',
      x1: 'lng2',
      y1: 'lat2',
    },
  })
  .size(1)
  .shape('arc')
  .color('#8C1EB2')
  .style({
    segmentNumber: 15,
  });
```

