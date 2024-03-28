### animate

#### Turn on and off animation

```javascript
layer.animate(true);
layer.animate(false);
```

#### Set animation parameters

- duration animation time unit (s) seconds
- interval trajectory interval, value range 0 - 1
- trailLength trail length value range 0 - 1

```javascript
layer.animate({
  duration: 4,
  interval: 0.2,
  trailLength: 0.1,
});
```

##### Introduction to parameter animation

L7 The current animation parameters are relative units, and our default length of a line segment is 1![L7 动画参数](https://gw.alipayobjects.com/mdn/rms_855bab/afts/img/A*IBBfSIkb51cAAAAAAAAAAABkARQnAQ)

If interval = 0.2, a trajectory will be divided into 5 segments, if interval = 0.5, it will be two segments.

<img width="450px" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*mo_7Q6sTqOIAAAAAAAAAAAAAARQnAQ'>

[Online case](/examples/gallery/animate#plane_animate2)
