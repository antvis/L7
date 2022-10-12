---
title: Style
order: 4
---

`markdown:docs/common/style.md`

### style

点图层支持等面积点，点大小的单位是米，同样通过 size 方法设置大小

```javascript
import { PointLayer } from '@antv/l7';

const layer = PointLayer()
  .source(data)
  .shape('circle')
  .size(100)
  .color('#f00')
  .style({
    unit: 'meter',
  });
```
