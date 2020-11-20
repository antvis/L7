---
title: 图层高亮
order: 0
---
`markdown:docs/common/style.md`

地理可视化除了数据展示，还需要用户交互，用户交互一般分为两种
- 图层交互
- 数据交互

### 图层交互

鼠标在可视化图层上进行相关操作，然后图层会有相应的响应。L7 Layer图层目前原生支持两种地图
- active 鼠标滑过高亮
- select 鼠标选中高亮

#### active

[layer active](../../api/layer/layer/#图层交互方法)
```javascript
// 开启 Active  使用默认高亮颜色
layer.active(true)

//  开启 Active  自定义高亮颜色

layer.active({
  color: 'red'
})

// 关闭高亮效果
layer.active(false)

```

#### select
[layer active](../../api/layer/layer/#图层交互方法)

```javascript
// 开启 Active  使用默认高亮颜色
layer.select(true)

//  开启 Active  自定义高亮颜色

layer.select({
  color: 'red'
})

// 关闭高亮效果
layer.select(false)

```

### 数据交互

有些时候我们可能需要直接指定某个数据高亮，比如鼠标点击数据面板的数据，我们需要高亮地图对应的元素

#### setActive

```javascript
layer.setActive(id);
```

#### setSelect

```javascript
layer.setSelect(id);
```


