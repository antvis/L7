// @ts-ignore
import { RasterLayer, Scene, metersToLngLat } from '@antv/l7';
// @ts-ignore
import { Map } from '@antv/l7-maps';
import * as GeoTIFF from 'geotiff';
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
      renderer: 'device',
      map: new Map({
        center: [130.5, 47],
        zoom: 2,
      }),
    });

    scene.on('loaded', async () => {
      const url1 =
        'https://gw.alipayobjects.com/zos/raptor/1667920165972/china.tif';
      const tiffdata = await getTiffData(url1);
      const layer = new RasterLayer({
        zIndex: 10,
      });
      layer
        .source(
          [
            {
              data: tiffdata,
              bands: [0, 1, 2],
            },
          ],
          {
            parser: {
              type: 'rasterRgb',
              format: async (data, bands) => {
                const tiff = await GeoTIFF.fromArrayBuffer(data);
                const image1 = await tiff.getImage();
                const value = await image1.readRasters();

                return bands.map((band) => {
                  return {
                    rasterData: value[band],
                    width: value.width,
                    height: value.height,
                  };
                });
              },
              operation: {
                type: 'rgb',
                options: {},
              },
              extent: [
                ...metersToLngLat([
                  8182125.2558000003919005, 427435.8622000003233552,
                ]),
                ...metersToLngLat([
                  15038832.4410999994724989, 7087852.7587999999523163,
                ]),
              ],
            },
          },
        )
        .style({
          opacity: 1,
        });

      scene.startAnimate();
      scene.addLayer(layer);
    });
  }, []);

  return (
    <>
      <div
        id="map"
        style={{
          height: '60vh',
          position: 'relative',
        }}
      ></div>
    </>
  );
};
