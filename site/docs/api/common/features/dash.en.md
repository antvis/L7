#### dash

The line layer sets the line type in style and specifies the dotted line part and the solid line part at the same time.

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
  The default is solid, which represents a solid line, and dash represents a dotted line.
- dashArray\[len1: number, len2: number]
  len1 solid line length
  len2 interval length

[Online case](/examples/line/arc#trip_arc_dark_linear)
