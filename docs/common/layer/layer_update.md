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