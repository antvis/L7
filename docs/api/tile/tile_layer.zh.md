---
title: 瓦片图层
order: 0
---

`markdown:docs/common/style.md`

L7 瓦片图层提供了对图片栅格瓦片、数据栅格瓦片、矢量瓦片的支持，通过使用瓦片图层，用户可以更加自由的选择地图底图，同时使用瓦片图层作为底图意味着不会增加 `webgl` 实例，对需要同时使用多个地图图表的情形更加友好。

## 支持多种瓦片图层

```javascript
// 栅格瓦片图层
import { RasterLayer } from '@antv/l7';

// 矢量瓦片图层
import { PointLayer } from '@antv/l7';
import { LineLayer } from '@antv/l7';
import { PolygonLayer } from '@antv/l7';
```

<img width="80%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*-FdGT60UpMkAAAAAAAAAAAAAARQnAQ'>

## source

L7 的瓦片图层复用了原有的普通图层，在使用上通过 `source` 来进行区分。

```javascript
import { Source } from '@antv/l7'
const RasterTileSource = new Source({
  'http://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
  {
    parser: {
      type: 'rasterTile',
      ...
    }
  }
})
// 普通图层在 source 中直接传入数据，而瓦片图层则在 source 中设置瓦片服务
// 设置栅格瓦片服务
layer.source(RasterTileSource)

const VectorTileSource = new Source({
  'http://ganos.oss-cn-hangzhou.aliyuncs.com/m2/rs_l7/{z}/{x}/{y}.pbf',
  {
    parser: {
      type: 'mvt',
      ...
    }
  }
})
// 设置矢量瓦片服务
layer.source(VectorTileSource)
```

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
