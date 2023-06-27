---
title: Shape
order: 3
---

<embed src="@/docs/common/style.md"></embed>

`shape` 方法用于指定线图层绘制什么样的线。

### shape('line')

绘制路径图。

`line` 路径是最普通的线图层，支持配置宽度和高度，支持配置纹理和动画。

```js
layer.shape('line');
```

### shape('arc')

`arc` 弧线通过贝塞尔曲线算法计算出弧线的的路径，支持配置纹理和动画。

```js
layer.shape('arc');
```

### shape('arc3d')

`arc3d` 3d 弧线是在垂直地图两点之间的弧线，具有高度，支持配置纹理和动画。

```js
layer.shape('arc3d');
```

### shape('greatcircle')

`greatcircle` 大圆航线是地图两个点最近距离的连线，支持配置纹理和动画。

```js
layer.shape('greatcircle');
```

### shape('wall')

`wall` 是垂直地图的围墙，支持配置高度，纹理和动画。

```js
layer.shape('wall');
```

### shape('simple')

`simple` 线图层，宽度始终为 `1px`。

```js
layer.shape('simple');
```

### shape('flowline')

`flowline` 流向图, 2.17 版本新增