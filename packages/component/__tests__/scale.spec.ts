import { TestScene } from '@antv/l7-test-utils';
import Scale from '../src/control/scale';

describe('scale', () => {
  const scene = TestScene();

  it('life cycle', () => {
    const scale = new Scale();
    scene.addControl(scale);

    const container = scale.getContainer();
    expect(container.parentElement).toBeInstanceOf(HTMLElement);

    expect(
      /\d+\s?km/i.test(
        container.querySelector('.l7-control-scale-line')?.innerHTML.toLowerCase() ?? '',
      ),
    ).toEqual(true);

    scale.setOptions({
      metric: false,
      imperial: true,
    });

    expect(
      /\d+\s?mi/i.test(
        container.querySelector('.l7-control-scale-line')?.innerHTML.toLowerCase() ?? '',
      ),
    ).toEqual(true);

    scene.removeControl(scale);
    expect(container.parentElement).not.toBeInstanceOf(HTMLElement);
  });
});
