## 图层交互方法

### active(activeOption | boolean)

- 开启或者关闭 mousehover 元素高亮效果
- `activeOption`
  - `color`: 高亮颜色
  - `mix`: 可选参数，默认为 0，表示高亮颜色是指定纯色，最大有效值是1，表示高亮色全部是底色

```javascript
activeOption: {
  color: '#f00';
  mix: 0.6
}
```

```javascript
// 开启 Active  使用默认高亮颜色
layer.active(true);

//  开启 Active  自定义高亮颜色

layer.active({
  color: 'red',
  mix: .6
});

// 关闭高亮效果
layer.active(false);
```

### setActive(featureId: int)

根据元素 ID 设置指定元素 hover 高亮

🌟 指定元素高亮不等于图层高亮，一个图层包含多个元素，一般传入 source 的数据数组中有多少单条数据，一个图层就有多少元素

```javascript
layer.setActive(featureId);
```

### select(selectOption | boolean)

- 开启或者关闭 mouseclick 元素选中高亮效果
- selectOption
  - `color`: 选中高亮颜色
  - `mix`: 可选参数，默认为 0，表示选中高亮颜色是指定纯色，最大有效值是1，表示选中高亮色全部是底色

```javascript
selectOption: {
  color: '#f00';
  mix: .6
}
```

```javascript
// 开启 Active  使用默认高亮颜色
layer.select(true);

//  开启 Active  自定义高亮颜色

layer.select({
  color: 'red',
  mix: .6
});

// 关闭高亮效果
layer.select(false);
```

### setSelect(featureId: int)

根据元素 ID 设置指定元素 click 选中 高亮

🌟 指定元素高亮不等于图层高亮，一个图层包含多个元素，一般传入 source 的数据数组中有多少单条数据，一个图层就有多少元素

```javascript
layer.setSelect(featureId);
```

### getLegendItems(type: string)

获取图例配置

- type 图例类型

```javascript
layer.getLegendItems('color');

layer.getLegendItems('size');
```