// @ts-ignore
import { PointLayer, RasterLayer, Scene } from '@antv/l7';
// @ts-ignore
import { GaodeMap } from '@antv/l7-maps';

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

const scene = new Scene({
  id: 'map',

  map: new GaodeMap({
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
scene.on('loaded', async () => {
  const tiffdata = await getTiffData();
  const maskPointData = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {},
        geometry: {
          coordinates: [110.64070700180974, 38.725170221383365],
          type: 'Point',
        },
      },
      {
        type: 'Feature',
        properties: {},
        geometry: {
          coordinates: [117.05859241946035, 41.44428218345186],
          type: 'Point',
        },
      },
      {
        type: 'Feature',
        properties: {},
        geometry: {
          coordinates: [114.98363698367831, 37.113784885036424],
          type: 'Point',
        },
      },
      {
        type: 'Feature',
        properties: {},
        geometry: {
          coordinates: [118.77967948635097, 37.47208097958061],
          type: 'Point',
        },
      },
      {
        type: 'Feature',
        properties: {},
        geometry: {
          coordinates: [113.729012766695, 39.22535473120385],
          type: 'Point',
        },
      },
    ],
  };

  const maskPoint = new PointLayer({
    visible: false,
  })
    .source(maskPointData)
    .shape('circle')
    .size(100000)
    .color('#f00')
    .style({
      opacity: 0.5,
      unit: 'meter',
    });
  const layer = new RasterLayer({
    maskLayers: [maskPoint],
  });
  const mindata = -0;
  const maxdata = 8000;
  layer
    .source(tiffdata.data, {
      parser: {
        type: 'raster',
        width: tiffdata.width,
        height: tiffdata.height,
        extent: [73.482190241, 3.82501784112, 135.106618732, 57.6300459963],
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
  scene.addLayer(maskPoint);
});
