### 设置虚线

线图层通过在 style 中设置线的类型，同时指定虚线部分和实线部分

```javascript
const layer = new LineLayer({})
.source(data)
.size(1.5)
.shape('line')
.color('标准名称', ['#5B8FF9', '#5CCEA1', '#F6BD16'])
.active(true)
.style({
  lineType: 'dash',
  dashArray: [5, 5],
});
scene.addLayer(layer);
```

<img width="450px" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*pb3FRZnaa0AAAAAAAAAAAAAAARQnAQ'>

- lineType
默认为 solid，表示实线，dash 表示虚线
- dashArray[len1: number, len2: number]
len1 实线长度
len2 间隔长度

[在线案例](../../../examples/line/arc#trip_arc_dark_linear)
