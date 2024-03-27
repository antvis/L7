---
title: Style
order: 4
---

<embed src="@/docs/api/common/style.md"></embed>

`style` 方法用于配制图层的样式，相同图层拥有不同的 `shape` 图形，不同 `shape` 的图层 `style` 方法接受不同的参数。

```js
layer.style({
  opacity: 0.5,
});
```

### common

通用 `style` 参数，所有图形都支持的参数。

| style   | 类型     | 描述         | 默认值 |
| ------- | -------- | ------------ | ------ |
| opacity | `number` | 图形的透明度 | `1`    |

### fill

`shape` 为平面填充几何体。

- [fill](/api/polygon_layer/shape#shapefill)

| style         | 类型             | 描述     | 默认值 |
| ------------- | ---------------- | -------- | ------ |
| raisingHeight | `number`         | 抬升高度 | `0`    |
| opacityLinear | `IOpacityLinear` | 透明渐变 | `/`    |

#### opacityLinear

```js
type IDir = 'in' | 'out';

interface IOpacityLinear {
  enable: false;
  dir: IDir;
}
```

### extrude

`shape` 为挤出几何体。

- [extrude](/api/polygon_layer/shape#shapeextrude)

| style         | 类型      | 描述                       | 默认值  |
| ------------- | --------- | -------------------------- | ------- |
| raisingHeight | `number`  | 抬升高度                   | `0`     |
| heightfixed   | `boolean` | 抬升高度是否随 `zoom` 变化 | `false` |
| topsurface    | `boolean` | 顶部是否显示               | `true`  |
| sidesurface   | `boolean` | 侧面是否显示               | `true`  |
| sourceColor   | `IColor`  | 侧面底部颜色               | `/`     |
| targetColor   | `IColor`  | 侧面顶部颜色               | `/`     |

### extrusion

`shape` 为挤出几何体。

- [extrusion](/api/polygon_layer/shape#extrusion)

| style         | 类型     | 描述             | 是否支持数据映射 | 默认值 |
| ------------- | -------- | ---------------- | ---------------- | ------ |
| extrusionBase | `number` | 基础高度，单位米 | 支持             | `0`    |

#### linear

几何体图层支持配置渐变效果（sourceColor、targetColor），在配置渐变效果后会覆盖 `layer.color` 方法设置的颜色。

### water

`shape` 为水体表面几何体。

- [water](/api/polygon_layer/shape#shapewater)

| style        | 类型     | 描述     | 默认值 |
| ------------ | -------- | -------- | ------ |
| speed        | `number` | 水波速度 | `0.5`  |
| waterTexture | `string` | 水面贴图 | `0`    |

`waterTexture` 默认值为 'https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*EojwT4VzSiYAAAAAAAAAAAAAARQnAQ'

### ocean

`shape` 为海洋表面几何体。

- [ocean](/api/polygon_layer/shape#shapeocean)

| style       | 类型     | 描述     | 默认值    |
| ----------- | -------- | -------- | --------- |
| watercolor  | `IColor` | 水面颜色 | `#6D99A8` |
| watercolor2 | `IColor` | 水面颜色 | `#0F121C` |

### other

几何体图层支持的其他 `shape` 都有对应的图层，可以参考对应图层的样式参数。
