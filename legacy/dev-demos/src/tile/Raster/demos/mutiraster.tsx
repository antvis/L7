import { RasterLayer, Scene, Source } from '@antv/l7';
import { Map } from '@antv/l7-maps';
import React, { useEffect } from 'react';
import * as GeoTIFF from 'geotiff';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
     
      map: new Map({
        center: [129.54663, 46.42832],
        zoom: 10,
        style: 'dark',
      }),
    });

    scene.on('loaded', () => {
      const url1 =
      'https://tiles{1-3}.geovisearth.com/base/v1/img/{z}/{x}/{y}?format=webp&tmsIds=w&token=b2a0cfc132cd60b61391b9dd63c15711eadb9b38a9943e3f98160d5710aef788';
    const url2 =
      'https://tiles{1-3}.geovisearth.com/base/v1/cia/{z}/{x}/{y}?format=png&tmsIds=w&token=b2a0cfc132cd60b61391b9dd63c15711eadb9b38a9943e3f98160d5710aef788';
    const layer1 = new RasterLayer({
      zIndex: 1,
    }).source(url1, {
      parser: {
        type: 'rasterTile',
        tileSize: 256,
      },
    });

    const layer2 = new RasterLayer({
      zIndex: 12,
    }).source(url2, {
      parser: {
        type: 'rasterTile',
        tileSize: 256,
        zoomOffset:0,
      },
    });
          const layer = new RasterLayer({
            mask: false,
            zIndex:10,
          });
          const urls = [
            {
              url: 'https://ganos.oss-cn-hangzhou.aliyuncs.com/tmp/landsat08/B04/{z}/{x}/{y}.tiff',
              bands: [0]
            },
            {
              url: 'https://ganos.oss-cn-hangzhou.aliyuncs.com/tmp/landsat08/B05/{z}/{x}/{y}.tiff',
              bands: [0]
            }
          ]

          const tileSource = new Source(
            urls,
            {
              zoomOffset:1,
              parser: {
                type: 'rasterTile',
                dataType: 'arraybuffer',
                tileSize: 256,
                operation: {
                  type:'nd'
                },
                format: async (data,bands) => {
                  const tiff = await GeoTIFF.fromArrayBuffer(data);
                  const image = await tiff.getImage();
                  const width = image.getWidth();
                  const height = image.getHeight();
                  const values = await image.readRasters();
                  return { 
                    rasterData: values[0], width, height 
                  }
                }
                  
      
              },
              
            },
          );

          layer.source(tileSource).style({
            domain: [-0.3, 0.5],
            clampLow: true,
            noDataValue:0,
            opacity:1,
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
          scene.addLayer(layer1);
          scene.addLayer(layer2);
          scene.addLayer(layer);

        
    });

    return () => {
      scene.destroy();
    };
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
