---
title: Style
order: 4
---

`markdown:docs/common/style.md`

`style` 方法用于配制图层的样式，栅格图层在绘制单通道的栅格和多通道的栅格时拥有不同的 `style` 参数。

- 单通道 绘制结果由是单一的数值控制，如灰度图，数值对应的颜色可以通过表示配置 `rampColors` 色带控制。
- 多通道 绘制结果由 `r`、`g`、`b` 三个通道的数值控制，直接作为 `sRGB` 的颜色。

```js
layer.style({
  opacity: 0.5,
});
```

### raster 单通道栅格

| style       | 类型               | 描述                                        | 默认值        |
| ----------- | ------------------ | ------------------------------------------- | ------------- |
| opacity     | `number`           | 图形的透明度                                | `1`           |
| clampLow    | `boolean`          | 设置为 `true`，低于 `domain` 的数据将不显示 | `false`       |
| clampHigh   | `boolean`          | 设置为 `true`，高于 `domain` 的数据将不显示 | `false`       |
| domain      | `[number, number]` | 数据映射区间                                | `[ 0, 8000 ]` |
| noDataValue | `number`           | 不会显示的值                                | `-9999999`    |
| rampColors  | `IRampColors`      | 值域映射颜色的色带                          | `/`           |

#### rampColors

🌟 数据栅格瓦片

配置瓦片值域映射颜色的色带。

```javascript
layer.style({
  rampColors: {
    colors: ['#FF4818', '#F7B74A', '#FFF598', '#91EABC', '#2EA9A1', '#206C7C'],
    positions: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
  },
});
```

### raster 多通道栅格

| style   | 类型     | 描述         | 默认值 |
| ------- | -------- | ------------ | ------ |
| opacity | `number` | 图形的透明度 | `1`    |
