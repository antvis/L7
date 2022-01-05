---
title: LineLayer
order: 0
---

`markdown:docs/common/style.md`

## 简介
L7 支持各种类型的线图层，包括平面路径、平面弧线、平面虚线、平面动画、3D弧线等等。用户通过切换 shape 的参数，以及配置对应 shape 的线图层支持的 style 样式，可以得到各种类型的线。

### shape

线图层支持 4 种 shape

- line 绘制路径图，
- arc 绘制弧线 通过贝塞尔曲线算法技术弧线
- greatcircle 大圆航线，地图两个点的最近距离不是两个点连线，而是大圆航线
- arc3d 3d 弧线地图 3D 视角

⚠️ 弧线只需要设置起止点坐标即可

```javascript
new LineLayer().source(data, {
  parser: {
    type: 'csv',
    x: 'lng1',
    y: 'lat1',
    x1: 'lng2',
    y1: 'lat2',
  },
});
```

如果 geojson 数据绘制弧线图 coordinates 第一对坐标为起点，第二对为终点

```javascript
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [
            106.5234375,
            57.51582286553883
          ],
          [
            136.40625,
            61.77312286453146
          ]
        ]
      }
    }
  ]
}

```

### size

线图层 可以设置高度

- size 类型为 number 则表示 line 的宽度
- size 类型为 [number , number] 分别表示宽度和高度

```javascript
lineLayer.size(1); // 线的宽度为 1
lineLayer.size([1, 2]); // 宽度为1，高度2
```

### 设置渐变色

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

### 设置顶点高度

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

[使用完整 demo](../../../examples/line/isoline#height)

`markdown:docs/common/layer/base.md`
