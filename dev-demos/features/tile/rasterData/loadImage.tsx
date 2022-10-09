//@ts-ignore
import { Scene, RasterLayer } from '@antv/l7';
//@ts-ignore
import { Map } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map2',
      map: new Map({
        center: [105.732421875, 32.24997445586331],
        pitch: 0,
        style: 'dark',
        zoom: 2,
      }),
    });

    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    scene.on('loaded', () => {
      const layer = new RasterLayer();
      layer
        .source(
          'https://api.mapbox.com/v4/mapbox.terrain-rgb/{z}/{x}/{y}.pngraw?access_token=pk.eyJ1IjoiMTg5Njk5NDg2MTkiLCJhIjoiY2w3dHk3dnN4MDYzaDNycDkyMDl2bzh6NiJ9.YIrG9kwUpayLj01f6W23Gw',
        
          {
            parser: {
              type: 'rasterTile',
              dataType: 'arraybuffer',
              tileSize: 256,
              zoomOffset: 0,
              extent: [-180, -85.051129, 179, 85.051129],
              minZoom: 0,
              format: async (data: any) => {
                const blob: Blob = new Blob([new Uint8Array(data)], {
                  type: 'image/png',
                });
                const img = await createImageBitmap(blob);
                ctx.clearRect(0, 0, 256, 256);
                ctx.drawImage(img, 0, 0, 256, 256);
                const imgData = ctx.getImageData(0, 0, 256, 256).data;
                const arr: number[] = [];
                for (let i = 0; i < imgData.length; i += 4) {
                  const R = imgData[i];
                  const G = imgData[i + 1];
                  const B = imgData[i + 2];
                  const d = -10000 + (R * 256 * 256 + G * 256 + B) * 0.1;
                  arr.push(d);
                }
                return {
                  rasterData: arr,
                  width: 256,
                  height: 256,
                };
              },
            },
          },
        )
        .style({
          domain: [0, 1014],
          clampLow: true,
          rampColors: {
            colors: [
              '#f7fcf5',
              '#e5f5e0',
              '#c7e9c0',
              '#a1d99b',
              '#74c476',
              '#41ab5d',
              '#238b45',
              '#006d2c',
              '#00441b',
            ],
            positions: [0, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 1.0],
          },
        });

      scene.addLayer(layer)
    
    });
  }, []);

  return (
    <div
      id="map2"
      style={{
        height: '500px',
        position: 'relative',
      }}
    />
  );
};