---
title: 自定义图层
order: 7
---

L7 的自定义图层允许用户通过 canvas 绘制的方法自定义图层的内容和样式。相比于 Marker 通过创建实际 DOM 的方式，CanvasLayer 无疑有更加的性能。

## 使用

```jsx
import { CanvasLayer } from '@antv/l7';
const layer = new CanvasLayer({}).style({
  drawingOnCanvas: (option) => {
    const { size, ctx, mapService } = option;
    const [width, height] = size;

    ctx.clearRect(0, 0, width, height);
    // canvas 绘制
  },
});
```

<img width="60%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*hUmNQJ1sAb8AAAAAAAAAAAAAARQnAQ'/>

[在线案例](../../examples/point/chart#custom)

### source

🌟 CanvasLayer 不需要设置 source。

### Event

🌟 CanvasLayer 暂不支持交互动作。

### animate

当用户在绘制 canvas 动画的时候，为了实现动画的更新，需要执行 animate 方法。

```javascript
layer.animate(true);
```

[在线案例](../../examples/point/chart#custom)

### style

#### zIndex

每个创建一个 CanvasLayer，L7 会生成一个 Canvas DOM 的实例，我们通过设置 zIndex 的值来调整 CanvasLayer 的层级。

#### update

指定 CanavsLayer 的更新方式，update 有两个值 'always'、'dragend'，默认为 'always'

- always 总是更新
- dragend 地图拖动完后/缩放完后更新

#### drawingOnCanvas(options)

```javascript
options: {
  canvas: HTMLCanvasELement;
  ctx: CanvasRenderingContext2D;
  mapService: IMapService;
  size: [number, number];
}
```

drawingOnCanvas，这是一个函数，接受相关参数，用户在该函数中写 canvas 的绘制逻辑

- canvas CanvasLayer 生成的 canvas DOM 节点
- ctx 生成的 canvas DOM 的上下文
- mapService 当前地图的 mapService，主要提供 lngLatToContainer 方法
- size 当前视图的实际绘图范围的大小

#### lngLatToContainer([lng,lat]): {x: x, y: y}

该方法是由 mapService 参数提供的，主要用于将经纬度点位数据实时转化成 Canvas 绘图能够使用的 xy 坐标，从而达到绘图内容与地图的位置的对应。

```javascript
var center = [120, 30];
var centerXY = mapService.lngLatToContainer(center); // {x: 100, y: 100}
// centerXY 表示距离视图左上角 x 轴方向 100px，y 轴方向 100px
// canvas 绘图坐标系
```

`markdown:docs/common/layer/base.md`
