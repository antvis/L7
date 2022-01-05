## 鼠标事件

鼠标事件回调参数 target

```javascript
layer.on(eventName, (target) => console.log(target));
```

- x: number 鼠标  在地图位置 x 坐标
- y: number 鼠标  在地图位置 y 坐标
- type: string 鼠标事件类型
- lngLat: 经度度对象 {lng:number, lat: number }; 鼠标所在位置经纬度
- feature: any; 数据选中的地理要素信息
- featureId: number | null; 数据选中的地理要素的 ID

### click

点击事件

```javascript
layer.on('click', (e) => console.log(e));
```

### mousemove

鼠标移动事件

```javascript
layer.on('mousemove', (e) => console.log(e));
```

### mouseout

鼠标移除

```javascript
layer.on('mouseout', (e) => console.log(e));
```

### mouseup

鼠标抬起

```javascript
layer.on('mouseup', (e) => console.log(e));
```

### mousedown

鼠标按下

```javascript
layer.on('mousedown', (e) => console.log(e));
```

### contextmenu

鼠标右键

```javascript
layer.on('contextmenu', (e) => console.log(e));
```

### unclick

点击未拾取到元素

```javascript
layer.on('unclick', (e) => console.log(e));
```

### unmousemove

鼠标移动未拾取到元素

```javascript
layer.on('unmousemove', (e) => console.log(e));
```

### unmouseup

鼠标抬起未拾取到元素

```javascript
layer.on('unmouseup', (e) => console.log(e));
```

### unmousedown

鼠标按下未拾取到元素

```javascript
layer.on('unmousedown', (e) => console.log(e));
```

### uncontextmenu

鼠标右键位拾取到元素

```javascript
layer.on('uncontextmenu', (e) => console.log(e));
```

### unpick

所有鼠标事件未拾取到

```javascript
layer.on('unpick', (e) => console.log(e));
```

使用示例

```javascript
layer.on('click', (ev) => {}); // 鼠标左键点击图层事件
layer.on('mouseenter', (ev) => {}); // 鼠标进入图层要素
layer.on('mousemove', (ev) => {}); // 鼠标在图层上移动时触发
layer.on('mouseout', (ev) => {}); // 鼠标移出图层要素时触发
layer.on('mouseup', (ev) => {}); // 鼠标在图层上单击抬起时触发
layer.on('mousedown', (ev) => {}); // 鼠标在图层上单击按下时触发
layer.on('contextmenu', (ev) => {}); // 图层要素点击右键菜单

// 鼠标在图层外的事件
layer.on('unclick', (ev) => {}); // 图层外点击
layer.on('unmousemove', (ev) => {}); // 图层外移动
layer.on('unmouseup', (ev) => {}); // 图层外鼠标抬起
layer.on('unmousedown', (ev) => {}); // 图层外单击按下时触发
layer.on('uncontextmenu', (ev) => {}); // 图层外点击右键
layer.on('unpick', (ev) => {}); // 图层外的操作的所有事件
```