---
title: 瓦片
order: 0
---

<embed src="@/docs/api/common/style.md"></embed>

瓦片图层相比于普通的图层而言，在使用上有许多需要注意的地方。

### option

在初始化瓦片的时候，除了普通图层支持的 `options` 参数之外，还需要需要我们提前设置矢量数据相关的参数。

- `featureId`: string
  - 用于可以自定义指定。用于指定瓦片的拾取高亮。
- `sourceLayer`: string
  - 用于必须传入，且要在返回的矢量数据中存在，指定绘制矢量数据中那一图层数据。

```javascript
const layer = new RasterLayer({
  featureId: 'id',
  sourceLayer: 'water',
});
```

#### Mask

瓦片图层的掩模使用和普通的图层一样，同样在 `options` 中设置 `mask、maskfence` 参数即可，不过矢量瓦片图层暂时不支持设置掩模。

```js
fetch('https://gw.alipayobjects.com/os/bmw-prod/fccd80c0-2611-49f9-9a9f-e2a4dd12226f.json')
  .then((res) => res.json())
  .then((maskData) => {
    const layer = new RasterLayer({
      mask: true,
      maskfence: maskData,
    });

    const tileSource = new Source(
      'https://ganos.oss-cn-hangzhou.aliyuncs.com/m2/l7/tiff_jx/{z}/{x}/{y}.tiff',
      {
        parser: {
          type: 'rasterTile',
          dataType: 'arraybuffer',
          tileSize: 256,
          maxZoom: 13.1,
          format: async (data) => {
            const tiff = await GeoTIFF.fromArrayBuffer(data);
            const image = await tiff.getImage();
            const width = image.getWidth();
            const height = image.getHeight();
            const values = await image.readRasters();
            return { rasterData: values[0], width, height };
          },
        },
      },
    );
    layer.source(tileSource).style({
      domain: [0.001, 11.001],
      clampLow: false,
      rampColors: {
        colors: colorList,
        positions,
      },
    });
    scene.addLayer(layer);
  });
```

### source

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

### event

在使用上，瓦片图层绑定事件的操作和普通图层事件保持一致，但是在事件的返回参数中，瓦片图层对分布的数据进行合并操作，以求获取到当前图层的完整数据。

```javascript
layer.on('click', e => {...})；
```
