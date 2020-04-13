---
title: 3D填充图
order: 1
---
## 使用
```javascript
import { PolygonLayer } from '@antv/l7'
const layer = new PolygonLayer();
```
### shape
3D Polygon 将多边形沿Z轴向上拉伸
- extrude 常量不支持数据映射

```javascript
layer.shape('extrude');
```

### size
size代表拉伸的高度，支持数据映射

```javascript
layer.size(10);// 高度设置成常量
layer.size('floor', [0,2000]); // 根据floor字段进行数据映射默认为线
layer.size('floor', (floor) => { // 通过回调函数设置size
  return floor * 2
})
```
### color
同 [layer#color](../layer/#color)

### style
同 [layer#style](../layer/#style)

