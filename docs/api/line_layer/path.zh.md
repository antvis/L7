---
title: 路径图
order: 1
---

`markdown:docs/common/style.md`
用一组首尾不闭合的点坐标对来定位的线图层，通常用来表示轨迹，线路，道路等

## 使用

```javascript
import { LineLayer } from '@antv/l7';
```

<img width="60%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*VJX5Qo7ufaAAAAAAAAAAAABkARQnAQ'>

[在线案例](../../../examples/gallery/animate#animate_path)

### shape

shape 设置成 line 即可绘制路线图

- line

### size

路径图线的 size 支持两个维度

- width 宽度
- height 高度

```javascript
layer.size([2, 10]); // 绘制宽度为2，高度为10的路径

layer.size('height', []);
```

🌟  通过设置第二个参数我们可以得到等高线图  

<img width="450px" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*p6LsTp3M144AAAAAAAAAAABkARQnAQ'>

[在线案例](../../../examples/line/isoline#ele)

✨  当用户在传入数据的第三个值可以用于表示当前点的高度，通过在 source 中传入的第三个参数我们可以的高度不等的线图层

`markdown:docs/api/line_layer/features/vertexHeight.zh.md`

`markdown:docs/api/line_layer/features/linear.zh.md`

`markdown:docs/api/line_layer/features/animate.zh.md`

`markdown:docs/api/line_layer/features/texture.zh.md`

`markdown:docs/common/layer/base.md`
