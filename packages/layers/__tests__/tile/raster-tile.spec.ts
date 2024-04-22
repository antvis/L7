import type { Scene } from '@antv/l7-scene';
import { TestScene } from '@antv/l7-test-utils';
import RasterLayer from '../../src/raster/index';

describe('raster-tile', () => {
  let scene: Scene;
  beforeEach(() => {
    scene = TestScene();
  });
  it('rasterLayer raster', async () => {
    const url1 =
      'https://tiles{1-3}.geovisearth.com/base/v1/ter/{z}/{x}/{y}?format=webp&tmsIds=w&token=b2a0cfc132cd60b61391b9dd63c15711eadb9b38a9943e3f98160d5710aef788';
    const layer1 = new RasterLayer({
      zIndex: 1,
    }).source(url1, {
      parser: {
        type: 'rasterTile',
        tileSize: 256,
        zoomOffset: 0,
      },
    });

    scene.addLayer(layer1);
    scene.setZoom(12);
  });

  it('rasterLayer rgb', async () => {
    const layer = new RasterLayer()
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
          colors: ['#d73027', '#fc8d59', '#fee08b', '#d9ef8b', '#91cf60', '#1a9850'],
          positions: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
        },
      });

    scene.addLayer(layer);
    scene.setZoom(12);
  });
});
