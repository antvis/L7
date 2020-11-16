## 鼠标事件

鼠标事件回调参数 target

- x: number 鼠标  在地图位置 x 坐标
- y: number 鼠标  在地图位置 y 坐标
- type: string 鼠标事件类型
- lngLat: 经度度对象 {lng:number, lat: number }; 鼠标所在位置经纬度
- feature: any; 数据选中的地理要素信息
- featureId: number | null; 数据选中的地理要素的 ID

### 使用示例

```javascript
layer.on('click', (ev) => {}); // 鼠标左键点击图层事件
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


### click

点击事件

### mousemove

鼠标移动事件

### mouseout

鼠标移除

### mouseup

鼠标按下

### mousedown

鼠标向下

### contextmenu

鼠标右键

### unclick

点击未拾取到元素

### unmousemove

鼠标移动未拾取到元素

### unmouseup

鼠标抬起未拾取到元素

### unmousedown

鼠标按下未拾取到元素

### uncontextmenu

鼠标右键位拾取到元素

### unpick
所有鼠标事件未拾取到
