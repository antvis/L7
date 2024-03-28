---
title: Shape
order: 3
---

<embed src="@/docs/api/common/style.md"></embed>

`shape`Method used to specify what kind of lines the line layer draws.

### shape('line')

Draw a path map.

`line`Path is the most common line layer, supporting configuration of width and height, texture and animation.

```js
layer.shape('line');
```

### shape('arc')

`arc`The arc calculates the path of the arc through the Bezier curve algorithm and supports configuring textures and animations.

```js
layer.shape('arc');
```

### shape('arc3d')

`arc3d`A 3d arc is an arc between two vertical map points, has a height, and supports configurable textures and animations.

```js
layer.shape('arc3d');
```

### shape('greatcircle')

`greatcircle`The great circle route is the closest connection between two points on the map, and supports the configuration of textures and animations.

```js
layer.shape('greatcircle');
```

### shape('wall')

`wall`It is a vertical map wall that supports configuration of height, texture and animation.

```js
layer.shape('wall');
```

### shape('simple')

`simple`Line layer, width is always`1px`。

```js
layer.shape('simple');
```

### shape('flowline')

`flowline`Flow diagram, new in version 2.17
