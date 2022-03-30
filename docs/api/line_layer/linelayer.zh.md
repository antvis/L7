---
title: LineLayer
order: 0
---

`markdown:docs/common/style.md`

## 简介

L7 支持各种类型的线图层，包括平面路径、平面弧线、平面虚线、平面动画、3D 弧线等等。用户通过切换 shape 的参数，以及配置对应 shape 的线图层支持的 style 样式，可以得到各种类型的线。

✨ 不同的 lineLayer 会支持不同的相关特性，具体的使用可以请查看详细的文档

<img width="60%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*MxnRTrzcawcAAAAAAAAAAAAAARQnAQ'>

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

### size

线图层 不仅可以设置宽度，还可以设置线的高度

- size 类型为 number 则表示 line 的宽度
- size 类型为 [number , number] 分别表示宽度和高度

```javascript
lineLayer.size(1); // 线的宽度为 1
lineLayer.size([1, 2]); // 宽度为1，高度2
```

### texture

线图层支持了纹理贴图的能力，不同 shape 的图层对 texturte 的支持情况会存在细微的差别，详细使用请查看相关图层的文档

`markdown:docs/api/line_layer/features/linear.zh.md`

`markdown:docs/api/line_layer/features/dash.zh.md`

`markdown:docs/api/line_layer/features/animate.zh.md`

`markdown:docs/api/line_layer/features/texture.zh.md`

`markdown:docs/api/line_layer/features/vertexHeight.zh.md`

`markdown:docs/common/layer/base.md`
