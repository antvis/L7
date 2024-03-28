---
title: Shape
order: 3
---

<embed src="@/docs/api/common/style.md"></embed>

`shape` 方法用于指定面图层绘制图形的类型，如填充图，填充线，挤出集合体等。

### shape('fill')

`shape` 为 `fill` 几何图层用于绘制平面的几何图形。

```js
layer.shape('fill');
```

### shape('extrude')

`shape` 为 `extrude` 几何图层用于绘制 3D 的几何体。

```js
layer.shape('extrude');
```

### extrusion

extrude 图层的升级版, 支持 extrusionBase（基础高度）数据映射

```js
layer.shape('extrusion');
```

### shape('water')

`shape` 为 `water` 几何图层用于绘制平面水体。

```js
layer.shape('water');
```

### shape('ocean')

`shape` 为 `ocean` 几何图层用于绘制平面海洋水体。

```js
layer.shape('ocean');
```

### shape('line')

`shape` 为 `line` 几何图层用于绘制线。

```js
layer.shape('line');
```

### shape('point_fill')

`shape` 为 `point_fill` 几何图层用于绘制填充点。

```js
layer.shape('point_fill');
```

### shape('point_image')

`shape` 为 `point_image` 几何图层用于绘制点图标。

```js
layer.shape('point_image');
```

### shape('point_extrude')

`shape` 为 `point_extrude` 几何图层用于绘制柱子。

```js
layer.shape('point_extrude');
```

### shape('text')

`shape` 为 `text` 几何图层用于绘制文字。

```js
layer.shape('text');
```
