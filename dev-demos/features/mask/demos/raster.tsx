// @ts-ignore
import { PolygonLayer, RasterLayer, Scene } from '@antv/l7';
// @ts-ignore
import { GaodeMap, Map } from '@antv/l7-maps';
import React, { useEffect } from 'react';

import * as GeoTIFF from 'geotiff';

async function getTiffData() {
  const response = await fetch(
    'https://gw.alipayobjects.com/os/rmsportal/XKgkjjGaAzRyKupCBiYW.dat',
    // 'https://gw.alipayobjects.com/zos/antvdemo/assets/2019_clip/ndvi_201905.tiff',
  );
  const arrayBuffer = await response.arrayBuffer();
  const tiff = await GeoTIFF.fromArrayBuffer(arrayBuffer);
  const image = await tiff.getImage();
  const width = image.getWidth();
  const height = image.getHeight();
  const values = await image.readRasters();
  return {
    data: values[0],
    width,
    height,
    min: 0,
    max: 8000,
  };
}

export default () => {
  // @ts-ignore
  useEffect(async () => {
    const scene = new Scene({
      id: 'map',
      renderer: process.env.renderer,
      map: new (process.env.CI ? Map : GaodeMap)({
        center: [120.165, 30.26],
        pitch: 0,
        zoom: 2,
        style: 'dark',
      }),
    });
    scene.addImage(
      '00',
      'https://gw.alipayobjects.com/zos/basement_prod/604b5e7f-309e-40db-b95b-4fac746c5153.svg',
    );

    const tiffdata = await getTiffData();

    fetch(
      'https://gw.alipayobjects.com/os/basement_prod/d2e0e930-fd44-4fca-8872-c1037b0fee7b.json',
    )
      .then((res) => res.json())
      .then((maskData) => {
        const polygonLayer = new PolygonLayer({
          visible: false,
        })
          .source(maskData)
          .shape('fill')
          .color('#f00')
          .style({ opacity: 0.5 });
        const layer = new RasterLayer({
          maskLayers: [polygonLayer],
        });
        const mindata = -0;
        const maxdata = 8000;
        layer
          .source(tiffdata.data, {
            parser: {
              type: 'raster',
              width: tiffdata.width,
              height: tiffdata.height,
              extent: [
                73.482190241, 3.82501784112, 135.106618732, 57.6300459963,
              ],
            },
          })
          .style({
            opacity: 0.8,
            domain: [mindata, maxdata],
            clampLow: true,
            rampColors: {
              colors: [
                'rgb(166,97,26)',
                'rgb(223,194,125)',
                'rgb(245,245,245)',
                'rgb(128,205,193)',
                'rgb(1,133,113)',
              ],
              positions: [0, 0.25, 0.5, 0.75, 1.0],
            },
          });
        scene.addLayer(layer);
        scene.addLayer(polygonLayer);
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
