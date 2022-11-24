---
title: Animate
order: 7
---

<embed src="@/docs/common/style.md"></embed>

点图层在开启 `animate` 方法后根据点是 `2D` 点还是 `3D` 点支持两种不同的动画：水波点和生长动画。
点图层在开启 `animate` 方法后会得到特殊的水波图形。图层由一圈圈向外扩散的圆环构成。

<div>
  <div style="width:80%;float:left; margin: 16px;">
    <img style="float:left;" width="50%" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*pcp3RKnNK1oAAAAAAAAAAAAAARQnAQ'>
    <img style="float:left;" width="50%" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*l-SUQ5nU6n8AAAAAAAAAAAAAARQnAQ'>
  </div>
</div>

### 水波点

#### animate(boolean | IAnimateOption)

`animate` 方法支持布尔值和对象传值。

```javascript
layer.animate(true);

layer.animate({
  enable: true,
});
```

#### IAnimateOption

```javascript
interface IAnimateOption {
  enable: boolean;
  speed: number;
  rings: number;
}
```

### 生长动画

#### animate(boolean | IAnimateOption)

`animate` 方法支持布尔值和对象传值。

```javascript
animate(true)
animate(false)

animate(animateOptions)

interface IAnimateOptions: {
  enable: boolean;
  speed?: number = 0.01;
  repeat?: number = 1;
}
```

```
#### IAnimateOptions



`animate` 方法的参数：

- `enable` 是否开启动画，布尔值，默认为 `false`。
- `speed` 生长速度，数值，默认为 `0.01`。
- `repeat` 生长动画的播放次数，数值，默认为 `1`。
```
