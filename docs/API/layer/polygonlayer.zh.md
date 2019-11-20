---
title: PolygonLayer
order: 3
---
# 填充图

绘制 2D 多边形以及沿 Z 轴拉伸后的 3D 图形。

### shape

填充图支持3种shape

- fill 绘制填充面   不支持数据映射
- line 绘制填充图描边  不支持数据映射
- extrude 对填充图3D拉伸 不支持数据映射

``` javascript
 PolyonLayer.shape('fill');
 PolyonLayer.shape('line').size(1); // size 表示线宽度
 PolyonLayer.shape('extrude'); // size 表示高度

```

其他方法，事件，同基类 [Layer](/zh/docs/api/layer/layer)


