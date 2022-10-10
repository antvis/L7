// @ts-ignore
import { RasterLayer, Scene } from '@antv/l7';
// @ts-ignore
import { GaodeMap } from '@antv/l7-maps';
import React, { useEffect } from 'react';
import * as GeoTIFF from 'geotiff';

async function getTiffData(url: string) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  return arrayBuffer
}

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        center: [121.268, 30.3628],
        zoom: 3,
      }),
    });

    scene.on('loaded', async () => {
      const url1 = 'https://gw.alipayobjects.com/os/rmsportal/XKgkjjGaAzRyKupCBiYW.dat';
      const url2 = 'https://gw.alipayobjects.com/zos/antvdemo/assets/light_clip/lightF182013.tiff'
      const tiffdata = await getTiffData(url1);
      const tiffdata2 = await getTiffData(url2);

      const layer = new RasterLayer({})
      layer.source([
        {
          data: tiffdata,
          bands: [0],
        },
        {
          data: tiffdata2,
          bands: [0],
        }
      ], {
          parser: {
            type: 'rasterRgb',
            format: async (data, bands) => {
              // console.log(bands, )
              const tiff = await GeoTIFF.fromArrayBuffer(data);
              const imageCount = await tiff.getImageCount();
              console.log('imageCount', imageCount, bands)

              const image = await tiff.getImage();
              const width = image.getWidth();
              const height = image.getHeight();
              const values = await image.readRasters();
              return { rasterData: values[0], width, height };
            },
            // operation: (allBands) => {
            //   return allBands[0].rasterData;
            // },
            // operation: ['+', ['band', 0], 1],
            operation: {
              r: ['*', ['band', 1], 1],
              g: ['*', ['band', 1], 1],
              b: ['*', ['band', 1], 1],
            },
            extent: [73.482190241, 3.82501784112, 135.106618732, 57.6300459963],
          },
        })
        .style({
          // opacity: 0.8,
          channelRMax: 100,
          channelGMax: 100,
          channelBMax: 100
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
