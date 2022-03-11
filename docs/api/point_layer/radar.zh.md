---
title: 雷达图
order: 3
---

`markdown:docs/common/style.md`

点图层还支持一种特殊的图层类型：雷达图。

<img width="60%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*YJmVRpmW7FEAAAAAAAAAAAAAARQnAQ'>

## 使用

### shape

- radar

### animate

雷达图需要显示设置为 true

```javascript
.animate(true)

.animate({
  enable: true
})
```

#### style 配置项

- speed 旋转速度，默认为 1，值越大转速越快

[在线案例](../../../examples/point/scatter#radarPoint)

`markdown:docs/common/layer/base.md`
