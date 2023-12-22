#### border

The line layer supports setting the width and color of the border in style

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
    borderWidth: 0.35, //The default value is 0, the maximum valid value is 0.5
    borderColor: '#888', // Default is #ccc
  });
```

<img width="450px" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*PsbNRpboEKEAAAAAAAAAAAAAARQnAQ'>

[Online case](/examples/gallery/animate#animate_path_texture)
