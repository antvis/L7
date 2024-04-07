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
    expect(options.length).toBeGreaterThan(0);
    expect(control.getSelectValue()).toEqual('mapbox://styles/mapbox/streets-v11');

    const optionList = (control.getPopper().getContent() as HTMLDivElement).querySelectorAll(
      '.l7-select-control-item',
    ) as unknown as HTMLDivElement[];
    optionList[1].click();

    // expect(control.getSelectValue()).toEqual(
    //   'mapbox://styles/zcxduo/ck2ypyb1r3q9o1co1766dex29',
    // );
  });
});
