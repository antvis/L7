// @ts-ignore
import { RasterLayer, Scene, Source } from '@antv/l7';
// @ts-ignore
import { GaodeMap } from '@antv/l7-maps';
import React, { useEffect } from 'react';
import * as GeoTIFF from 'geotiff';

const colorList = [
  '#419bdf', // Water
  '#419bdf',

  '#397d49', // Tree
  '#397d49',

  '#88b053', // Grass
  '#88b053',

  '#7a87c6', // vegetation
  '#7a87c6',

  '#e49635', // Crops
  '#e49635',

  '#dfc35a', // shrub
  '#dfc35a',

  '#c4281b', // Built Area
  '#c4281b',

  '#a59b8f', // Bare ground
  '#a59b8f',

  '#a8ebff', // Snow
  '#a8ebff',

  '#616161', // Clouds
  '#616161'
];
const positions = [
  0.0,
  0.1,
  0.1,
  0.2,
  0.2,
  0.3,
  0.3,
  0.4,
  0.4,
  0.5,
  0.5,
  0.6,
  0.6,
  0.7,
  0.7,
  0.8,
  0.8,
  0.9,
  0.9,
  1.0
];
export default () => {

  useEffect(() => {
    const scene = new Scene({
      id: 'map',
     
      map: new GaodeMap({
        center: [ 116, 27 ],
        zoom: 6,
        style: 'dark'
      })
    });
    
    scene.on('loaded', () => {
      fetch(
        'https://gw.alipayobjects.com/os/bmw-prod/fccd80c0-2611-49f9-9a9f-e2a4dd12226f.json'
      )
        .then(res => res.json())
        .then(maskData => {
          const layer = new RasterLayer({
            mask: true,
            maskfence: maskData
          });
    
          // const urls = [
          //   'https://ganos.oss-cn-hangzhou.aliyuncs.com/m2/l7/tiff_jx/{z}/{x}/{y}.tiff',
          //   'https://ganos.oss-cn-hangzhou.aliyuncs.com/m2/l7/tiff_jx/{z}/{x}/{y}.tiff',
          // ]
          const urls = [
            {
              url: 'https://ganos.oss-cn-hangzhou.aliyuncs.com/m2/l7/tiff_jx/{z}/{x}/{y}.tiff',
              bands: [0]
            },
            {
              url: 'https://ganos.oss-cn-hangzhou.aliyuncs.com/m2/l7/tiff_jx/{z}/{x}/{y}.tiff'
              // default bands: [0]
            }
          ]
          const tileSource = new Source(urls,
            {
              parser: {
                type: 'rasterTile',
                dataType: 'arraybuffer',
                tileSize: 256,
                maxZoom: 13.1,
                format: async (data, bands) => {
                  // current raster file bands
                  console.log('bands', bands)

                  const tiff = await GeoTIFF.fromArrayBuffer(data);
                  const image = await tiff.getImage(bands[0]);
                  const width = image.getWidth();
                  const height = image.getHeight();
                  const values = await image.readRasters();
                  const rasterData = values[0];
                  
                  // return bandData | bandData[]
                  // return [{ rasterData, width, height }];
                  return { rasterData, width, height };
                },
                 // bands: [0, 1]
                operation: ['*', ['band', 0], 2],
                // operation: (allBands) => {
                //   const rasterData: number[] = [];
                //   const { width, height } = allBands[0];
                //   const length = width * height;
                //   const band0 = allBands[0];
                //   const band1 = allBands[1];
                  
                //   for(let i = 0;i < length; i++) {
                //     const v1 = band0.rasterData[i] | 0;
                //     const v2 = band1.rasterData[i] | 0;
                //     rasterData.push(v1 * (1/2) + v2 * (1/2))
                //   }
                //   return rasterData;
                //   // return bands[0].rasterData;
                // }
              }
            });
    
          layer.source(tileSource)
            .style({
              domain: [ 0.001, 11.001 ],
              clampLow: false,
              rampColors: {
                colors: colorList,
                positions
              }
            });
    
          scene.addLayer(layer);
        });
    });
    

  
    return () => {
      scene.destroy();
    };
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
