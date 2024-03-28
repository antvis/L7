---
title: PointLayer
order: 0
---

<embed src="@/docs/api/common/style.md"></embed>

## Introduction

The point layer is a set of longitude and latitude data to describe the location of a series of points on the map. These points can be ordinary dots, or text, icons, pillars, etc.\
Users can configure`shape`parameters to select the type of point, and pass`style`、`size`、`color`Method to adjust the point style.

```javascript
import { PointLayer } from '@antv/l7';

const layer = PointLayer({
  zIndex: 2,
})
  .source(data.list, {
    type: 'array',
    x: 'j',
    y: 'w',
  })
  .shape('cylinder')
  .size('t', (level) => {
    return [4, 4, level + 40];
  })
  .color('t', [
    '#002466',
    '#105CB3',
    '#2894E0',
    '#CFF6FF',
    '#FFF5B8',
    '#FFAB5C',
    '#F27049',
    '#730D1C',
  ]);
```
