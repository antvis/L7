import { TestScene } from '@antv/l7-test-utils';
import CityBuildingLayer from '../../src/citybuliding/building';
describe('CityBuildingLayer', () => {
  let scene: any;
  const data = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {
          base_height: 100,
        },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [119.948198, 30.339818],
              [120.344273, 30.513865],
              [120.414729, 30.288859],
              [120.346177, 30.160522],
              [120.100535, 30.041909],
              [119.906306, 30.094644],
              [119.845646, 30.175339],
              [119.81137, 30.244454],
              [119.807562, 30.352965],
              [119.948198, 30.339818],
            ],
          ],
        },
      },
    ],
  };
  beforeEach(() => {
    scene = TestScene();
  });

  it('CityBuildingLayer', () => {
    const cityLayer = new CityBuildingLayer();
    cityLayer
      .source(data)
      .size('base_height', [0, 500])
      .color('rgba(242,246,250,1.0)')
      .animate({
        enable: true,
      })
      .active({
        color: '#0ff',
        mix: 0.5,
      })
      .style({
        opacity: 0.7,
        baseColor: 'rgb(16, 16, 16)',
        windowColor: 'rgb(30, 60, 89)',
        brightColor: 'rgb(255, 176, 38)',
        sweep: {
          enable: true,
          sweepRadius: 2,
          sweepColor: '#1990FF',
          sweepSpeed: 0.5,
          sweepCenter: [120.145319, 30.238915],
        },
      });
    scene.addLayer(cityLayer);
  });
});
