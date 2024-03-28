---
title: Simple Line
order: 4
---

<embed src="@/docs/api/common/style.md"></embed>

The simple line layer provides users with a better choice for large data volumes and can easily render line segments with hundreds of thousands of nodes. However, compared with ordinary line layers, the simple line layer is also lost. some other abilities.

<div>
  <div style="width:60%;float:left; margin: 10px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*HulgSKEJAKMAAAAAAAAAAAAAARQnAQ'>
  </div>
</div>

### accomplish

Let's introduce how to draw a simple line.

- you can`L7`Found on the official website[Online case](/examples/gallery/animate#grid)

```javascript
import { LineLayer } from '@antv/l7';
const layer = new LineLayer()
  .source(data)
  .shape('simple')
  .size(10) // The size method does not take effect. The line width is always 1px.
  .color('#f00')
  .style(...)
```

### shape

In order to draw a simple line we need to`shape`The parameters are set to`simple`。

<embed src="@/docs/api/common/features/linear.zh.md"></embed>

🌟 Simple line layer does not support animation and textures
