## 图层更新方法

如果已经添加了图层，需要修改图层显示样式可以再次调用图形映射方法，然后调用 `scene.render()`更新渲染即可

### 样式更新

```javascript
layer.color('blue');
layer.size(10);
layer.style({});
scene.render();
```

### setData

更新 Source 数据
参数:

- data 数据
- option 默认和初始配置项一致，如果数据格式相同可不设置

调用 setData 方法会自动更新图层渲染

```javascript
layer.setData(data);
```

### setBlend(type)

设置图层叠加方法
参数：

- type blend 类型
