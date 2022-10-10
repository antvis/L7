#### linearColor

线图层通过在 style 中设置起始颜色和终点颜色来设置颜色渐变，渐变色的优先级比 color 方法设置的颜色更高

```javascript
const layer = new LineLayer({})
  .source(data, {
    parser: {
      type: 'csv',
      x: 'lng1',
      y: 'lat1',
      x1: 'lng2',
      y1: 'lat2',
    },
  })
  .size(1)
  .shape('arc')
  .color('#8C1EB2')
  .style({
    sourceColor: '#f00', // 起点颜色
    targetColor: '#0f0', // 终点颜色
  });
```

<img width="450px" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*8DYQTZeQyZ4AAAAAAAAAAAAAARQnAQ'>

[在线案例](../../../examples/line/arc#trip_arc_dark_linear)
