import { TestScene } from '@antv/l7-test-utils';
import Zoom from '../src/control/zoom';

describe('zoom', () => {
  const zoom = new Zoom();
  it('zoom getDefault', () => {
    expect(zoom.getDefault().name).toEqual('zoom');
    const scene = TestScene();
    scene.addControl(zoom);
    zoom.disable();
  });
});
