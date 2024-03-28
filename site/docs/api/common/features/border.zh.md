#### border

线图层支持在 style 中设置边框的宽度和颜色

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
    borderWidth: 0.35, // 默认文 0，最大有效值为 0.5
    borderColor: '#888', // 默认为 #ccc
  });
```

<img width="450px" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*PsbNRpboEKEAAAAAAAAAAAAAARQnAQ'>

[在线案例](/examples/gallery/animate#animate_path_texture)
