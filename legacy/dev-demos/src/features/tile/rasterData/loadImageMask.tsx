//@ts-ignore
import { Scene, RasterLayer } from '@antv/l7';
//@ts-ignore
import { Mapbox } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map3',
     
      map: new Mapbox({
        center: [100, 30],
        pitch: 0,
        style: 'blank',
        zoom: 4,
      }),
    });
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    scene.on('loaded', () => {
      fetch(
        'https://gw.alipayobjects.com/os/basement_prod/d2e0e930-fd44-4fca-8872-c1037b0fee7b.json',
      )
        .then((res) => res.json())
        .then((data) => {
          const layer = new RasterLayer({
            mask: true,
            maskfence: data,
          });
          layer
            .source(
              'http://webst0{1-4}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
              {
                parser: {
                  type: 'rasterTile',
                  dataType: 'arraybuffer',
                  tileSize: 256,
             
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
                      arr.push(imgData[i]);
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
              opacity: 1,
              domain: [0, 256],
              clampLow: true,
              rampColors: {
                colors: [

                  'rgb(0,0,255)',
                  'rgb(0,0,0)',
                  'rgb(0,255,0)',
                  'rgb(255,0,0)',
                  'rgb(255,0,0)',
                ],
                positions: [0, 0.25, 0.5, 0.75, 1.0],
              },
            })
            .select(true);

          scene.addLayer(layer);

       
        });
    });
  }, []);

  return (
    <div
      id="map3"
      style={{
        height: '500px',
        position: 'relative',
      }}
    />
  );
};