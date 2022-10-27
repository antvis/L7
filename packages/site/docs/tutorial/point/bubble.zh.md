---
title: 气泡图
order: 2
---
`markdown:docs/common/style.md`

气泡图地理区域上方会显示不同大小的圆点，圆形面积与其在数据集中的数值会成正比。

<div>
  <div style="width:60%;float:left; margin: 10px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*fNGiS7YI1tIAAAAAAAAAAABkARQnAQ'>
  </div>
</div>

## 绘制气泡图
### 实现

```javascript
import { PointLayer } from '@antv/l7';
const bubble = new PointLayer()
  .source(data)
  .shape(circle)
  .size('mag', [0, 25])
  .color('red')
  .style({
    opacity: 0.3,
    strokeWidth: 1,
  });
```

### source
### shape

### 