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
        zoom: 12,
      }),
    });

    scene.on('loaded', async () => {
      const url1 =
        'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*XKLhRY67iPgAAAAAAAAAAAAADmJ7AQ/original';
      const tiffdata = await getTiffData(url1);
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

      const layer = new RasterLayer({
        zIndex: 10,
      });

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
              type: 'raster',
              format: async (data, bands) => {
                const tiff = await GeoTIFF.fromArrayBuffer(data);
                const image = await tiff.getImage();
                const width = image.getWidth();
                const height = image.getHeight();
                const values = await image.readRasters();
                return [
                  { rasterData: values[0], width, height }, // R
                  { rasterData: values[3], width, height }, // NIR
                ];
              },
              // blue green red nir
              // NDVI = ABS(NIR - R) / (NIR + R) = 近红外与红光之差 / 近红外与红光之和
              operation: [
                '/',
                ['-', ['band', 1], ['band', 0]], // R > NIR
                ['+', ['band', 1], ['band', 0]],
              ],
              extent: [
                129.80688399962705, 46.63599711239799, 129.88665024933522,
                46.695215826300725,
              ],
            },
          },
        )
        .style({
          domain: [-0.3, 0.5],
          rampColors: {
            colors: [
              '#ce4a2e',
              '#f0a875',
              '#fff8ba',
              '#bddd8a',
              '#5da73e',
              '#235117',
            ],
            positions: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
          },
        });

      scene.addLayer(layer2);
      scene.addLayer(layer);
    });
  }, []);
  return (
    <div
      id="map"
      style={{
        height: '60vh',
        position: 'relative',
      }}
    />
  );
};
