
`style` 方法用于配制图层的样式，
- 单通道 绘制结果由是单一的数值控制，如灰度图，数值对应的颜色可以通过表示配置 `rampColors` 色带控制。

```js
layer.style({
  opacity: 0.5,
});
```

### 配置

| style       | 类型               | 描述                                        | 默认值        |
| ----------- | ------------------ | ------------------------------------------- | ------------- |
| opacity     | `number`           | 图形的透明度                                | `1`           |
| clampLow    | `boolean`          | 设置为 `true`，低于 `domain` 的数据将不显示 | `false`       |
| clampHigh   | `boolean`          | 设置为 `true`，高于 `domain` 的数据将不显示 | `false`       |
| domain      | `[number, number]` | 数据映射区间                                | `[ 0, 8000 ]` |
| noDataValue | `number`           | 不会显示的值                                | `-9999999`    |
| rampColors  | `IRampColors`      | 值域映射颜色的色带                          | `/`           |

#### rampColors

1. 连续色带，根据 `colors` 和 `positions` 设置色带。
- `colors`  颜色数组
- `positions` 数据区间

配置值域映射颜色的色带，值域的范围为 `[0 - 1]`, 对应的我们需要为每一个 `position` 位置设置一个颜色值。

⚠️ `colors`, `positions` 的长度要相同。

```javascript
layer.style({
  rampColors: {
    colors: ['#FF4818', '#F7B74A', '#FFF598', '#91EABC', '#2EA9A1', '#206C7C'],
    positions: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
  },
});
```
2. 枚举色带
枚举模式下色带不再是连续的，而是分段的，同时用户可以选择直接传入颜色或者指定具体的分布。

- 直接传入
```js
layer.style({
  rampColors: {
    c1: '#f00',
    c2: '#ff0'
  },
});
```
c1 和 c2 平均分布，前一半色带为 #f00，后一半为 #ff0。

- 指定具体的分布
```js
layer.style({
  rampColors: {
    c1: [0, 0.3 '#f00'],
    c2: [0.3, 1.0, '#ff0']
  },
});
```
c1 和 c2 三七分布，前三色带为 #f00，后七为 #ff0。

- 混合使用
```js
layer.style({
  rampColors: {
    c1: [0, 0.3 '#f00'],
    c2: '#0f0',
    c3: [0.7, 1.0, '#ff0']
  },
});
```
在混合使用的情况下，使用直接传入方式指定的色值会填满空隙，上面的分布 c1:c2:c3 为 3:4:3

- 默认色
当用户仅指定部分色值分布或者使用错误的颜色值时，其余色值用默认色进行填充，可以动过 default 指定默认色，未指定时默认色为 #fff。
```js
layer.style({
  rampColors: {
    c1: [0, 0.3 '#f00'],
  },
});

// => 上面的写法在内部会被默认填充
layer.style({
  rampColors: {
    c1: [0, 0.3 '#f00'],
    defaultFill: '#fff' // 等价写法
  },
});

layer.style({
  rampColors: {
    default: '#ff0', // 指定默认填充色
    c1: [0, 0.3 '#f00'],
    defaultFill: '#ff0' // 等价写法
  },
});
```