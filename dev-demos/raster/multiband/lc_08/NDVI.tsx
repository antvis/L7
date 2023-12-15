// @ts-ignore
import { RasterLayer, Scene } from '@antv/l7';
// @ts-ignore
import { Map } from '@antv/l7-maps';
import * as GeoTIFF from 'geotiff';
import React, { useEffect } from 'react';

async function getTiffData(url: string) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  return arrayBuffer;
}

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      renderer: 'device',
      map: new Map({
        center: [130.5, 47],
        zoom: 10.5,
      }),
    });

    scene.on('loaded', async () => {
      const url1 =
        'https://gw.alipayobjects.com/zos/raptor/1667832825992/LC08_3857_clip_2.tif';
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
      // NDBI 6,5
      // NDWI 3,5
      const layer = new RasterLayer({
        zIndex: 10,
      });

      layer
        .source(
          [
            {
              data: tiffdata,
              bands: [4, 5].map((v) => v - 1),
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
                  { rasterData: values[bands[0]], width, height }, // R
                  { rasterData: values[bands[1]], width, height }, // NIR
                ];
              },
              operation: {
                type: 'nd',
              },
              extent: [
                130.39565357746957, 46.905730725742366, 130.73364094187343,
                47.10217234153133,
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
