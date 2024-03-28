import { TestScene } from '@antv/l7-test-utils';
import PointLayer from '../../src/point';
describe('pointLayer', () => {
  let scene: any;
  let layer: any;

  beforeEach(() => {
    scene = TestScene();
    layer = new PointLayer({
      name: 'layer',
    })
      .source(
        [
          {
            lng: 120,
            lat: 30,
            value: 1,
          },
          {
            lng: 121,
            lat: 31,
            value: 2,
          },
        ],
        {
          parser: {
            type: 'json',
            x: 'lng',
            y: 'lat',
          },
        },
      )
      .shape('circle')
      .filter('value', (v) => v > 0)
      .scale('value', {
        type: 'linear',
      })
      .active(true)
      .select(true)
      .rotate(30)
      .animate(true)
      .size(10)
      .color('red')
      .style({
        opacity: {
          field: 'value',
          value: [0, 1],
        },
      });
  });

  it('pontlayer fill init', () => {
    scene.addLayer(layer);
    layer.on('inited', () => {
      const data = layer.getEncodedData();
      expect(layer.inited).toBeTruthy();
      expect(data[0]).toEqual({
        id: 0,
        coordinates: [120, 30],
        shape: 'circle',
        rotate: 30,
        size: 10,
        color: [1, 0, 0, 1],
        opacity: 0,
      });
    });
  });
  it('pontlayer fill setdata', () => {
    scene.addLayer(layer);
    layer.on('inited', () => {
      layer.setData(
        [
          {
            lng: 121,
            lat: 32,
          },
          {
            lng: 122,
            lat: 33,
          },
        ],
        {
          parser: {
            type: 'json',
            x: 'lng',
            y: 'lat',
          },
        },
      );
      layer.getSource().on('update', () => {
        expect(layer.getSource().data.dataArray.length).toBe(2);
      });
    });
  });
  // destroy
  it('pontlayer fill destroy', () => {
    scene.addLayer(layer);
    layer.render();
    layer.on('inited', () => {
      layer.destroy();
      expect(layer.isDestroyed).toBeTruthy();
    });
  });
});
