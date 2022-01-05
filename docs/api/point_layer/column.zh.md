---
title: 3D 柱图
order: 5
---

`markdown:docs/common/style.md`

3D 柱图地理区域上方会显示不同高度的柱体，主题的高度与其在数据集中的数值会成正比。

## 使用

3D 柱图通过 PointLayer 对象实例化，将 shape 设置成不同的 3Dshape

```javascript
import { PointLayer } from '@antv/l7';
```

<img width="80%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*RVw4QKTJe7kAAAAAAAAAAABkARQnAQ'>

### shape

3D Shape 支持

- cylinder
- triangleColumn
- hexagonColumn
- squareColumn

### size

3D 柱图 size 需要设置三个维度 [w, l, z]

- w 宽
- l 长
- z 高度

size 设置成常量

```
 layer.size([2,2,3])
```

size 回调函数设置

```
 layer.size('unit_price', h => {
        return [ 6, 6, h / 500 ];
    })
```

```javascript
const column = new PointLayer({})
  .source(data)
  .shape('name', [
    'cylinder',
    'triangleColumn',
    'hexagonColumn',
    'squareColumn',
  ])
  .size('unit_price', (h) => {
    return [6, 6, h / 500];
  })
  .color('name', ['#5B8FF9', '#70E3B5', '#FFD458', '#FF7C6A'])
  .style({
    opacity: 1.0,
  });
```

### animate

3D 柱图支持生长动画  
animate 方法支持的布尔值和对象参数

<img width="80%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*l-SUQ5nU6n8AAAAAAAAAAAAAARQnAQ'>

```javascript
animate(true)
animate(false)

animate(animateOptions)

animateOptions: {
  enable: boolean;
  speed?: number = 0.01;
  repeat?: number = 1;
}
```

## 额外的 style 配置

- sourceColor 设置 3D 柱图起始颜色（3D 柱图设置颜色渐变时会覆盖 color 设置的颜色）

- targetColor 设置 3D 柱图终止颜色

- opacityLinear 设置 3D 柱图透明度渐变

<img width="80%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*oZWGSIceykwAAAAAAAAAAAAAARQnAQ'>

```javascript
style({
  opacityLinear: {
    enable: true, // true - false
    dir: 'up', // up - down
  },
});
```

- lightEnable 是否开启光照

```javascript
layer.style({
  opacity: 0.8,
  sourceColor: 'red',
  targetColor: 'yellow',
});
```

[光标柱图](../../../examples/point/column#column_light)  
[渐变柱图](../../../examples/point/column#column_linear)

`markdown:docs/common/layer/base.md`
