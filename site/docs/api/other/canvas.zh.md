---
title: CanvasLayer
order: 2
---

`CanvasLayer` 会在官方图层画布之上额外创建一个 `canvas` 画布，允许用户通过 `canvas` 绘制的方法自定义图层的内容和样式，相比于 `Marker` 通过创建实际 `DOM` 的方式，`CanvasLayer` 无疑有更佳的性能，同时 `CanvasLayer` 的绘制内容会永远覆盖在官方图层的内容之上。

用户主要通过 `CanvasLayer` 的 `draw` 回调函数来自定义 `canvas` 上绘制的内容，并且 `CanvasLayer` 在用户进行地图缩放、移动等操作时会自动调用 `draw` 方法保证绘制物与地图位置相对不变。

## 使用

```jsx
import { CanvasLayer, Scene } from '@antv/l7';

const scene = new Scene({
  //...
});

scene.on('loaded', () => {
  const layer = new CanvasLayer({
    trigger: 'change',
  });

  layer.draw(({ container, ctx, utils }) => {
    const [width, height] = size;
    // 清空画布
    ctx.clearRect(0, 0, container.width, container.height);
    // 经纬度 => 像素坐标 的转换
    const { x, y } = utils.lngLatToContainer([120, 30]);
    // 设置绘制颜色
    ctx.fillStyle = 'red';
    // 绘制一个矩形
    ctx.fillRect(x, y, 10, 10);
  });

  scene.addLayer(layer);
});
```

<img width="60%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*hUmNQJ1sAb8AAAAAAAAAAAAAARQnAQ'/>

[在线案例](/examples/point/chart#custom)

### 属性

#### draw

类型：`(drawParams: ICanvasLayerRenderParams) => void`

```TypeScript
type ICanvasLayerRenderParams = {
  canvas: HTMLCanvasELement;
  ctx: RenderingContext;
  container: {
    width: number;
    height: number;
    bounds: [
      [number, number],
      [number, number],
    ];
  };
  utils: {
    lngLatToContainer: IMapService['lngLatToContainer'];
  };
  mapService: IMapService;
}
```

作用：`draw` 方法是用于在地图状态更新时调用的渲染函数，接受相关参数，用户在该函数中写 canvas 的绘制逻辑

- canvas CanvasLayer 生成的 canvas DOM 节点
- ctx 生成的 canvas DOM 的上下文
- container 当前视图的实际绘图范围和地图展示的经纬度范围
- utils 提供在 `draw` 方法中常用的工具函数
- mapService 当前地图的 `mapService`，提供位置转换的相关方法

#### trigger

类型：`'change' | 'end'`

作用：指定 CanvasLayer 的更新方式，update 有两个值 'change'、'end'，默认为 'change'

- change：地图更新时触发 `draw` 方法
- end： 地图拖动完后/缩放完后触发 `draw` 方法

#### zIndex

类型：`number`

作用：每个创建一个 CanvasLayer，L7 会生成一个 Canvas DOM 的实例，我们通过设置 zIndex 的值来调整 CanvasLayer 的层级。

### 方法

#### draw

类型：`(drawCallback: (renderParams: ICanvasLayerRenderParams) => void) => this`

作用：更新 draw 绘制方法

#### updateLayerConfig

类型：`(options: Partial<ICanvasLayerOptions>) => this`

作用：更新 `CanvasLayer` 的配置

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

### 事件

图层基础事件可见 [图层事件](/api/base_layer/base#图层事件)

**注意**：如需监听 `canvas` 画布相关事件，需要在 `CanvasLayer` 触发 `add` 事件后（`canvas` DOM 初始化并挂载完成后），方可监听相应事件。

例如：

```jsx
const layer = new CanvasLayer({
  // ...
});
scene.addLayer(layer);

layer.on('add', () => {
  // 通过 getCanvas 获取 canvas DOM 实例
  layer.getCanvas().addEventListener('click', (e) => {
    console.log(e);
  });
});
```
