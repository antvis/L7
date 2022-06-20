---
title: 瓦片
order: 3
redirect_from:
  - /zh/docs/tutorial
---
`markdown:docs/common/style.md`

## 🌟 初始化指定矢量图层数据参数

在初始化矢量瓦片的时候往往需要我们提前设置矢量数据相关的参数。

```javascript
const layer = new PointLayer({
  featureId: 'id', // 指定矢量图层拾取高亮时的编码参数
  sourceLayer: 'wood', // 指定绘制矢量数据中那一图层数据
});
```

## 🌟 多图层复用地图服务

在有些场景下，尤其是是矢量瓦片地图的场景，同一份瓦片数据会同时包含多图层的数据，此时我们需要让多图层复用同一个 `source` 对象。如下图所示，我们使用同一份数据绘制省市的面、边界和名称，此时我们就应该复用 `source` 对象。

<img width="80%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*cMFMTqF7WoIAAAAAAAAAAAAAARQnAQ'>

```javascript
  const tileSource = new Source(
    'http://localhost:3000/file.mbtiles/{z}/{x}/{y}.pbf',
    {
      parser: {
        type: 'mvt',
        tileSize: 256,
        zoomOffset: 0,
        maxZoom: 9,
        extent: [-180, -85.051129, 179, 85.051129],
      },
    });
  const option = {
    featureId: 'NAME_CHN',
    sourceLayer: 'city'
  }
  const linelayer = new LineLayer(option)
    .source(tileSource)
    .color('#f00')
    .size(1)
    .style({
      opacity: 0.5,
    });
  this.scene.addLayer(linelayer);

  const polygonlayer = new PolygonLayer(option)
    .source(tileSource)
    .color('citycode', (v: string) => {
        return getRandomColor(v);
      }
    })
    .style({
      opacity: 0.4,
    })
    .select(true);
  this.scene.addLayer(polygonlayer);

  const pointlayer = new PointLayer(option)
    .source(tileSource)
    .shape('NAME_CHN', 'text')
    .color('#f00')
    .size(12)
    .style({
      stroke: '#fff',
      strokeWidth: 2,
    });

  this.scene.addLayer(pointlayer);
```

## Mask

🌟 瓦片图层的掩模使用和普通的图层一样，不过矢量瓦片图层暂时不支持设置掩模。

## 底图

🌟 瓦片图层可以用作 L7 的地图底图，同时推荐使用 `L7Map`，这样我们就可以在一个 L7 实例中减少一个 `webgl` 实例。

## 矢量图层的鼠标事件

在使用上，矢量图层绑定事件的操作和普通图层事件保持一致。

```javascript
layer.on('click', e => {...})
```

🌟 在事件的返回参数中，L7 内部对图形的数据做了合并的操作，以求获取到当前图层的完整数据。  
🌟 目前矢量瓦片支持的事件如下：

```javascript
layer.on('click', (e) => {});
layer.on('mousemove', (e) => {});
layer.on('mouseup', (e) => {});
layer.on('mouseenter', (e) => {});
layer.on('mouseout', (e) => {});
layer.on('mousedown', (e) => {});
layer.on('contextmenu', (e) => {});

// out side
layer.on('unclick', (e) => {});
layer.on('unmouseup', (e) => {});
layer.on('unmousedown', (e) => {});
layer.on('uncontextmenu', (e) => {});
```