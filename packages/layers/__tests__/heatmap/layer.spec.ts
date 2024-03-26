import HeatmapLayer from '../../src/heatmap/index';

import { TestScene } from '@antv/l7-test-utils';
describe('pointLayer', () => {
  let scene: any;
  const data = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {
          value: 1,
        },
        geometry: {
          type: 'Point',
          coordinates: [120.08801, 30.353918],
        },
      },
      {
        type: 'Feature',
        properties: {
          value: 2,
        },
        geometry: {
          type: 'Point',
          coordinates: [120.112838, 30.284749],
        },
      },
      {
        type: 'Feature',
        properties: {
          value: 5,
        },
        geometry: {
          type: 'Point',
          coordinates: [120.185066, 30.318365],
        },
      },
      {
        type: 'Feature',
        properties: {
          value: 6,
        },
        geometry: {
          type: 'Point',
          coordinates: [120.134281, 30.343692],
        },
      },
      {
        type: 'Feature',
        properties: {
          value: 7,
        },
        geometry: {
          type: 'Point',
          coordinates: [120.162495, 30.302289],
        },
      },
      {
        type: 'Feature',
        properties: {
          value: 12,
        },
        geometry: {
          type: 'Point',
          coordinates: [120.183374, 30.290596],
        },
      },
      {
        type: 'Feature',
        properties: {
          value: 11,
        },
        geometry: {
          type: 'Point',
          coordinates: [120.134281, 30.331516],
        },
      },
      {
        type: 'Feature',
        properties: {
          value: 22,
        },
        geometry: {
          type: 'Point',
          coordinates: [120.13541, 30.308623],
        },
      },
      {
        type: 'Feature',
        properties: {
          value: 15,
        },
        geometry: {
          type: 'Point',
          coordinates: [120.137667, 30.298392],
        },
      },
      {
        type: 'Feature',
        properties: {
          value: 60,
        },
        geometry: {
          type: 'Point',
          coordinates: [120.155724, 30.345152],
        },
      },
      {
        type: 'Feature',
        properties: {
          value: 30,
        },
        geometry: {
          type: 'Point',
          coordinates: [120.157981, 30.338822],
        },
      },
      {
        type: 'Feature',
        properties: {
          value: 0,
        },
        geometry: {
          type: 'Point',
          coordinates: [120.10776, 30.32762],
        },
      },
    ],
  };

  beforeEach(() => {
    scene = TestScene();
  });

  it('HeatMapLayer grid', () => {
    const layer = new HeatmapLayer({
      autoFit: true,
    })
      .source(data, {
        transforms: [
          {
            type: 'hexagon',
            size: 5 * 1000,
          },
        ],
      })
      .shape('circle')
      .active(false)
      .color('#aaa')
      .style({
        coverage: 0.7,
        angle: 0,
      });
    scene.addLayer(layer);
  });

  it('HeatMapLayer heatmap', () => {
    const layer = new HeatmapLayer({})
      .source(data)
      .shape('heatmap')
      .size('value', [0, 1.0]) // weight映射通道
      .style({
        intensity: 2,
        radius: 20,
        rampColors: {
          colors: ['#FF4818', '#F7B74A', '#FFF598', '#91EABC', '#2EA9A1', '#206C7C'].reverse(),
          positions: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
        },
      });
    scene.addLayer(layer);
  });
  it('HeatMapLayer heatmap3d', () => {
    const layer = new HeatmapLayer({})
      .source(data)
      .size('value', [0, 1])
      .shape('heatmap3D')
      .style({
        intensity: 2,
        radius: 20,
        rampColors: {
          colors: ['#FF4818', '#F7B74A', '#FFF598', '#91EABC', '#2EA9A1', '#206C7C'].reverse(),
          positions: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
        },
      });
    scene.addLayer(layer);
  });
  it('HeatMapLayer grid3d', () => {
    const layer = new HeatmapLayer({
      autoFit: true,
    })
      .source(data, {
        transforms: [
          {
            type: 'grid',
            size: 1000,
            field: 'value',
            method: 'sum',
          },
        ],
      })
      .size('sum', [0, 600])
      .shape('hexagonColumn')
      .active(false)
      .color('#aaa')
      .style({
        coverage: 0.7,
        angle: 0,
      });
    scene.addLayer(layer);
  });
  it('HeatMapLayer grid', () => {
    const layer = new HeatmapLayer({
      autoFit: true,
    })
      .source(data, {
        transforms: [
          {
            type: 'grid',
            size: 5 * 1000,
          },
        ],
      })
      .shape('circle')
      .active(false)
      .color('#aaa')
      .style({
        coverage: 0.7,
        angle: 0,
      });
    scene.addLayer(layer);
  });
});
