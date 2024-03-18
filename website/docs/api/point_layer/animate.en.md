---
title: Animate
order: 7
---

<embed src="@/docs/api/common/style.md"></embed>

Click on the layer to turn it on`animate`The basis points after the method are`2D`Point is still`3D`Points support two different animations: water wave points and growth animation.
Click on the layer to turn it on`animate`After the method, a special water wave pattern will be obtained. The layer is made up of rings that spread outward.

<div>
  <div style="width:80%;float:left; margin: 16px;">
    <img style="float:left;" width="50%" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*pcp3RKnNK1oAAAAAAAAAAAAAARQnAQ'>
    <img style="float:left;" width="50%" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*l-SUQ5nU6n8AAAAAAAAAAAAAARQnAQ'>
  </div>
</div>

### water wave point

#### animate(boolean | IAnimateOption)

`animate`The method supports Boolean and object passing values.

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

### growth animation

#### animate(boolean | IAnimateOption)

`animate`The method supports Boolean and object passing values.

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



Parameters of `animate` method:

- `enable` Whether to enable animation, Boolean value, default is `false`.
- `speed` Growth speed, numerical value, default is `0.01`.
- `repeat` The number of times to play the growth animation, numerical value, the default is `1`.
```
