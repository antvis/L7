---
title: Heatmap
order: 0
---

<embed src="@/docs/api/common/style.md"></embed>

## Introduction

Heat maps display the degree of aggregation of data in geographical areas in a special highlighted form. L7 provides heat maps in a variety of presentation forms. By switching`shape`parameters, users can get different heat maps

<div>
  <div style="width:40%;float:right; margin-left: 16px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*QstiQq4JBOIAAAAAAAAAAABkARQnAQ'>
  </div>
</div>

```javascript
layer
  .shape('heatmap')
  .size('mag', [0, 1.0]) // weight mapping channel
  .style({
    radius: 20,
    rampColors: rampColors,
  });
```
