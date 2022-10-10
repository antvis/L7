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

### setAutoFit(autoFit: boolean)
让用户可以主动设置图层的 autoFit 参数   
🌟 设置完该方法后会在图层发生更新的时候生效，如在 setData 之后触发    

```javascript
// 使用方法
layer.setAutoFit(true);
// 内部实现
public setAutoFit(autoFit: boolean): ILayer {
    this.updateLayerConfig({
      autoFit,
    });
    return this;
  }
```

### getScale(attr: string)
支持单独获取某个图形经过 scale 计算后的值，  满足用户获取图层某些 feature 值的需求。
- attr scale 的属性值   

```javascript
const data = [
  {lng: 120, lat: 30, name: 'n1'},
  {lng: 120, lat: 30, name: 'n2'}
]
const layer = new PointLayer()
	.source(data, {
		parser: {
    	x: 'lng',
      y: 'lat',
      type: 'json'
    }
  })
	.shape('circle')
	.color('name', ['#f00', '#ff0'])
	.size('name', [20, 40])

scene.addLayer(layer)


// 此时在 scene 上绘制两个点
// 一个颜色为黄色，大小为 40 的点，对应 name 为 n1
// 一个颜色为红色，大小为 20 的点，对应 name 为 n2

const colorScale = layer.getScale('color'); // 获取 color 方法产生的 scale
const color1 = colorScale('n1'); // '#ff0'
const color1 = colorScale('n2'); // '#f00'

const sizeScale = layer.getScale('size'); // 获取 size 方法产生的 scale
const size1 = sizeScale('n1'); // 40
const size2 = sizeScale('n2'); // 20
```
### getLegendItems(type: string)

获取图例配置

- type 图例类型

```javascript
layer.getLegendItems('color');

layer.getLegendItems('size');
```