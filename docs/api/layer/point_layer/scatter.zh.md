---
title: 散点图
order: 2
---
在地理区域上放置相等大小的圆点，用来表示地域上的空间布局或数据分布。

## 使用
散点图通过PointLayer对象实例化

### shape

- circle
- square
- hexagon
- triangle
- pentagon
- octogon
- hexagram
- rhombus
- vesica

### 视觉通道设置

shape、size 设置成常量
color 可以设置根据数据映射

```javascript

const scatter = 
new PointLayer()
    .source(data)
    .shape(circle)
    .size(5)
    .color('red')
    .style({
      opacity: 0.3,
      strokeWidth: 1
    })
```
