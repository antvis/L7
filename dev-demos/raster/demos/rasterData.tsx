// @ts-ignore
import { RasterLayer, Scene } from '@antv/l7';
// @ts-ignore
import { GaodeMapV2 } from '@antv/l7-maps';
import React, { useEffect } from 'react';
import * as GeoTIFF from 'geotiff';

async function getTiffData() {
  // const response = await fetch(
  //   'https://gw.alipayobjects.com/os/rmsportal/XKgkjjGaAzRyKupCBiYW.dat',
  // );
  const response = await fetch('http://127.0.0.1:8080/OUTPUT_clip.tif');
  const arrayBuffer = await response.arrayBuffer();
  const tiff = await GeoTIFF.fromArrayBuffer(arrayBuffer);
  const image = await tiff.getImage();
  const width = image.getWidth();
  const height = image.getHeight();
  const values = await image.readRasters();
  console.log(values);
  return {
    data: values[0],
    width,
    height,
    min: 0,
    max: 8000,
  };
}

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMapV2({
        center: [121.268, 30.3628],
        zoom: 3,
      }),
    });

    scene.on('loaded', async () => {
      const tiffdata = await getTiffData();

      const layer = new RasterLayer({});
      layer
        .source(tiffdata.data, {
          parser: {
            type: 'raster',
            width: tiffdata.width,
            height: tiffdata.height,
            min: 0,
            max: 80,
            extent: [73.482190241, 3.82501784112, 135.106618732, 57.6300459963],
          },
        })
        .style({
          heightRatio: 100,
          opacity: 0.8,
          domain: [0, 2000],
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

      layer.on('click', (e) => {
        console.log(e);
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
