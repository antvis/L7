---
title: Shape
order: 3
---

<embed src="@/docs/api/common/style.md"></embed>

`shape`The method is used to specify the type of graphics drawn on the surface layer, such as filled graphics, filled lines, extruded aggregates, etc.

### shape('fill')

`shape`for`fill`Geometry layers are used to draw plane geometry.

```js
layer.shape('fill');
```

### shape('extrude')

`shape`for`extrude`Geometry layers are used to draw 3D geometry.

```js
layer.shape('extrude');
```

### extrusion

An upgraded version of the extrude layer, supporting extrusionBase (base height) data mapping

```js
layer.shape('extrusion');
```

### shape('water')

`shape`for`water`Geometry layers are used to draw flat water bodies.

```js
layer.shape('water');
```

### shape('ocean')

`shape`for`ocean`Geometry layers are used to draw flat ocean water bodies.

```js
layer.shape('ocean');
```

### shape('line')

`shape`for`line`Geometry layers are used to draw lines.

```js
layer.shape('line');
```

### shape('point_fill')

`shape`for`point_fill`Geometry layers are used to draw fill points.

```js
layer.shape('point_fill');
```

### shape('point_image')

`shape`for`point_image`Geometry layers are used to draw point icons.

```js
layer.shape('point_image');
```

### shape('point_extrude')

`shape`for`point_extrude`The geometry layer is used to draw the columns.

```js
layer.shape('point_extrude');
```

### shape('text')

`shape`for`text`Geometry layers are used to draw text.

```js
layer.shape('text');
```
