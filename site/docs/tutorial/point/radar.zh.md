---
title: 雷达图
order: 4
---

<embed src="@/docs/api/common/style.md"></embed>

点图层还支持一种特殊的图层类型：雷达图。

<div>
  <div style="width:60%;float:left; margin: 10px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*YJmVRpmW7FEAAAAAAAAAAAAAARQnAQ'>
  </div>
</div>

### 实现

下面我们来介绍如何绘制一个常见的雷达图。

- 你可以在 `L7` 官网上找到[在线案例](/examples/point/scatter#radarpoint)

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

雷达图接受普通的点数据。

### shape

雷达图的 `shape` 为固定值 `radar`。

### animate

雷达图需要将 `animate` 设置为 `true` 才会生效

```javascript
.animate(true)

.animate({
  enable: true
})
```

### style

通过 `speed` 设置旋转速度，默认为 `1`，值越大转速越快。
