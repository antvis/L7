---
title: LineLayer
order: 2
---
`markdown:docs/common/style.md`
## 线图层

### shape

线图层支持 4 种 shape

- line 绘制路径图，
- arc 绘制弧线 通过贝塞尔曲线算法技术弧线
- greatcircle 大圆航线，地图两个点的最近距离不是两个点连线，而是大圆航线
- arc3d 3d 弧线地图 3D 视角

⚠️ 弧线只需要设置起止点坐标即可

```
        new LineLayer()
        .source(data, {
          parser: {
            type: 'csv',
            x: 'lng1',
            y: 'lat1',
            x1: 'lng2',
            y1: 'lat2',
          },
        })
```

如果 geojson 数据绘制弧线图 coordinates 第一对坐标为起点，第二对为终点

```
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
`markdown:docs/common/layer/base.md`
