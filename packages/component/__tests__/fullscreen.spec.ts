import { TestScene } from '@antv/l7-test-utils';
import Fullscreen from '../src/control/fullscreen';

describe('fullscreen', () => {
  const scene = TestScene();

  it('life cycle', () => {
    const control = new Fullscreen({});
    scene.addControl(control);

    const container = control.getContainer();
    expect(container.parentElement).toBeInstanceOf(HTMLElement);

    scene.removeControl(control);
    expect(container.parentElement).not.toBeInstanceOf(HTMLElement);
  });

  it('fullscreen', () => {
    const control = new Fullscreen({});
    scene.addControl(control);

    const button = control.getContainer() as HTMLDivElement;
    button.click();

    expect(button.parentElement).toBeInstanceOf(HTMLElement);
  });
});
