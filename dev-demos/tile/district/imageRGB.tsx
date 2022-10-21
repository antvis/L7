// @ts-ignore
import { Scene, RasterLayer } from '@antv/l7';
// @ts-ignore
import { Map } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      stencil: true,
      map: new Map({
        center: [112, 30],
        // zoom: 12,
        zoom: 3,
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
          'http://webst0{1-4}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
          {
            parser: {
              type: 'rasterTile',
              // dataType: 'arraybuffer',
              dataType: 'rgb',
              tileSize: 256,
              zoomOffset: 0,
              extent: [-180, -85.051129, 179, 85.051129],
              minZoom: 0,
              format: async (data: any) => {
                // console.log(bands)
                const blob: Blob = new Blob([new Uint8Array(data)], {
                  type: 'image/png',
                });
                const img = await createImageBitmap(blob);
                ctx.clearRect(0, 0, 256, 256);
                ctx.drawImage(img, 0, 0, 256, 256);
                const imgData = ctx.getImageData(0, 0, 256, 256).data;
                const channelR: number[] = [];
                const channelG: number[] = [];
                const channelB: number[] = [];
                for (let i = 0; i < imgData.length; i += 4) {
                  const R = imgData[i];
                  const G = imgData[i + 1];
                  const B = imgData[i + 2];
                  channelR.push(R);
                  channelG.push(G);
                  channelB.push(B);
                }
                return [
                  { rasterData: channelR, width: 256, height: 256 },
                  { rasterData: channelG, width: 256, height: 256 },
                  { rasterData: channelB, width: 256, height: 256 },
                ];
              },
              // operation: ['band', 0]
              // operation: (allBands) => {
              //   // console.log(allBands)
              //   return allBands[0].rasterData
              // }
              operation: {
                r: ['band', 0],
                g: ['band', 1],
                b: ['band', 2],
              },
            },
          },
        )
        .style({});

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
