import { TestScene } from '@antv/l7-test-utils';
import SelectControl from '../src/control/baseControl/selectControl';
import { createL7Icon } from '../src/utils/icon';

class SingleControl extends SelectControl {
  public getDefault(option: any): any {
    return {
      ...super.getDefault(option),
      options: [
        {
          icon: createL7Icon('icon-1'),
          label: '1',
          value: '1',
        },
        {
          icon: createL7Icon('icon-2'),
          label: '2',
          value: '2',
        },
      ],
      defaultValue: '2',
    };
  }

  protected getIsMultiple(): boolean {
    return false;
  }
}

// tslint:disable-next-line: max-classes-per-file
class MultiControl extends SelectControl {
  public getDefault(option: any): any {
    return {
      ...super.getDefault(option),
      options: [
        {
          img: '1',
          label: '1',
          value: '1',
        },
        {
          img: '1',
          label: '2',
          value: '2',
        },
      ],
      defaultValue: ['2'],
    };
  }
  protected getIsMultiple(): boolean {
    return true;
  }
}

describe('selectControl', () => {
  const scene = TestScene();

  it('life cycle', () => {
    const control = new SingleControl({});
    scene.addControl(control);

    const container = control.getContainer();
    expect(container.parentElement).toBeInstanceOf(HTMLElement);

    scene.removeControl(control);
    expect(container.parentElement).not.toBeInstanceOf(HTMLElement);
  });

  it('normal single select', () => {
    const control = new SingleControl({});
    scene.addControl(control);

    expect(control.getSelectValue()).toEqual('2');
    const popperContainer = control.getPopper().getContent() as HTMLDivElement;
    const optionDomList = Array.from(
      popperContainer.querySelectorAll('.l7-select-control-item'),
    ) as HTMLDivElement[];
    expect(optionDomList).toHaveLength(2);
    expect(optionDomList[0].getAttribute('data-option-value')).toEqual('1');
    expect(optionDomList[0].getAttribute('data-option-index')).toEqual('0');

    optionDomList[0].click();

    expect(control.getSelectValue()).toEqual('1');
  });

  it('img multiple select', () => {
    const control = new MultiControl({});
    scene.addControl(control);
    expect(control.getSelectValue()).toEqual(['2']);
    const popperContainer = control.getPopper().getContent() as HTMLDivElement;
    const optionDomList = Array.from(
      popperContainer.querySelectorAll('.l7-select-control-item'),
    ) as HTMLDivElement[];
    expect(optionDomList).toHaveLength(2);
    expect(optionDomList[0].getAttribute('data-option-value')).toEqual('1');
    expect(optionDomList[0].getAttribute('data-option-index')).toEqual('0');
    expect(popperContainer.querySelectorAll('img')).toHaveLength(2);

    optionDomList[0].click();
    expect(control.getSelectValue()).toEqual(['2', '1']);
    optionDomList[0].click();
    optionDomList[1].click();
    expect(control.getSelectValue()).toEqual([]);
  });
});
