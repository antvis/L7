---
title: 水面图层
order: 2
---

`markdown:docs/common/style.md`

## 使用

水面图层是对 PolygonLayer 的扩展，因此在使用上和普通的 PolygonLayer 的图层类似。

🌟 从 v2.8.1 版本开始支持简单水面。  
🌟 从 v2.8.4 版本开始支持拟真水面。

## 拟真水面

<img width="60%" style="display: block;margin: 0 auto;" alt="拟真水面" src="https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*BiawTbtX-CYAAAAAAAAAAAAAARQnAQ">

### shape

我们需要设置 shape 为 ocean

### animate

我们需要显示的设置 animate 为 true

```javascript
layer.aniamte(true);
```

### style 配置

- watercolor 浅水区域的颜色 默认为 '#6D99A8'

- watercolor2 深水区域的颜色 默认为 '#0F121C'

[在线案例](../../../examples/polygon/fill#ocean)

## 简单水面

<img width="60%" style="display: block;margin: 0 auto;" alt="简单水面" src="https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*1kqvSYvWP3MAAAAAAAAAAAAAARQnAQ">

### shape

我们需要设置 shape 为 water

### animate

我们需要显示的设置 animate 为 true

```javascript
layer.aniamte(true);
```

### style 配置

- speed 我们可以通过 speed 来控制水面的流速度

```javascript
style({
  speed: 0.5,
});
```

- waterTexture 我们可以通过设置该属性来替换水面的纹理  
  默认值是 'https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*EojwT4VzSiYAAAAAAAAAAAAAARQnAQ'

[在线案例](../../../examples/polygon/fill#water)

`markdown:docs/common/layer/base.md`
