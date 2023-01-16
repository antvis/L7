## 图层更新方法

如果已经添加了图层，需要修改图层显示样式可以再次调用图形映射方法，然后调用 `scene.render()`更新渲染即可

### scale 更新

重新调用scale 方法

```tsx
layer.scale('value',{
    type:'quantile'
})
scene.render();
```

### 数据映射

重新调用 color/size/filter/shape等方法

```javascript
layer.color('blue');
layer.size(10);

scene.render();
```


### layer.style

```javascript
layer.style({
    opacity:1
    
});

scene.render();
```

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