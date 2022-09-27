import { TestScene } from '@antv/l7-test-utils';
import Navigation from '../src/control/geoLocate';

describe('navigation', () => {
  const scene = TestScene();

  it('navigation', () => {
    const control = new Navigation({});
    scene.addControl(control);

    const button = control.getContainer() as HTMLDivElement;
    button.click();

    expect(button.parentElement).toBeInstanceOf(HTMLElement);
  });
});
