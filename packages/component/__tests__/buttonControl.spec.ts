import { TestScene } from '@antv/l7-test-utils';
import ButtonControl from '../src/control/baseControl/buttonControl';
import { createL7Icon } from '../src/utils/icon';

class TestControl extends ButtonControl {}

describe('buttonControl', () => {
  const scene = TestScene();

  it('life cycle', () => {
    const control = new TestControl();
    scene.addControl(control);

    const container = control.getContainer();
    expect(container.parentElement).toBeInstanceOf(HTMLElement);

    scene.removeControl(control);
    expect(container.parentElement).not.toBeInstanceOf(HTMLElement);
  });

  it('disable', () => {
    const control = new TestControl();
    scene.addControl(control);
    control.setIsDisable(true);

    expect(control.getContainer().getAttribute('disabled')).not.toBeNull();
    control.setIsDisable(false);

    expect(control.getContainer().getAttribute('disabled')).toBeNull();
  });

  it('options', () => {
    const control = new TestControl({
      title: '导出图片',
      btnText: '导出图片',
      btnIcon: createL7Icon('l7-icon-tupian'),
    });
    scene.addControl(control);

    const container = control.getContainer();
    expect(container.classList).toContain('l7-button-control');
    expect(container.getAttribute('title')).toContain('导出图片');
    const textContainer = container.querySelector('.l7-button-control__text')!;
    expect(textContainer).toBeInstanceOf(HTMLElement);

    control.setOptions({
      title: undefined,
      btnText: '替换文本',
      btnIcon: createL7Icon('l7-icon-tupian1'),
    });

    expect(container.getAttribute('title')).toBeFalsy();
  });
});
