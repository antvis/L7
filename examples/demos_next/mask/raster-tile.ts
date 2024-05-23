import { PolygonLayer, RasterLayer } from '@antv/l7';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

export const rasterTile: TestCase = async (options) => {
  const scene = await CaseScene({
    ...options,
    mapConfig: {
      center: [121.434765, 31.256735],
      zoom: 14.83,
    },
  });

  const maskData = await fetch(
    'https://gw.alipayobjects.com/os/bmw-prod/fccd80c0-2611-49f9-9a9f-e2a4dd12226f.json',
  ).then((res) => res.json());

  const maskPolygon = new PolygonLayer({
    visible: false, // 隐藏maskPolygon
    autoFit: true,
  })
    .source(maskData)
    .shape('fill')
    .color('#f00')
    .style({
      opacity: 0.5,
    });
  const layer = new RasterLayer({
    maskLayers: [maskPolygon],
  })
    .source(
      'https://tiles{1-3}.geovisearth.com/base/v1/terrain_rgb/{z}/{x}/{y}?format=png&tmsIds=w&token=b2a0cfc132cd60b61391b9dd63c15711eadb9b38a9943e3f98160d5710aef788',
      {
        parser: {
          type: 'rasterTile',
          dataType: 'terrainRGB',
          tileSize: 256,
          zoomOffset: 0,
        },
      },
    )
    .style({
      clampLow: false,
      clampHigh: false,
      domain: [0, 7000],
      rampColors: {
        type: 'linear',
        colors: ['#d73027', '#fc8d59', '#fee08b', '#d9ef8b', '#91cf60', '#1a9850'],
        positions: [0, 200, 500, 1000, 2000, 7000], // '#1a9850'
      },
    });

  scene.addLayer(layer);
  scene.addLayer(maskPolygon);

  return scene;
};
