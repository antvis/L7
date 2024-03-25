# PixelPickingEngine 设计

在地图交互中，除了地图底图本身提供的平移、旋转、缩放、flyTo 等相机动作，最常用的就是信息要素的拾取以及后续的高亮了。

3D 引擎常用的拾取技术通常有两种：RayPicking 和 PixelPicking。前者从鼠标点击处沿着投影方向发射一根射线，通过包围盒碰撞检测获取到接触到的第一个对象，后续就可以进行选中对象的高亮甚至是跟随移动了，以上运算均在 CPU 侧完成。
但是在 L7 的场景中，海量数据在同一个 Geometry 中，无法计算每个要素的包围盒，因此在 GPU 侧完成的 PixelPicking 更加适合。

作为拾取引擎 PixelPickingEngine，除了实现内置基本的拾取 Pass，最重要的是提供友好易用的 API，覆盖以下常见场景：

- 基本的拾取场景，用户只需要开启 Layer 拾取功能并设置高亮颜色即可。
- 拾取后展示特定 UI 组件的场景，用户需要监听事件，在回调中使用上述拾取对象完成组件展示。
- 更灵活的联动场景，用户可以不依赖 L7 内置的事件监听机制，直接拾取并高亮指定点/区域包含的要素。

本文会依次介绍：

- PixelPicking 原理
- 使用方法
  - 拾取对象结构
  - 拾取 API 的使用方法
    - 开启/关闭拾取
    - 设置高亮颜色
    - 展示自定义 UI 组件
  - 在自定义 Layer 中使用

## PixelPicking 原理

在执行时机方面，基于 [MultiPassRenderer](./MultiPassRenderer.md) 的设计，拾取发生在实际渲染之前：

```
ClearPass -> PixelPickingPass -> RenderPass -> [ ...其他后处理 Pass ] -> CopyPass
```

PixelPickingPass 分解步骤如下：

1. `ENCODE` 阶段。逐要素编码（idx -> color），传入 attributes 渲染 Layer 到纹理。
2. 获取鼠标在视口中的位置。由于目前 L7 与地图结合的方案为双 Canvas 而非共享 WebGL Context，事件监听注册在地图底图上。
3. 读取纹理在指定位置的颜色，进行解码（color -> idx)，查找对应要素，作为 Layer `onHover/onClick` 回调参数传入。
4. `HIGHLIGHT` 阶段（可选）。将待高亮要素对应的颜色传入 Vertex Shader 用于每个 Vertex 判断自身是否被选中，如果被选中，在 Fragment Shader 中将高亮颜色与计算颜色混合。

## 使用方法

### 拾取对象结构定义

拾取对象结构定义如下：

| 参数名  | 类型                            | 说明                                                      |
| ------- | ------------------------------- | --------------------------------------------------------- |
| x       | `number`                        | 鼠标位置在视口空间 x 坐标，取值范围 `[0, viewportWidth]`  |
| y       | `number`                        | 鼠标位置在视口空间 y 坐标，取值范围 `[0, viewportHeight]` |
| lnglat  | `{ lng: number; lat: number; }` | 鼠标位置经纬度坐标                                        |
| feature | `object`                        | GeoJSON feature 属性                                      |

### API

对于基本的拾取场景，用户只需要开启 Layer 拾取功能并设置高亮颜色即可。
而对于拾取后展示特定 UI 组件的场景，用户需要监听事件，在回调中使用上述拾取对象完成组件展示。
最后，对于更灵活的联动场景，用户可以不依赖 L7 内置的事件监听机制，直接拾取并高亮指定点/区域包含的要素。

#### 禁用/开启拾取

并不是所有 Layer 都需要拾取（例如文本渲染 Layer），通过 `enablePicking` 关闭可以跳过该阶段，减少不必要的渲染开销：

```typescript
const layer = new PolygonLayer({
  enablePicking: false, // 关闭拾取
});
```

⚠️L7 默认开启拾取。

#### 设置高亮颜色

如果一个 Layer 开启了拾取，我们可以通过 `highlightColor` 设置高亮颜色：

```typescript
const layer = new PolygonLayer({
  enablePicking: true, // 开启拾取
  enableHighlight: true, // 开启高亮
  highlightColor: [0, 0, 1, 1], // 设置高亮颜色为蓝色
});
```

#### 展示自定义 UI 组件

监听 Layer 上的 `hover/mousemove` 事件就可以得到拾取对象，然后通过对象中包含的位置以及原始数据信息，就可以使用 L7 内置或者自定义 UI 组件展示：

```typescript
layer.on('hover', ({ x, y, lnglat, feature }) => {
  // 展示 UI 组件
});
layer.on('mousemove', ({ x, y, lnglat, feature }) => {
  // 同上
});
```

除了基于事件监听，还可以通过 Layer 的构造函数传入 `onHover` 回调，在后续 Layer 对应的 react 组件中也可以以这种方式使用：

```typescript
const layer = new PolygonLayer({
  enablePicking: true,
  onHover: ({ x, y, lnglat, feature }) => {
    // 展示 UI 组件
  },
});
```

#### 直接调用拾取引擎方法

除了默认在地图上交互完成拾取，在与其他系统进行联动时，脱离了地图交互，仍需要具备拾取指定点/区域内包含要素的能力。

```typescript
anotherSystem.on('hover', ({ x, y }) => {
  layer.pick({
    x,
    y,
  });
});
```

⚠️目前只支持拾取视口中一个点所在的要素，未来可以实现拾取指定区域内的全部要素。

### 自定义 Layer 中的拾取

用户实现自定义 Layer 时，必然需要实现 Vertex/Fragment Shader。如果也想使用拾取功能，就需要在 Shader 中引入拾取模块，方法如下。

在 Vertex Shader 中引入 `picking` 模块。关于 L7 Shader 的模块化设计，[详见]()。

```glsl
// mylayer.vert.glsl

#pragma include "picking"

void main() {
  setPickingColor(customPickingColors);
}
```

在 Fragment Shader 中

```glsl
// mylayer.frag.glsl

#pragma include "picking"

void main() {
  // 必须在末尾，保证后续不会再对 gl_FragColor 进行修改
  gl_FragColor = filterPickingColor(gl_FragColor);
}
```

其中涉及 `picking` 模块方法说明如下：

| 方法名               | 应用 shader | 说明                                                             |
| -------------------- | ----------- | ---------------------------------------------------------------- |
| `setPickingColor`    | `vertex`    | 比较自身颜色编码与高亮颜色，判断是否被选中，传递结果给 fragment  |
| `filterPickingColor` | `fragment`  | 当前 fragment 被选中则使用高亮颜色混合，否则直接输出原始计算结果 |

## 参考资料

- [Deck.gl 交互文档](https://deck.gl/#/documentation/developer-guide/adding-interactivity)
- [Deck.gl Picking 实现](https://deck.gl/#/documentation/developer-guide/writing-custom-layers/picking)
- 「Interactive.Computer.Graphics.Top.Down.Approach - 3.9 Picking」
