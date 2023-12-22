#### vertex height

The line layer supports assigning a height value to each vertex and allows users to set the height scale through the vertexHeightScale property in the style method.

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

Data with height values

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

[Online case](/examples/line/isoline#height)
