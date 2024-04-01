import { TestScene } from '@antv/l7-test-utils';
import Swipe from '../src/control/swipe';

describe('swipe', () => {
  const scene = TestScene();

  it('life cycle', () => {
    const swipe = new Swipe();
    scene.addControl(swipe);

    const container = swipe.getContainer();
    expect(container.parentElement).toBeInstanceOf(HTMLElement);

    scene.removeControl(swipe);
    expect(container.parentElement).not.toBeInstanceOf(HTMLElement);
  });
});
