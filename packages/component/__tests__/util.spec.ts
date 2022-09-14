import { DOM } from '@antv/l7-utils';
import { createL7Icon } from '../src/utils/icon';
import { Popper } from '../src/utils/popper';

describe('util', () => {
  it('icon', () => {
    const testClassName = 'l7-test-icon';
    const testIcon = createL7Icon(testClassName);
    expect(testIcon).toBeInstanceOf(SVGElement);
    expect(testIcon.tagName.toLowerCase()).toEqual('svg');
    const classList = testIcon.classList;
    expect(classList).toContain('l7-iconfont');
  });

  it('popper', () => {
    const button = DOM.create('button') as HTMLButtonElement;
    button.innerText = 'Test';
    document.body.append(button);

    const testContent = '123456';
    const popper1 = new Popper(button, {
      placement: 'left-start',
      trigger: 'click',
      content: testContent,
      className: 'test-popper-class',
      container: document.body,
      unique: true,
    });
    const getPopperClassList = (popper: Popper) => {
      return popper.popperDOM.classList;
    };
    popper1.show();

    expect(popper1.getContent()).toEqual(testContent);
    expect(getPopperClassList(popper1)).toContain('l7-popper');
    expect(getPopperClassList(popper1)).toContain('test-popper-class');
    expect(getPopperClassList(popper1)).toContain('l7-popper-left');
    expect(getPopperClassList(popper1)).toContain('l7-popper-start');
    expect(getPopperClassList(popper1)).not.toContain('l7-popper-hide');
    popper1.hide();

    button.click();
    expect(getPopperClassList(popper1)).not.toContain('l7-popper-hide');
    button.click();
    expect(getPopperClassList(popper1)).toContain('l7-popper-hide');

    const newTestContent = DOM.create('div') as HTMLDivElement;
    newTestContent.innerText = '789456';
    popper1.setContent(newTestContent);
    expect(popper1.contentDOM.firstChild).toEqual(newTestContent);
    popper1.show();

    const popper2 = new Popper(button, {
      placement: 'right-end',
      container: document.body,
      trigger: 'click',
      content: 'hover',
    }).show();
    expect(getPopperClassList(popper2)).toContain('l7-popper-end');
    expect(getPopperClassList(popper2)).toContain('l7-popper-right');

    const popper3 = new Popper(button, {
      placement: 'top-start',
      container: document.body,
      trigger: 'click',
      content: 'hover',
    }).show();
    expect(getPopperClassList(popper3)).toContain('l7-popper-top');
    expect(getPopperClassList(popper3)).toContain('l7-popper-start');

    const popper4 = new Popper(button, {
      placement: 'bottom-end',
      container: document.body,
      trigger: 'click',
      content: 'hover',
    }).show();
    expect(getPopperClassList(popper4)).toContain('l7-popper-bottom');
    expect(getPopperClassList(popper4)).toContain('l7-popper-end');

    const popper5 = new Popper(button, {
      placement: 'left',
      container: document.body,
      trigger: 'click',
      content: 'hover',
    }).show();
    expect(getPopperClassList(popper5)).toContain('l7-popper-left');

    const popper6 = new Popper(button, {
      placement: 'top',
      container: document.body,
      trigger: 'click',
      content: 'hover',
    }).show();
    expect(getPopperClassList(popper6)).toContain('l7-popper-top');
  });
});
