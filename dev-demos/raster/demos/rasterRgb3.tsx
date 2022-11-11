// @ts-ignore
import { RasterLayer, Scene } from '@antv/l7';
// @ts-ignore
import { Map } from '@antv/l7-maps';
import React, { useEffect } from 'react';
import * as GeoTIFF from 'geotiff';

async function getTiffData(url: string) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  return arrayBuffer;
}

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      map: new Map({
        center: [129.84688399962705, 46.66599711239799],
        zoom: 10,
      }),
    });

    scene.on('loaded', async () => {
      const url2 =
        'https://t0.tianditu.gov.cn/img_w/wmts?tk=b72aa81ac2b3cae941d1eb213499e15e&';

      const layer2 = new RasterLayer({
        zIndex: 1,
      }).source(url2, {
        parser: {
          type: 'rasterTile',
          tileSize: 256,
          wmtsOptions: {
            layer: 'img',
            tileMatrixset: 'w',
            format: 'tiles',
          },
        },
      });
      scene.addLayer(layer2);
      const url1 =
        'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*XKLhRY67iPgAAAAAAAAAAAAADmJ7AQ/original';
      const tiffdata = await getTiffData(url1);

      const layer = new RasterLayer({ zIndex: 10 });
      layer
        .source(
          [
            {
              data: tiffdata,
              bands: [0, 1, 2, 3],
            },
          ],
          {
            parser: {
              type: 'rasterRgb',
              format: async (data, bands) => {
                const tiff = await GeoTIFF.fromArrayBuffer(data);

                const image1 = await tiff.getImage();
                const value1 = await image1.readRasters();

                const value = value1;

                return [
                  {
                    rasterData: value[0],
                    width: value.width,
                    height: value.height,
                  },
                  {
                    rasterData: value[1],
                    width: value.width,
                    height: value.height,
                  },
                  {
                    rasterData: value[2],
                    width: value.width,
                    height: value.height,
                  },
                  {
                    rasterData: value[3],
                    width: value.width,
                    height: value.height,
                  },
                ];
              },
              operation: {
                r: ['-', ['band', 0], 1831],
                g: ['-', ['band', 1], 1649],
                b: ['-', ['band', 2], 1424],
              },
              extent: [
                129.80688399962705, 46.63599711239799, 129.88665024933522,
                46.695215826300725,
              ],
            },
          },
        )
        .style({
          channelRMax: 2402 - 1831,
          channelGMax: 2374 - 1649,
          channelBMax: 2440 - 1424,
        });
      scene.addLayer(layer);
    });
  }, []);
  return (
    <div
      id="map"
      style={{
        height: '500px',
        position: 'relative',
      }}
    />
  );
};
