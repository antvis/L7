// @ts-ignore
import { Mapbox } from '@antv/l7-maps';
import { Scene } from '../src/';
describe('template', () => {
  const el = document.createElement('div');
  el.id = 'test-div-id';
  el.style.width = '500px';
  el.style.height = '500px';
  el.style.position = 'absolute';
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
    const center = scene.getCenter();
    expect(center.lng).toEqual(110.19382669582967);
    expect(center.lat).toEqual(30.258134);
    expect(scene.getRotation()).toEqual(-0);
    expect(scene.getBounds()[0].map((v) => v.toFixed(5))).toEqual(
      [88.22117044582802, 9.751305353647084].map((v) => v.toFixed(5)),
    );
    scene.setZoom(5);
    expect(scene.getZoom()).toEqual(5);
    scene.setPitch(5);
    expect(scene.getPitch()).toEqual(5);
  });
});
