## 图层交互方法

### active 鼠标滑过高亮

开启或者关闭 mousehover 元素高亮效果

参数： activeOption | boolean

activeOption
-color 填充颜色

```javascript
// 开启 Active  使用默认高亮颜色
layer.active(true);

//  开启 Active  自定义高亮颜色

layer.active({
  color: 'red',
});

// 关闭高亮效果
layer.active(false);
```

### setActive 设置指定要素高亮

根据元素 ID 设置指定元素 hover 高亮

```javascript
layer.setActive(id);
```

### select 鼠标选中高亮

开启或者关闭 mouseclick 元素选中高亮效果

参数： selectOption | boolean

selectOption
-color 填充颜色

```javascript
// 开启 Active  使用默认高亮颜色
layer.select(true);

//  开启 Active  自定义高亮颜色

layer.select({
  color: 'red',
});

// 关闭高亮效果
layer.select(false);
```

### setSelect 设置指定要求选中

根据元素 ID 设置指定元素 click 选中 高亮

```javascript
layer.setSelect(id);
```
