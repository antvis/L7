- 单通道 绘制结果由是单一的数值控制，如灰度图，数值对应的颜色可以通过表示配置 `rampColors` 色带控制。

```js
layer.style({
  opacity: 0.5,
});
```

### options

| style       | 类型               | 描述                                        | 默认值        |
| ----------- | ------------------ | ------------------------------------------- | ------------- |
| opacity     | `number`           | 图形的透明度                                | `1`           |
| clampLow    | `boolean`          | 设置为 `true`，低于 `domain` 的数据将不显示 | `false`       |
| clampHigh   | `boolean`          | 设置为 `true`，高于 `domain` 的数据将不显示 | `false`       |
| domain      | `[number, number]` | 数据映射区间                                | `[ 0, 8000 ]` |
| noDataValue | `number`           | 不会显示的值                                | `-9999999`    |
| rampColors  | `IRampColors`      | 值域映射颜色的色带                          | `/`           |

<embed src="@/docs/api/common/layer/raster/rampcolors.zh.md"></embed>
