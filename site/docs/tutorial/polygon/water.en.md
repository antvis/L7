---
title: 水面图层
order: 2
---

<embed src="@/docs/api/common/style.md"></embed>

Geometry layers support a special representation, the water surface layer.

<div>
  <div style="width:60%;float:left; margin: 10px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*BiawTbtX-CYAAAAAAAAAAAAAARQnAQ'>
  </div>
</div>

### accomplish

Next we will introduce how to draw water surface.

- you can`L7`Found on the official website[Online case](/examples/polygon/fill#ocean)

🌟 Simple water surface is supported starting from v2.8.1.\
🌟 Supports realistic water surfaces starting from version v2.8.4.

### simulated water surface

<img width="60%" style="display: block;margin: 0 auto;" alt="拟真水面" src="https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*BiawTbtX-CYAAAAAAAAAAAAAARQnAQ">

### source

It is recommended to use the standard geometry layer`GeoJSON`data.

### shape

we need to set`shape`for`ocean`。

### animate

The settings we need to display`animate`for`true`。

```javascript
layer.animate(true);
```

### style

- `watercolor`The color of shallow water areas defaults to '#6D99A8'.

- `watercolor2`The color of deep water areas defaults to '#0F121C'.

[Online case](/examples/polygon/fill#ocean)

### simple water surface

<img width="60%" style="display: block;margin: 0 auto;" alt="简单水面" src="https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*1kqvSYvWP3MAAAAAAAAAAAAAARQnAQ">

### source

It is recommended to use the standard geometry layer`GeoJSON`data.

### shape

we need to set`shape`for`water`。

### animate

The settings we need to display`animate`for`true`。

```javascript
layer.animate(true);
```

### style

- `speed`we can pass`speed`to control the flow speed of the water surface.

```javascript
style({
  speed: 0.5,
});
```

- `waterTexture`We can replace the texture of the water surface by setting this property.\
  The default value is '<https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*EojwT4VzSiYAAAAAAAAAAAAAARQnAQ>'

[Online case](/examples/polygon/fill#water)
