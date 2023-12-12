// @ts-ignore
import { RasterLayer, Scene } from '@antv/l7';
// @ts-ignore
import { Map } from '@antv/l7-maps';
import * as GeoTIFF from 'geotiff';
import React, { useEffect } from 'react';

async function getTiffData() {
  const response = await fetch(
    'https://gw.alipayobjects.com/os/rmsportal/XKgkjjGaAzRyKupCBiYW.dat',
  );
  const arrayBuffer = await response.arrayBuffer();
  return arrayBuffer;
}

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      renderer: 'device',
      map: new Map({
        center: [105, 37.5],
        zoom: 2.5,
      }),
    });
    scene.on('loaded', () => {
      addLayer();
    });
    async function getTiffData() {
      const response = await fetch(
        'https://gw.alipayobjects.com/zos/antvdemo/assets/light_clip/lightF182013.tiff',
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
      };
    }

    async function addLayer() {
      const tiffdata = await getTiffData();

      const layer = new RasterLayer({
        zIndex: 2,
        visible: true,
      });
      layer
        .source(tiffdata.data, {
          parser: {
            type: 'raster',
            width: tiffdata.width,
            height: tiffdata.height,
            extent: [
              73.4821902409999979, 3.8150178409999995, 135.1066187319999869,
              57.6300459959999998,
            ],
          },
        })
        .style({
          clampLow: false,
          clampHigh: false,
          domain: [0, 90],
          nodataValue: 0,
          rampColors: {
            // type:'quantize',
            // colors:['#1b9e77','#d95f02','#7570b3','#e7298a','#66a61e','#e6ab02'],
            colors: [
              'rgba(92,58,16,0)',
              'rgba(92,58,16,0)',
              '#fabd08',
              '#f1e93f',
              '#f1ff8f',
              '#fcfff7',
            ],
            positions: [0, 0.05, 0.1, 0.25, 0.5, 1.0],
          },
        });
      //   const raster = new RasterLayer({
      //     zIndex: 2,
      //     maskLayers: [layer],
      //     visible: true,
      //     enableMask: true,
      // }).source(
      //     'https://tiles{1-3}.geovisearth.com/base/v1/img/{z}/{x}/{y}?format=webp&tmsIds=w&token=b2a0cfc132cd60b61391b9dd63c15711eadb9b38a9943e3f98160d5710aef788',
      //     {
      //         parser: {
      //             type: 'rasterTile',
      //             tileSize: 256,
      //         },
      //     },
      // ).style({
      //     opacity: 1
      // });
      // scene.addLayer(raster);
      scene.addLayer(layer);
      scene.startAnimate();
    }
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
