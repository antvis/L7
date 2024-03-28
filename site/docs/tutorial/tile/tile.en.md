---
title: Tile
order: 0
---

<embed src="@/docs/api/common/style.md"></embed>

Compared with ordinary layers, tile layers have many things to pay attention to when using them.

### option

When initializing tiles, in addition to those supported by ordinary layers`options`In addition to parameters, we also need to set parameters related to vector data in advance.

- `featureId`: string
  - For customizable designation. Used to specify the pick highlight of the tile.
- `sourceLayer`: string
  - It must be passed in and must exist in the returned vector data to specify which layer data in the vector data to draw.

```javascript
const layer = new RasterLayer({
  featureId: 'id',
  sourceLayer: 'water',
});
```

#### Mask

The mask of the tile layer is the same as that of the ordinary layer.`options`Medium settings`mask、maskfence`Parameters are enough, but the vector tile layer does not support setting masks for the time being.

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

In some scenarios, especially those involving vector tile maps, the same tile data will contain data from multiple layers at the same time. In this case, we need to reuse the same tile for multiple layers.`source`object. As shown in the figure below, we use the same data to draw the areas, boundaries and names of provinces and cities. At this time we should reuse`source`object.

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

In use, the operation of the tile layer binding event is consistent with that of the ordinary layer event, but in the return parameters of the event, the tile layer merges the distributed data in order to obtain the completeness of the current layer. data.

```javascript
layer.on('click', e => {...})；
```
