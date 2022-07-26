## 图层更新方法

如果已经添加了图层，需要修改图层显示样式可以再次调用图形映射方法，然后调用 `scene.render()`更新渲染即可

### 样式更新

```javascript
layer.color('blue');
layer.size(10);
layer.style({});
scene.render();
```

### shape 更新

在在某些场景下切换 shape 的时候，我们需要重新构建图层元素的顶点构造。这意味着我们简单的改变当前图层的单一属性就达到更新图层的目的。  
L7 已经为某些图层的 shape 切换做了额外的处理，如 PointLayer 的 "circle" 切换 "cylinder" 等，具体哪些图层盒支持直接切换则需要用户查阅具体图层的文档。

🌟 在不支持直接切换 shape 的时候建议重新创建图层

### setData(data, option?: {})

更新 Source 数据

参数:

- data 数据
- option 默认和初始配置项一致，如果数据格式相同可不设置

调用 setData 方法会自动更新图层渲染

```javascript
layer.setData(data);
```

### setBlend(type: string)

设置图层叠加方法
参数：

- type blend 类型 normal ｜ additive ｜ subtractive ｜ max

### createModelData(data: any, option?: ISourceCFG)
- data 原始数据
- options 为可选参数，一般是解析数据的 parser，但是在某些特殊图层中还可能是其他的参数

```javascript
const modelData = layer.createModelData(data); // data 为 GeoJson

const modelData = layer.createModelData(data, { // data 为 json 数据
  parser: {
    type: 'json',
    x: 'lng',
    y: 'lat',
  },
});

const modelData = layer.createModelData([], { // 计算 planeGeometry 的 modelData
  widthSegments: 100,	// planeGeometry 的顶点和 widthSegments/heightSegments 相关
  heightSegments: 100,
});
```

🌟	在计算某些图层的 modelData 的时候我们需要考虑对应的时机，如 planeGeometry 在加载地形的时候
planeGeometry 的顶点位置和地形贴图相关，因此如果我们要计算实际地形顶点的模型数据，需要等待对应地形贴图加载完：

```javascript
let modelData10 = null, modelData100 = null;
layer.on('terrainImageLoaded', () => {
  modelData10 = layer.createModelData([], {
    widthSegments: 10,
    heightSegments: 10,
  });

  modelData100 = layer.createModelData([], {
    widthSegments: 100,
    heightSegments: 100,
  });
});
```

[在线案例](/zh/examples/geometry/geometry#terrain)
### updateModelData(data: IAttrubuteAndElements)
- data 是通过 createModelData 方法生成的图层的标准模型数据。        

我们通过这个方法可以实时更新图层的模型数据。        

[在线案例](/zh/examples/gallery/animate#timeline)