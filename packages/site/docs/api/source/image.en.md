---
title: Image
order: 4
---

<embed src="@/docs/api/common/style.md"></embed>

Image data is mainly used to add images to maps based on longitude and latitude ranges. For example, you want to display a scanned version of a paper map on the map.

## parser

* type: image
* extent: the latitude and longitude range of the image \[minlng, minlat,maxLng, maxLat]

Add the image to the map based on its latitude and longitude range.

```javascript
layer.source(
  'https://gw.alipayobjects.com/zos/rmsportal/FnHFeFklTzKDdUESRNDv.jpg',
  {
    parser: {
      type: 'image',
      extent: [121.168, 30.2828, 121.384, 30.4219],
    },
  },
);
```
