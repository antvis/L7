// @ts-ignore
import { RasterLayer, Scene } from '@antv/l7';
// @ts-ignore
import { GaodeMap } from '@antv/l7-maps';
import React, { useEffect } from 'react';
import * as GeoTIFF from 'geotiff';

async function getTiffData() {
  const response = await fetch(
    'https://gw.alipayobjects.com/os/rmsportal/XKgkjjGaAzRyKupCBiYW.dat',
  );
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

      const tiffdata = await getTiffData();
      // const rasterData = { data: tiffdata }
      const rasterData = [
        { data: tiffdata },
        { data: tiffdata }
      ];

      const layer = new RasterLayer({})
      layer.source(rasterData, {
          parser: {
            type: 'raster',
            format: async (data, bands) => {
              // console.log('bands', bands)
              const tiff = await GeoTIFF.fromArrayBuffer(data);
              const image = await tiff.getImage();
              const width = image.getWidth();
              const height = image.getHeight();
              const values = await image.readRasters();
              return { rasterData: values[0], width, height };
             
            },
            // operation: (allBands) => {
            //   console.log(allBands)
            //   return allBands[0].rasterData;
            // },
            operation: ['*', ['band', 0], 1],
            min: 0,
            max: 80,
            extent: [73.482190241, 3.82501784112, 135.106618732, 57.6300459963],
          },
        })
        .style({
          heightRatio: 100,
          opacity: 0.8,
          domain: [0, 4000],
          rampColors: {
            colors: [
              '#FF4818',
              '#F7B74A',
              '#FFF598',
              '#91EABC',
              '#2EA9A1',
              '#206C7C',
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
        height: '500px',
        position: 'relative',
      }}
    />
  );
};