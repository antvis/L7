// @ts-ignore
import { RasterLayer, Scene } from '@antv/l7';
// @ts-ignore
import { GaodeMap } from '@antv/l7-maps';
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
      map: new GaodeMap({
        center: [110, 30.3628],
        zoom: 3,
      }),
    });

    scene.on('loaded', async () => {
      //
      const url1 =
        'https://gw.alipayobjects.com/os/rmsportal/XKgkjjGaAzRyKupCBiYW.dat';
      // 全国夜光图
      const url2 =
        'https://gw.alipayobjects.com/zos/antvdemo/assets/light_clip/lightF182013.tiff';
      const tiffdata = await getTiffData(url1);
      const tiffdata2 = await getTiffData(url2);
      // const rasterData = { data: tiffdata }
      const rasterData = [{ data: tiffdata }, { data: tiffdata2 }];

      const layer = new RasterLayer({});
      layer
        .source(rasterData, {
          parser: {
            type: 'raster',
            format: async (data, bands) => {
              // console.log('bands', bands)
              const tiff = await GeoTIFF.fromArrayBuffer(data);
              // const imageCount = await tiff.getImageCount();

              const image = await tiff.getImage();
              const width = image.getWidth();
              const height = image.getHeight();
              const values = await image.readRasters();
              return { rasterData: values[0], width, height };
            },
            operation: ['+', ['+', ['band', 0], 90], ['*', ['band', 1], 50]],
            min: 0,
            max: 80,
            extent: [73.482190241, 3.82501784112, 135.106618732, 57.6300459963],
          },
        })
        .style({
          opacity: 0.8,
          domain: [0, 4000],
          rampColors: {
            colors: [
              '#FF4818',
              '#F7B74A',
              '#FFF598',
              '#333',
              '#222',
              '#000',
            ].reverse(),
            positions: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
          },
        });

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
