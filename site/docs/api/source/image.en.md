---
title: Image
order: 4
---

<embed src="@/docs/api/common/style.md"></embed>

Image data is mainly used to add images to the map based on longitude and latitude ranges. For example, a scanned version of a paper map needs to be displayed on the map.

## parser

- type: image
- extent: the latitude and longitude range of the image`[minlng, minlat,maxLng, maxLat]`Optional
- coordinates:`[[number,number],[number,number],[number,number],[number,number]]`; Optional

  Four geographic coordinates, expressed as arrays of longitude and latitude numbers, define the image's corner points. Coordinates start from the upper left corner of the image and proceed in clockwise order. They don't have to represent rectangles.

```javascript
layer.source('https://gw.alipayobjects.com/zos/rmsportal/FnHFeFklTzKDdUESRNDv.jpg', {
  parser: {
    type: 'image',
    extent: [121.168, 30.2828, 121.384, 30.4219],
  },
});
```

tilt picture

```ts
layer.source(
  'https://mdn.alipayobjects.com/huamei_gjo0cl/afts/img/A*vm_9S64uA0UAAAAAAAAAAAAADjDHAQ/original',

  {
    parser: {
      type: 'image',
      coordinates: [
        [100.959388, 41.619522],
        [101.229887, 41.572654],
        [101.16971, 41.377836],
        [100.900015, 41.424628],
      ],
    },
  },
);
```
