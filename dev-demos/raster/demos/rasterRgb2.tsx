// @ts-ignore
import { RasterLayer, Scene } from '@antv/l7';
// @ts-ignore
import { GaodeMapV2 } from '@antv/l7-maps';
import React, { useEffect } from 'react';

async function getTiffData(url: string) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  return arrayBuffer;
}

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMapV2({
        center: [110, 30.3628],
        zoom: 3,
      }),
    });

    const canvas = document.createElement('canvas');
    const canvasSize = 256;
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    scene.on('loaded', async () => {
      const url1 =
        'https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*sV6gSYSdpl4AAAAAAAAAAAAAARQnAQ';
      const tiffdata = await getTiffData(url1);

      // Gray = R*0.299 + G*0.587 + B*0.114
      const grayExp = [
        '+',
        ['*', ['band', 0], 0.299],
        ['+', ['*', ['band', 1], 0.587], ['*', ['band', 2], 0.114]],
      ];
      const layer = new RasterLayer({});
      layer
        .source(
          [
            {
              data: tiffdata,
              bands: [0],
            },
          ],
          {
            parser: {
              type: 'rasterRgb',
              format: async (data, bands) => {
                const blob: Blob = new Blob([new Uint8Array(data)], {
                  type: 'image/png',
                });
                const img = await createImageBitmap(blob);

                ctx.clearRect(0, 0, canvasSize, canvasSize);
                ctx.drawImage(img, 0, 0, canvasSize, canvasSize);
                const imgData = ctx.getImageData(
                  0,
                  0,
                  canvasSize,
                  canvasSize,
                ).data;
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
                  {
                    rasterData: channelR,
                    width: canvasSize,
                    height: canvasSize,
                  },
                  {
                    rasterData: channelG,
                    width: canvasSize,
                    height: canvasSize,
                  },
                  {
                    rasterData: channelB,
                    width: canvasSize,
                    height: canvasSize,
                  },
                ];
              },
              // operation: (allBands) => {
              //   return allBands[0].rasterData;
              // },
              // operation: ['+', ['band', 0], 1],
              operation: {
                r: ['band', 0],
                g: ['band', 1],
                b: ['band', 2],
                // r: ['*', ['band', 0], 1],
                // g: ['*', ['band', 1], 1],
                // b: ['*', ['band', 2], 1],
                // r: grayExp,
                // g: grayExp,
                // b: grayExp,
              },
              extent: [
                73.482190241, 3.82501784112, 135.106618732, 57.6300459963,
              ],
            },
          },
        )
        .style({
          // opacity: 0.8,
          // channelRMax: 100,
          // channelGMax: 100,
          // channelBMax: 100
        });
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
        height: '500px',
        position: 'relative',
      }}
    />
  );
};
