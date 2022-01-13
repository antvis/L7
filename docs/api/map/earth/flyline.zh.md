---
title: 飞线
order: 2
---

`markdown:docs/common/style.md`

用户在地球模式下使用飞线图层无需做额外的操作，L7 会自动识别地球模式并相关的转化

## 使用

地球飞线图通过 `LineLayer` 和 `EarthLayer` 实例化

```javascript
import { EarthLayer, LineLayer } from '@antv/l7';
```

<img src="https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*4ZCnQaH_nLIAAAAAAAAAAAAAARQnAQ" style="display: block; margin: 0 auto" alt="L7地球飞线图层" width="450px">

### shape

地球飞线图层 shape 只支持 **arc3d**

### 其他配置

剩下的配置和[线图层](../../line_layer/linelayer)一致

[在线案例](../../../../examples/earth/arc3d#flyline)
