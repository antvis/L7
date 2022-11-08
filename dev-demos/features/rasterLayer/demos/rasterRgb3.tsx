// @ts-ignore
import { RasterLayer, Scene } from '@antv/l7';
// @ts-ignore
import { GaodeMapV2 } from '@antv/l7-maps';
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
      map: new GaodeMapV2({
        center: [121.268, 30.3628],
        zoom: 3,
      }),
    });

    scene.on('loaded', async () => {
      const url1 = 'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*-JRUT5u3IDcAAAAAAAAAAAAADmJ7AQ/original';
      const tiffdata = await getTiffData(url1);

      const layer = new RasterLayer({})
      layer.source([
        {
          data: tiffdata,
        },
      ], {
          parser: {
            type: 'rasterRgb',
            format: async (data, bands) => {
              const tiff = await GeoTIFF.fromArrayBuffer(data);
              const imageCount = await tiff.getImageCount();
              const image1 = await tiff.getImage();
              const value1 = await image1.readRasters();

              const value = value1;
              return [
  
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
