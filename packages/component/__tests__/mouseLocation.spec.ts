import { TestScene } from '@antv/l7-test-utils';
import MouseLocation from '../src/control/mouseLocation';

describe('buttonControl', () => {
  const scene = TestScene();

  it('life cycle', () => {
    const control = new MouseLocation({});
    scene.addControl(control);

    const container = control.getContainer();
    expect(container.parentElement).toBeInstanceOf(HTMLElement);

    scene.removeControl(control);
    expect(container.parentElement).not.toBeInstanceOf(HTMLElement);
  });

  it('life cycle', () => {
    const control = new MouseLocation();
    scene.addControl(control);

    (scene.map as any).emit('mousemove', {
      lngLat: {
        lng: 120,
        lat: 30,
      },
    });

    expect(control.getLocation()).toEqual([120, 30]);
  });
});
