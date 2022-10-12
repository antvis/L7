---
title: RasterLayer
order: 5
---

`markdown:docs/common/style.md`

`RasterLayer` 图层主要实现栅格数据的可视化，栅格数据主要来源是卫星遥感数据，如数字高程图，植被分布图，夜光图。

L7 本身内部没有提供栅格数据格式 如 `tiff`,需要外部解析好做为 `Source` 传入。

## 使用

```javascript
import { RasterLayer } from '@antv/l7';
```

<img width="60%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*bUYqRb5esH4AAAAAAAAAAABkARQnAQ'>

