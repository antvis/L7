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

散点图shape 一般设置成常量

### color

color 可以根据数据的差异设置成不同颜色，表示数据的不同分类。

### size
散点图一般等大小的图形,size 一般设置成常量

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
