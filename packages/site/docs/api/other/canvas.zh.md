---
title: CanvasLayer
order: 2
---

CanvasLayer 允许用户通过 canvas 绘制的方法自定义图层的内容和样式。相比于 Marker 通过创建实际 DOM 的方式，CanvasLayer 无疑有更佳的性能。

## 使用

```jsx
import { CanvasLayer } from '@antv/l7';
const layer = new CanvasLayer({
  render: (option) => {
    const { size, ctx, mapService } = option;
    const [width, height] = size;

    ctx.clearRect(0, 0, width, height);
    // canvas 绘制
  },
});
```

<img width="60%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*hUmNQJ1sAb8AAAAAAAAAAAAAARQnAQ'/>

[在线案例](/examples/point/chart#custom)

### source

🌟 CanvasLayer 不需要设置 source。

### style

#### zIndex

每个创建一个 CanvasLayer，L7 会生成一个 Canvas DOM 的实例，我们通过设置 zIndex 的值来调整 CanvasLayer 的层级。

#### trigger

指定 CanavsLayer 的更新方式，update 有两个值 'change'、'end'，默认为 'change'

- change：地图更新时触发 `render` 方法
- end： 地图拖动完后/缩放完后触发 `render` 方法

#### render(options)

```javascript
options: {
  canvas: HTMLCanvasELement;
  ctx: RenderingContext;
  container: {
    width: number;
    height: number;
    bounds: [
      [number, number],
      [number, number],
    ];
  }
  utils: {
    lngLatToContainer: IMapService['lngLatToContainer'];
  }
  mapService: IMapService;
}
```

`render` 是用于在地图状态更新时调用的渲染函数，接受相关参数，用户在该函数中写 canvas 的绘制逻辑

- canvas CanvasLayer 生成的 canvas DOM 节点
- ctx 生成的 canvas DOM 的上下文
- container 当前视图的实际绘图范围和经纬度范围
- utils 提供在 `render` 方法中常用的工具函数
- mapService 当前地图的 mapService，主要提供 lngLatToContainer 方法

### 方法

#### render

类型：`() => void`

作用：触发 CanvasLayer 的重新渲染

#### getCanvas

类型：`() => HTMLCanvasElement | null`

作用：获取 `Canvas` 实例，只有在 `CanvasLayer` 的 `add` 事件触发后，`getCanvas` 才能获取到值

#### show

类型：`() => this`

作用：显示 `CanvasLayer`

#### hide

类型：`() => this`

作用：隐藏 `CanvasLayer`
