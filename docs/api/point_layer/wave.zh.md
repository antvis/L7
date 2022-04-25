---
title: 水波图
order: 3
---

`markdown:docs/common/style.md`

平面点图层在开启动画模式的情况下，是一种特殊的图层类型：水波点。图层由一圈圈向外扩散的圆环构成。

<img width="60%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*pcp3RKnNK1oAAAAAAAAAAAAAARQnAQ'>

## 使用

### shape

- circle、triangle、square 等平面图形都可

### animate

- boolean ｜ animateOption

```javascript
.animate(true)

.animate({
  enable: true
})
```

#### 水波配置项

- speed 水波速度
- rings 水波环数

### size

在水波点图层中，由于边缘透明的原因，点的大小看上去要比相同 size 的非水波点要小一些。

[在线案例](../../../examples/point/scatter#animatePoint)

## 额外的 style 配置

- raisingHeight 设置 3D 填充图的抬升高度

`markdown:docs/common/layer/base.md`
