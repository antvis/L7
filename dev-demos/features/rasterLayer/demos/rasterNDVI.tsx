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
          bands: [0, 1, 2, 3],
        },
      ], {
          parser: {
            type: 'raster',
            format: async (data, bands) => {
              const tiff = await GeoTIFF.fromArrayBuffer(data);
              console.log(tiff)
              const imageCount = await tiff.getImageCount();
              console.log('imageCount', imageCount, bands)

              
              // const image = await tiff.getImage();
              // const width = image.getWidth();
              // const height = image.getHeight();
              // const value0 = await image.readRasters();

              const image1 = await tiff.getImage(1);
              const value1 = await image1.readRasters();
              // console.log(value1)

              // const image2 = await tiff.getImage(2);
              // const value2 = await image2.readRasters();
              // console.log(value2)

              const value = value1;
              // console.log(value)
              return [
                // { rasterData: value0[0], width, height },
                // { rasterData: value1[0], width, height },
                // { rasterData: value2[0], width, height }
                // { rasterData: value[0], width: value.width, height: value.height },
                // { rasterData: value[1], width: value.width, height: value.height },
                { rasterData: value[2], width: value.width, height: value.height }, // R
                { rasterData: value[3], width: value.width, height: value.height }, // NIR
              ];
            },
            // blue green red nir
            // NDVI = ABS(NIR - R) / (NIR + R) = 近红外与红光之差 / 近红外与红光之和
            operation: ['/', 
              ['-', ['band', 0], ['band', 1]], // R > NIR
              ['+', ['band', 0], ['band', 1]]
            ],
            extent: [73.482190241, 3.82501784112, 135.106618732, 57.6300459963],
          },
        })
        .style({
          domain: [0, 0.25],
          rampColors: {
            colors: [ 'rgb(166,97,26)', 'rgb(223,194,125)', 'rgb(245,245,245)', 'rgb(128,205,193)', 'rgb(1,133,113)' ],
            positions: [ 0, 0.25, 0.5, 0.75, 1.0 ]
          },
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
