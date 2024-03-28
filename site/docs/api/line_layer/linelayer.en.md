---
title: LineLayer
order: 0
---

<embed src="@/docs/api/common/style.md"></embed>

## Introduction

The line layer describes one or more paths on the map through a set of longitude and latitude data sets. By the type of path, it is divided into path, arc, 3D arc and other types.\
Users can configure`shape`parameters to select the type of point, and pass`style`、`size`、`color`Method to adjust the point style.

<div>
  <div style="width:40%;float:right; margin-left: 16px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*MxnRTrzcawcAAAAAAAAAAAAAARQnAQ'>
  </div>
</div>

```js
const layer = new LineLayer()
  .source([{ lng: 120, lat: 30, lng1: 125, lat1: 30 }], {
    parser: {
      type: 'json',
      x: 'lng',
      y: 'lat',
      x1: 'lng1',
      y1: 'lat1',
    },
  })
  .shape('line')
  .size(2)
  .color('#f00');
```
