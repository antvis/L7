import { TestScene } from '@antv/l7-test-utils';
import Zoom from '../src/control/zoom';

describe('zoom', () => {
  const scene = TestScene();

  it('life cycle', () => {
    const zoom = new Zoom();
    scene.addControl(zoom);

    const container = zoom.getContainer();
    expect(container.parentElement).toBeInstanceOf(HTMLElement);

    scene.removeControl(zoom);
    expect(container.parentElement).not.toBeInstanceOf(HTMLElement);
  });

  it('zoom getDefault', () => {
    const zoom = new Zoom();
    scene.addControl(zoom);

    zoom.disable();
    const btnList = Array.from(zoom.getContainer().querySelectorAll('button'));
    expect(btnList.map((item) => item.getAttribute('disabled'))).toEqual([
      'true',
      'true',
    ]);
    zoom.enable();
    expect(btnList.map((item) => item.getAttribute('disabled'))).toEqual([
      null,
      null,
    ]);
  });
});
