---
title: Animate
order: 7
---

<embed src="@/docs/api/common/style.md"></embed>

The line layer is on`animate`After the method, you will get the line animation along the line direction.

<div>
  <div style="width:40%;float:left; margin: 10px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*mo_7Q6sTqOIAAAAAAAAAAAAAARQnAQ'>
  </div>
</div>

### animate(boolean | IAnimateOption)

`animate`The method supports Boolean and object passing values.

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

<embed src="@/docs/api/common/features/animate.en.md"></embed>
