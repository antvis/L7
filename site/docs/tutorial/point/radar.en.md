---
title: Radar
order: 4
---

<embed src="@/docs/api/common/style.md"></embed>

Point layers also support a special layer type: radar charts.

<div>
  <div style="width:60%;float:left; margin: 10px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*YJmVRpmW7FEAAAAAAAAAAAAAARQnAQ'>
  </div>
</div>

### accomplish

Let’s introduce how to draw a common radar chart.

- you can`L7`Found on the official website[Online case](/examples/point/scatter#radarpoint)

```javascript
import { Scene, PointLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    center: [120, 30],
    zoom: 13,
  }),
});

const layer = new PointLayer()
  .source([{ lng: 120, lat: 30 }], {
    parser: {
      type: 'json',
      x: 'lng',
      y: 'lat',
    },
  })
  .shape('radar')
  .size(100)
  .color('#d00')
  .style({
    speed: 5,
  })
  .animate(true);
```

### source

Radar charts accept plain point data.

### shape

Radar chart`shape`is a fixed value`radar`。

### animate

The radar chart needs to be`animate`Set as`true`will take effect

```javascript
.animate(true)

.animate({
  enable: true
})
```

### style

pass`speed`Set rotation speed, default is`1`, the larger the value, the faster the speed.
