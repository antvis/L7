---
title: "Animate"
description: "Animate"
language: "zh"
canonical: "https://l7.antv.antgroup.com/zh/api/line_layer/animate/"
---

[资料索引](/llms.txt)

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

### animate

#### 开启关闭动画

```javascript
layer.animate(true);
layer.animate(false);
```

#### 设置动画参数

- duration 动画时间 单位(s)秒
- interval 轨迹间隔, 取值区间 0 - 1
- trailLength 轨迹长度 取值区间 0 - 1

```javascript
layer.animate({
  duration: 4,
  interval: 0.2,
  trailLength: 0.1,
});
```

##### 参数动画介绍

L7 目前动画参数为相对单位，我们默认一条线段的长度为 1
![L7 动画参数](https://gw.alipayobjects.com/mdn/rms_855bab/afts/img/A*IBBfSIkb51cAAAAAAAAAAABkARQnAQ)

如果 interval = 0.2,则一条轨迹将会分成 5 段，如果 interval = 0.5 则为两段。

<img width="450px" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*mo_7Q6sTqOIAAAAAAAAAAAAAARQnAQ'>

[在线案例](/zh/examples/line/animate/plane-animate2/)
