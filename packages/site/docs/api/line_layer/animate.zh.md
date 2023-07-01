---
title: Animate
order: 7
---

<embed src="@/docs/common/style.md"></embed>

线图层图层在开启 `animate` 方法后会得到沿线方向的线动画。

<div>
  <div style="width:40%;float:left; margin: 10px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*mo_7Q6sTqOIAAAAAAAAAAAAAARQnAQ'>
  </div>
</div>

### animate(boolean | IAnimateOption)

`animate` 方法支持布尔值和对象传值。

```javascript
layer.animate(true);

layer.animate({
  enable: true,
});
```

### IAnimateOption

```javascript
interface IAnimateOption {
  enable: boolean;
  speed: number;
  rings: number;
}
```

<embed src="@/docs/common/features/animate.zh.md"></embed>
