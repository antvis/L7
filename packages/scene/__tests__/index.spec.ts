// @ts-ignore
import { Mapbox } from '@antv/l7-maps';
import { Scene } from '../src/';
describe('template', () => {
  const el = document.createElement('div');
  el.id = 'test-div-id';
  el.style.width = '500px';
  el.style.height = '500px';
  document.querySelector('body')?.appendChild(el);
  const scene = new Scene({
    id: 'test-div-id',
    map: new Mapbox({
      style: 'dark',
      center: [110.19382669582967, 30.258134],
      pitch: 0,
      zoom: 3,
    }),
  });

  it('scene map method', () => {
    expect(scene.getZoom()).toEqual(3);
    expect(scene.getPitch()).toEqual(0);
  });
});
