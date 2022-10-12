---
title: Shape
order: 0
---

`markdown:docs/common/style.md`

### shape

线图层支持 5 种 shape

- line 绘制路径图，
- arc 绘制弧线 通过贝塞尔曲线算法技术弧线
- greatcircle 大圆航线，地图两个点的最近距离不是两个点连线，而是大圆航线
- arc3d 3d 弧线地图 3D 视角
- wall 基于线图层的一种特殊形式

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
