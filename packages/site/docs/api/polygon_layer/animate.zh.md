---
title: Animate
order: 7
---

<embed src="@/docs/common/style.md"></embed>

几何体图层在 `shape` 为 `water` 或 `ocean` 的时候会得到流动的水面，此时我们需要使用 `animate` 方法开启动画。

<div>
  <div style="width:40%;float:left; margin: 16px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*BiawTbtX-CYAAAAAAAAAAAAAARQnAQ'>
  </div>
</div>

### animate(boolean)

`animate` 方法支持布尔值和对象传值。

```javascript
layer.animate(true);

layer.animate({
  enable: true,
});
```
