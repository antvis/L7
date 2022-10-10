#### vertex height

线图层支持给每个顶点赋予高度值，同时允许用户在 style 方法中通过 vertexHeightScale 属性设置高度比例。

```javascript
const layer = new LineLayer({})
  .source(data)
  .size(1)
  .shape('line')
  .style({
    vertexHeightScale: 30,
  })
  .color('#ccc');

scene.addLayer(layer);
```

带有高度值的数据

```javascript
{
"type": "FeatureCollection",
"name": "tw",
"crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
"features": [
  {
    "type": "Feature",
    "properties": { },
    "geometry": {
      "type": "LineString", "coordinates":
      [
        [ 121.519153647, 25.288692533, 41.0 ],
        [ 121.529153646999987, 25.288692533, 35.0 ],
        [ 121.539153647, 25.288692533, 27.0 ],
        [ 121.549153647, 25.288692533, 66.0 ],
        [ 121.559153646999988, 25.288692533, 83.0 ],
        [ 121.569153647, 25.288692533, 88.0 ]
      ]
    }
  },
...
}

```

<img width="450px" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*8TXwR7XbeLIAAAAAAAAAAAAAARQnAQ'>

[在线案例](../../../examples/line/isoline#height)
