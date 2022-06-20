---
title: RasterTile
order: 7
---

`markdown:docs/common/style.md`

L7 加载栅格瓦片地图的时候需要在 `source` 中对瓦片服务进行解析，同时配置瓦片服务的请求参数。

## parser

- type string 固定值为 `rasterTile`
- tileSize number 请求瓦片的大小
- zoomOffset number 瓦片请求瓦片层级的偏移
- maxZoom number 瓦片加载最大 `zoom`
- minZoom number 瓦片加载最小 `zoom`
- extent [number, number, number, number] 地图显示范围
- dataType string 固定值为 `image`|`arraybuffer`，用于区分普通的栅格瓦片和数据栅格瓦片
- format func 在 `dataType` 为 `arraybuffer` 的时候生效，用于将栅格数据格式化为标准数据

```javascript
const rasterSource = new Source(
  'http://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
  {
    parser: {
      type: 'rasterTile',
      tileSize: 256,
      zoomOffset: 0,
      extent: [-180, -85.051129, 179, 85.051129],
    },
  },
);

const rasterDataSource = new Source(
  'http://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
  {
    parser: {
      type: 'rasterTile',
      dataType: 'arraybuffer',
      tileSize: 256,
      zoomOffset: 0,
      extent: [-180, -85.051129, 179, 85.051129],
      format: async (data: any) => {
        const blob: Blob = new Blob([new Uint8Array(data)], {
          type: 'image/png',
        });
        const img = await createImageBitmap(blob);
        ctx.clearRect(0, 0, 256, 256);
        ctx.drawImage(img, 0, 0, 256, 256);
        let imgData = ctx.getImageData(0, 0, 256, 256).data;
        let arr = [];
        for (let i = 0; i < imgData.length; i += 4) {
          const R = imgData[i];
          const G = imgData[i + 1];
          const B = imgData[i + 2];
          const d = -10000 + (R * 256 * 256 + G * 256 + B) * 0.1;
          arr.push(d);
        }
        return {
          rasterData: arr,
          width: 256,
          height: 256,
        };
      },
    },
  },
);
```
