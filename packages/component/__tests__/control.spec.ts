import { TestScene } from '@antv/l7-test-utils';
import { DOM } from '@antv/l7-utils';
import { Control } from '../src/control/baseControl';
import { Zoom } from '../src/control/zoom';

class TestControl extends Control {
  public onAdd(): HTMLElement {
    return DOM.create('div');
  }
  public onRemove(): void {
    return;
  }
}

describe('control', () => {
  const scene = TestScene();

  it('life cycle', () => {
    const className1 = 'testControl1';
    const className2 = 'testControl2';
    const control1 = new TestControl({
      className: className1,
    });
    const control2 = new TestControl({
      className: className2,
    });
    scene.addControl(control1);
    scene.addControl(control2);

    const dom1 = document.querySelector(`.${className1}`);
    expect(dom1).toBeInstanceOf(HTMLElement);
    const dom2 = document.querySelector(`.${className2}`);
    expect(dom2).toBeInstanceOf(HTMLElement);

    scene.removeControl(control1);
    scene.removeControl(control2);
    const dom3 = document.querySelector(`.${className1}`);
    expect(dom3).toBeNull();
    const dom4 = document.querySelector(`.${className2}`);
    expect(dom4).toBeNull();
  });

  it('show hide', () => {
    const control = new TestControl();
    scene.addControl(control);
    control.hide();
    expect(control.getContainer().classList).toContain('l7-control--hide');
    expect(control.getIsShow()).toEqual(false);
    control.show();
    expect(control.getContainer().classList).not.toContain('l7-control--hide');
    expect(control.getIsShow()).toEqual(true);
  });

  it('options', () => {
    const className = 'gunala';
    const color = 'rgb(255, 0, 0)';
    const control = new TestControl({});
    scene.addControl(control);
    control.setOptions({
      position: 'leftbottom',
      className,
      style: `color: ${color};`,
    });
    const container = control.getContainer();
    const corner = container.parentElement!;
    expect(corner.classList).toContain('l7-left');
    expect(corner.classList).toContain('l7-bottom');
    expect(container.classList).toContain(className);
    expect(container.style.color).toEqual(color);
  });

  // 测试自定义位置
  it('position', () => {
    const dom = document.createElement('div');
    const zoom = new Zoom({
      position: dom,
    });
    scene.addControl(zoom);
    expect(dom.firstChild).toEqual(zoom.getContainer());
  });
});
