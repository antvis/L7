---
title: PolygonLayer
order: 0
---
`markdown:docs/common/style.md`

绘制 2D 多边形以及沿 Z 轴拉伸后的 3D 图形。

## 使用

```javascript
import { PolygonLayer } from '@antv/l7';
```

## shape

填充图支持 3 种 shape

- fill 绘制填充面 不支持数据映射
- line 绘制填充图描边 不支持数据映射
- extrude 对填充图 3D 拉伸 不支持数据映射

```javascript
PolyonLayer.shape('fill');
PolyonLayer.shape('line').size(1); // size 表示线宽度
PolyonLayer.shape('extrude').size(10); // size 表示高度
```

`markdown:docs/common/layer/base.md`
