---
title: Style
order: 4
---

<embed src="@/docs/common/style.md"></embed>

瓦片图层的 `style` 参数和使用的图层相关。如矢量点图层，`style` 的参数就是对应点图层的参数。

### raster tile

#### domain: [number, number]

设置数据映射的定义域。  
ps：固定值域为 `[0, 1]`，我们将传入的值（domain） 映射到值域 `[0, 1]` 后从 `rampColor` 构建的色带上取颜色，rgb 多通道栅格不支持。

#### clampLow/clampHigh: boolean

`clampLow` 的默认值为 `false`，设置为 `true`，低于 `domain` 的数据将不显示。  
`clampHigh` 的默认值为 `false`，设置为 `true`，高于 `domain` 的数据将不显示。

ps：rgb 多通道栅格不支持

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

ps：⚠️ color, position 的长度要相同，rgb 多通道栅格不支持

### vector tile

矢量图层的 `style` 样式和普通图层保持一致。

### event

🌟 数据栅格支持图层事件，目前图片栅格暂时不支持图层事件。

##### 绑定事件

🌟 数据栅格瓦片

```javascript
// 绑定事件的方式和普通图层保持一致
layer.on('click', e => {...})
```

#### 事件参数

🌟 数据栅格瓦片
数据栅格瓦片的事件参数相比于普通图层的事件返回了新的参数。

#### value: number

🌟 数据栅格瓦片
鼠标事件位置的瓦片的实际数值。
