import { TestScene } from '@antv/l7-test-utils';
import MapTheme from '../src/control/mapTheme';

describe('mapTheme', () => {
  const scene = TestScene();

  it('life cycle', () => {
    const control = new MapTheme({});
    scene.addControl(control);

    const container = control.getContainer();
    expect(container.parentElement).toBeInstanceOf(HTMLElement);

    scene.removeControl(control);
    expect(container.parentElement).not.toBeInstanceOf(HTMLElement);
  });

  it('mapTheme', () => {
    const control = new MapTheme({
      defaultValue: 'normal',
    });
    scene.addControl(control);

    const options = control.getOptions().options;
    expect(options.length).toEqual(0);
    expect(control.getSelectValue()).toEqual('normal');
  });
});
