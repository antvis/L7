#### segmentNumber

The default arc segment number of the arc layer is 30. However, sometimes users do not need so many segments. Appropriately reducing the number of segments can improve performance while ensuring the effect.

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
