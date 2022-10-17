import { TestScene } from '@antv/l7-test-utils';
import PopperControl from '../src/control/baseControl/popperControl';

class TestControl extends PopperControl {}

describe('popperControl', () => {
  const scene = TestScene();

  it('life cycle', () => {
    const control = new TestControl({});
    scene.addControl(control);

    const container = control.getContainer();
    expect(container.parentElement).toBeInstanceOf(HTMLElement);

    scene.removeControl(control);
    expect(container.parentElement).not.toBeInstanceOf(HTMLElement);
  });

  it('popper', () => {
    const control = new TestControl({
      popperTrigger: 'click',
    });
    scene.addControl(control);
  });

  it('options', () => {
    const control = new TestControl({});
    scene.addControl(control);
    const testClassName = 'testPopper';
    control.setOptions({
      popperClassName: testClassName,
    });
    expect(control.getPopper().getPopperDOM().classList).toContain(
      testClassName,
    );
  });
});
