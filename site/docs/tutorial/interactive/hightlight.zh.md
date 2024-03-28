---
title: 图层高亮
order: 0
---

<embed src="@/docs/api/common/style.md"></embed>

地理可视化除了数据展示，还需要用户交互，用户交互一般分为两种。

- 图层交互
- 数据交互

### 图层交互

鼠标在可视化图层上进行相关操作，然后图层会有相应的响应。`L7` 的 `Layer` 图层目前原生支持两种交互能力。

- `active` 鼠标滑过高亮
- `select` 鼠标选中高亮

#### active(activeOption | boolean): void

- 开启或者关闭 `mousehover` 元素高亮效果。
- `activeOption`
  - `color`: 高亮颜色
  - `mix`: 可选参数，默认为 0，表示高亮颜色是指定纯色，最大有效值是1，表示高亮色全部是底色

```javascript
// 开启 Active  使用默认高亮颜色
layer.active(true);

//  开启 Active  自定义高亮颜色

layer.active({
  color: 'red',
  mix: 0.6,
});

// 关闭高亮效果
layer.active(false);
```

#### select(selectOption | boolean): void

- 开启或者关闭 `mouseclick` 元素选中高亮效果。
- `selectOption`
  - `color`: 选中高亮颜色
  - `mix`: 可选参数，默认为 0，表示选中高亮颜色是指定纯色，最大有效值是1，表示选中高亮色全部是底色

```javascript
// 开启 Active  使用默认高亮颜色
layer.select(true);

//  开启 Active  自定义高亮颜色

layer.select({
  color: 'red',
  mix: 0.6,
});

// 关闭高亮效果
layer.select(false);
```

### 数据交互

有些时候我们可能需要直接指定某个数据高亮，比如鼠标点击数据面板的数据，我们需要高亮地图对应的元素。

#### setActive(id: number): void

```javascript
layer.setActive(id);
```

#### setSelect(id: number): void

```javascript
layer.setSelect(id);
```
