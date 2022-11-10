import { RasterLayer, Scene, Source } from '@antv/l7';
import { Map } from '@antv/l7-maps';
import React, { useEffect } from 'react';
import * as GeoTIFF from 'geotiff';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      stencil: true,
      map: new Map({
        center: [129.54663, 46.42832],
        zoom: 8,
        style: 'dark',
      }),
    });

    scene.on('loaded', () => {
      fetch(
        'https://gw.alipayobjects.com/os/bmw-prod/fccd80c0-2611-49f9-9a9f-e2a4dd12226f.json',
      )
        .then((res) => res.json())
        .then((maskData) => {
          const layer = new RasterLayer({
            mask: false,
            maskfence: maskData,
          });
          const urls = [
            {
              url: 'http://localhost:8080/LC08/B04/{z}/{x}/{y}.tiff',
              bands: [0]
            },
            {
              url: 'http://localhost:8080/LC08/B05/{z}/{x}/{y}.tiff',
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
                maxZoom: 13.1,
                operation: 'ndvi',
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
