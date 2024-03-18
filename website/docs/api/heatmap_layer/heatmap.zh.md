---
title: Heatmap
order: 0
---

<embed src="@/docs/api/common/style.md"></embed>

## 简介

热力图以特殊高亮的形式显示数据在地理区域的聚集程度，L7 提供了以多种表现形式的热力图，通过切换 `shape` 参数，用户可以得到不同的热力图

<div>
  <div style="width:40%;float:right; margin-left: 16px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*QstiQq4JBOIAAAAAAAAAAABkARQnAQ'>
  </div>
</div>

```javascript
layer
  .shape('heatmap')
  .size('mag', [0, 1.0]) // weight映射通道
  .style({
    radius: 20,
    rampColors: rampColors,
  });
```
