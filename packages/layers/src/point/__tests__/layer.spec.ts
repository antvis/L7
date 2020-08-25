import PointLayer from '../';
import { Mapbox } from '../../../../maps/src';
import { Scene } from '../../../../scene/src';
describe('pointLayer', () => {
  const el = document.createElement('div');
  el.id = 'test-div-id';
  el.style.width = '500px';
  el.style.height = '500px';
  document.querySelector('body')?.appendChild(el);

  const pointdata = {
    type: 'FeatureCollection',
    features: [],
  };
  it('init', () => {
    const scene = new Scene({
      id: 'test-div-id',
      map: new Mapbox({
        style: 'dark',
        center: [110.19382669582967, 30.258134],
        pitch: 0,
        zoom: 3,
      }),
    });
    scene.on('loaded', () => {
      const layer = new PointLayer()
        .source(pointdata)
        .color('red')
        .shape('circle')
        .size(5);
      scene.addLayer(layer);
      scene.render();
      layer.setData({
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Point',
              coordinates: [99.84374999999999, 32.54681317351514],
            },
          },
        ],
      });
      expect(layer.getEncodedData().length).toBe(1);
    });
  });
});
