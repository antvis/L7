import { TestScene } from '@antv/l7-test-utils';
import Fullscreen from '../src/control/fullscreen';

describe('fullscreen', () => {
  const scene = TestScene();

  it('fullscreen', () => {
    const control = new Fullscreen({});
    scene.addControl(control);

    const button = control.getContainer() as HTMLDivElement;
    button.click();

    expect(button.parentElement).toBeInstanceOf(HTMLElement);
  });
});
