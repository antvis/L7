## 图层事件

### inited 图层初始化
<description> _bool_ **可选** _default:_ null</description>

参数 option

- target 当前 layer
- type 事件类型

图层初始化完成后触发

```javascript
layer.on('inited', (option) => {});
```

### add 图层被添加

图层添加到 scene

参数 option

- target 当前 layer
- type 事件类型

### remove 图层被移除

图层移除时触发

参数 option

- target 当前 layer
- type 事件类型
