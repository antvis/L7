---
title: Animate
order: 7
---

`markdown:docs/common/style.md`

点图层在开启 `animate` 方法后会得到特殊的水波图形。图层由一圈圈向外扩散的圆环构成。

<div>
  <div style="width:40%;float:left; margin: 16px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*pcp3RKnNK1oAAAAAAAAAAAAAARQnAQ'>
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
