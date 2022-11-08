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
      const url1 = 'http://localhost:3333/luochuan2.tif';
      const tiffdata = await getTiffData(url1);

      const layer = new RasterLayer({})
      layer.source([
        {
          data: tiffdata,
          bands: [0, 1, 2, 3],
        },
      ], {
          parser: {
            type: 'rasterRgb',
            format: async (data, bands) => {
              const tiff = await GeoTIFF.fromArrayBuffer(data);
              const imageCount = await tiff.getImageCount();
              console.log('imageCount', imageCount, bands)

              
              // const image = await tiff.getImage();
              // const width = image.getWidth();
              // const height = image.getHeight();
              // const value0 = await image.readRasters();

              const image1 = await tiff.getImage(2);
              const value1 = await image1.readRasters();
              // console.log(value1)

              // const image2 = await tiff.getImage(2);
              // const value2 = await image2.readRasters();
              // console.log(value2)

              const value = value1;
              return [
                // { rasterData: value0[0], width, height },
                // { rasterData: value1[0], width, height },
                // { rasterData: value2[0], width, height }
                { rasterData: value[0], width: value.width, height: value.height },
                { rasterData: value[1], width: value.width, height: value.height },
                { rasterData: value[2], width: value.width, height: value.height },
                { rasterData: value[3], width: value.width, height: value.height }
              ];
            },
            operation: { 
              // blue green red nir
              // 标准真彩色 rgb
              // r: ['-', ['band', 2], 155],
              // g: ['-', ['band', 1], 184],
              // b: ['-', ['band', 0], 295],

              // // 标准假彩色 4，3，2
              // r: ['-', ['band', 3], 295],
              // g: ['-', ['band', 2], 184],
              // b: ['-', ['band', 1], 295],

                // 标准假彩色 4，3，2
                

                // r: ['*', ['/', ['band', 3], 234], 255],
                // g: ['*', ['/', ['band', 2], 296], 255],
                // b: ['*', ['/', ['band', 1], 296], 255],

                // r: ['-', ['band', 3], 234],
                // g: ['-', ['band', 2], 296],
                // b: ['-', ['band', 1], 296],

              // r: ['/', ['band', 3], 234],
              // g: ['/', ['band', 2], 296],
              // b: ['/', ['band', 1], 296],


              // r: ['/', ['band', 3], 2],
              // g: ['/', ['band', 2], 2],
              // b: ['/', ['band', 1], 2],


              // r: ['band', 3],
              // g: ['band', 2],
              // b: ['band', 1],

              r: ['-', ['band', 3], 113],
              g: ['-', ['band', 2], 155],
              b: ['-', ['band', 1], 184],
            },
            extent: [73.482190241, 3.82501784112, 135.106618732, 57.6300459963],
          },
        })
        .style({
          // opacity: 0.8,
          // channelRMax: 96,
          // channelGMax: 112,
          // channelBMax: 141

          // channelRMax: 150,
          // channelGMax: 131,
          // channelBMax: 141

          // channelRMax: 234,
          // channelGMax: 296,
          // channelBMax: 296

          channelRMax: 234 - 133,
          channelGMax: 296 - 155,
          channelBMax: 296 - 184

          // channelRMax: 255,
          // channelGMax: 255,
          // channelBMax: 255
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
