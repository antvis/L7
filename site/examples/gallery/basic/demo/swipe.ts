import { Map, RasterLayer, Scene, Swipe } from '@antv/l7';
import * as GeoTIFF from 'geotiff';

const scene = new Scene({
  id: 'map',
  map: new Map({
    pitch: 0,
    center: [-96, 37.8],
    zoom: 14,
  }),
});
async function getTiffData(url: string) {
  const response = await fetch(url);
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
scene.on('loaded', async () => {
  const colors = [
    '#d73027',
    '#f46d43',
    '#fdae61',
    '#fee08b',
    '#d9ef8b',
    '#a6d96a',
    '#66bd63',
    '#1a9850',
  ];
  const ndvi1 = await getTiffData(
    'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/file/A*sZpWQZK21NIAAAAAAAAAAAAADmJ7AQ/ndvi2022-03-01.glb',
  );
  const ndvi2 = await getTiffData(
    'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/file/A*JeHQTIzN4_kAAAAAAAAAAAAADmJ7AQ/ndvi2022-10-01.NDVI.glb',
  );

  // 影像地图图层
  const baseLayer = new RasterLayer({ zIndex: -1 }).source(
    'https://www.google.com/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}',
    {
      parser: {
        type: 'rasterTile',
        tileSize: 256,
        zoomOffset: 0,
      },
    },
  );

  const leftLayer = new RasterLayer({
    autoFit: true,
  })
    .source(ndvi1.data, {
      parser: {
        type: 'raster',
        width: ndvi1.width,
        height: ndvi1.height,
        extent: [-112.117293306503, 32.78212288135407, -111.77216057434428, 33.10568277278276],
      },
    })
    .style({
      clampLow: false,
      clampHigh: false,
      domain: [-1, 1],
      nodataValue: 0,
      rampColors: {
        type: 'linear',
        positions: [-0.4, -0.2, 0, 0.2, 0.4, 0.6, 0.8, 1.0], // 数据需要换成 0-1
        colors: colors,
      },
    });

  const rightLayer = new RasterLayer({})
    .source(ndvi2.data, {
      parser: {
        type: 'raster',
        width: ndvi2.width,
        height: ndvi2.height,
        extent: [-112.117293306503, 32.78212288135407, -111.77216057434428, 33.10568277278276],
      },
    })
    .style({
      clampLow: false,
      clampHigh: false,
      domain: [-1, 1],
      nodataValue: 0,
      rampColors: {
        type: 'linear',
        positions: [-0.4, -0.2, 0, 0.2, 0.4, 0.6, 0.8, 1.0], // 数据需要换成 0-1
        colors: colors,
      },
    });

  scene.addLayer(baseLayer);
  scene.addLayer(leftLayer);
  scene.addLayer(rightLayer);

  const swipe = new Swipe({
    orientation: 'vertical',
    ratio: 0.5,
    layers: [leftLayer],
    rightLayers: [rightLayer],
  });
  scene.addControl(swipe);
});
